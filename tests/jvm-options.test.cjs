const assert = require('node:assert/strict')
const { spawn, spawnSync } = require('node:child_process')
const { readFileSync } = require('node:fs')
const { test } = require('node:test')
const { runInNewContext } = require('node:vm')
const ts = require('typescript')

function loadSource(file, modules, env = {}) {
  const exports = {}
  runInNewContext(
    ts.transpileModule(readFileSync(file, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS },
    }).outputText,
    {
      exports,
      console,
      process: { env },
      require: (name) => {
        assert.ok(name in modules, `Unexpected import: ${name}`)
        return modules[name]
      },
    },
  )
  return exports
}

async function daemonExec() {
  let launch
  const entrypoint = Symbol('image entrypoint')
  const mounts = { mountVolume: () => mounts, mountDependency: () => mounts }
  const chain = {
    addDaemon: (_id, daemon) => {
      launch = daemon.exec.fn
      return chain
    },
    addHealthCheck: () => chain,
  }
  const watch = () => ({ const: async () => null })
  const sdk = {
    setupMain: (fn) => fn,
    getOsIp: async () => '172.18.0.1',
    host: { getBridgeAddress: watch },
    SubContainer: { eager: async () => ({}) },
    Mounts: { of: () => mounts },
    Daemons: { of: () => chain },
    useEntrypoint: () => entrypoint,
  }
  const { main } = loadSource('startos/main.ts', {
    './sdk': { sdk },
    './i18n': { i18n: (value) => value },
    './utils': { electrumPort: 50001, stdoutLines: (fn) => fn },
    './fileModels/config.toml': {
      config: { read: watch, merge: async () => {} },
      excludedSubnetsForStartosProxy: () => [],
    },
    './fileModels/store.json': { store: { read: watch } },
    'bitcoin-core-startos/startos/utils': {
      rpcHostId: 'rpc',
      rpcPort: 8332,
      zmqHostId: 'zmq',
      zmqPortTransaction: 28333,
    },
    'electrs-startos/startos/utils': {
      electrumHostId: 'electrum',
      port: 50001,
    },
    'fulcrum-startos/startos/utils': {
      electrumPort: 50001,
      mainHostId: 'main',
    },
  })
  await main({ effects: {} })
  const exec = await launch()
  assert.equal(exec.command, entrypoint)
  assert.equal(exec.env.NETWORK, 'mainnet')
  return exec
}

const versions = loadSource('startos/versions/current.ts', {
  '@start9labs/start-sdk': { VersionInfo: { of: (value) => value } },
})

function imageFor(variant) {
  return loadSource(
    'startos/manifest/index.ts',
    {
      '@start9labs/start-sdk': { setupManifest: (value) => value },
      '../versions': versions,
      './i18n': {},
    },
    { VARIANT: variant },
  ).manifest.images.main
}

function platformImage(image, platform) {
  const result = spawnSync(
    'docker',
    ['buildx', 'imagetools', 'inspect', image, '--raw'],
    { encoding: 'utf8' },
  )
  assert.equal(result.status, 0, result.stderr)
  const index = JSON.parse(result.stdout)
  if (!index.manifests) return image
  const selected = index.manifests.find(
    (entry) =>
      entry.platform.os === 'linux' && entry.platform.architecture === platform,
  )
  assert.ok(selected, `Missing linux/${platform} image`)
  return `${image.split('@')[0]}@${selected.digest}`
}

async function launchUntilFlags(args, name) {
  return new Promise((resolve, reject) => {
    const child = spawn('docker', args)
    let output = ''
    let stopped = false
    const stop = () => {
      if (stopped) return
      stopped = true
      spawnSync('docker', ['rm', '-f', name], { stdio: 'ignore' })
    }
    const timer = setTimeout(() => {
      stop()
      reject(new Error(`JVM flag output timed out: ${output}`))
    }, 120000)
    const append = (data) => {
      output += data
      if (/^\s*bool\s+UseBASE64Intrinsics\s+=[^\r\n]*\r?\n/m.test(output)) stop()
    }
    child.stdout.on('data', append)
    child.stderr.on('data', append)
    child.once('error', (error) => {
      clearTimeout(timer)
      reject(error)
    })
    child.once('close', () => {
      clearTimeout(timer)
      resolve(output)
    })
  })
}

for (const variant of ['generic', 'nvidia', 'amd']) {
  const image = imageFor(variant)
  if (variant === 'nvidia') {
    test('NVIDIA uses the same mitigated launcher image as generic', async () => {
      assert.equal(image.nvidiaContainer, true)
      assert.equal(image.source.dockerTag, imageFor('generic').source.dockerTag)
      const exec = await daemonExec()
      assert.equal(exec.env.JAVA_TOOL_OPTIONS, '-XX:-UseBASE64Intrinsics')
    })
    continue
  }
  for (const arch of image.arch) {
    const platform = arch === 'x86_64' ? 'amd64' : 'arm64'
    test(`${variant}/${platform} real entrypoint disables Base64 intrinsics`, async () => {
      const exec = await daemonExec()
      const name = `frigate-jvm-${process.pid}-${variant}-${platform}`
      try {
        const output = await launchUntilFlags(
          [
            'run',
            '--rm',
            '--name',
            name,
            '--platform',
            `linux/${platform}`,
            '--network',
            'none',
            '-e',
            `NETWORK=${exec.env.NETWORK}`,
            '-e',
            `JAVA_TOOL_OPTIONS=${exec.env.JAVA_TOOL_OPTIONS ?? ''} -XX:+PrintFlagsFinal`,
            platformImage(image.source.dockerTag, platform),
          ],
          name,
        )
        console.info(
          output
            .split('\n')
            .filter((line) => /UseBASE64Intrinsics\s+=/.test(line))
            .join('\n'),
        )
        assert.match(
          output,
          /UseBASE64Intrinsics\s+= false\s+\{product\} \{environment\}/,
        )
      } finally {
        spawnSync('docker', ['rm', '-f', name], { stdio: 'ignore' })
      }
    })
  }
}
