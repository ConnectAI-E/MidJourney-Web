import { client } from 'kiss-core'

export async function getConfig (cacheName = 'cache_name', initConfig:any) {
  return await client.mg.clientStorage.getAsync(cacheName) ?? initConfig
}

export async function updateConfig (cacheName:string, newConfig: any) {
  await client.mg.clientStorage.setAsync(cacheName, newConfig)
}
