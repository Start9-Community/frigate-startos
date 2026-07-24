import { T } from '@start9labs/start-sdk'
import { sdk } from './sdk'
export { electrumHostId, electrumPort } from './constants'

export function bridgeAddress(
  effects: T.Effects,
  opts: { packageId: string; hostId: string; internalPort: number },
) {
  const watchable = async () => {
    const osIp = await sdk.getOsIp(effects)
    return sdk.host.get(
      effects,
      { packageId: opts.packageId, hostId: opts.hostId },
      (host) => {
        const port = host?.bindings[opts.internalPort]?.net.assignedPort
        return port == null ? null : `${osIp}:${port}`
      },
    )
  }
  return {
    const: async () => (await watchable()).const(),
    once: async () => (await watchable()).once(),
  }
}

export function parseCookie(cookie: string | null): [string, string] {
  const parts = cookie?.trim().split(':')
  if (!parts || parts.length !== 2) {
    throw new Error('Invalid .cookie format')
  }
  return [parts[0], parts[1]]
}

async function rpcCall(
  host: string,
  username: string,
  password: string,
  method: string,
  params: any[] = [],
) {
  const response = await fetch(host, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        'Basic ' + Buffer.from(`${username}:${password}`).toString('base64'),
    },
    body: JSON.stringify({
      jsonrpc: '1.0',
      id: 'rpccall',
      method,
      params,
    }),
  })

  const json = await response.json()
  if (json.error) {
    throw new Error(`RPC Error: ${JSON.stringify(json.error)}`)
  }
  return json.result
}

export async function getLatestBlockHeight(
  host: string,
  username: string,
  password: string,
): Promise<number> {
  const height = await rpcCall(host, username, password, 'getblockcount')
  return height
}
