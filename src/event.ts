import type { MsgDto } from 'kiss-msg'

const notifyEvent = () => {
  return {
    NOTIFY: 'NOTIFY',
    WARN: 'WARN',
  }
}

const storageEvent = () => {
    return {
        STORAGE_SET: 'STORAGE_SET',
        STORAGE_GET: 'STORAGE_GET',
        STORAGE_REMOVE: 'STORAGE_REMOVE',
    }
}
const commonEvent = () => {
  return {
    UI_INIT: 'UI_INIT',
    UI_CLOSE: 'UI_CLOSE',
    CODE_INIT_CONFIG: 'CODE_INIT_CONFIG',

  }
}

const customEvent = () => {
  return {
    UI_UPDATE_LICENCE: 'UI_UPDATE_LICENCE',
    UI_QUERY_LICENCE: 'UI_QUERY_LICENCE',
    UI_QUERY_LICENCE_BACK: 'UI_QUERY_LICENCE_BACK',
    CODE_UPDATE_USER_UUID: 'CODE_UPDATE_USER_UUID',
  }
}

export const event = {
  ...storageEvent(),
  ...notifyEvent(),
  ...commonEvent(),
  ...customEvent(),
}

export interface StorageDto extends MsgDto{
  msg: string
  data: {
    key: string
    value?: any
    defaultValue?: any
  }
}

export {
  event as e,
}
