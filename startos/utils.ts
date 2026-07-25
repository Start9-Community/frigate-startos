export { electrumHostId, electrumPort } from './constants'

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
