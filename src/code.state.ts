/**
 * @name: code.state.ts
 * @author: river
 * @date: 2023/3/19 4:42 PM
 * @contact: laolei@forkway.cn
 * @description：
 */


import { ref } from '@vue/reactivity'
import type { IAppConfig } from '../types/code.d'
import {getConfig, updateConfig} from './utils/operation/cache';

const initConfig: IAppConfig = {
    licence: "",
}

export const cacheName = 'license'
export const cache = ref<IAppConfig>()
export async function firstParserConfig() {
    if (!cache.value)
        cache.value = await getConfig(cacheName, initConfig)
    return cache.value
}

export async function updateNewConfig(licence: string) {
    const newConfig = {
        licence,
    }
    cache.value = newConfig
    await updateConfig(cacheName, newConfig)
}

