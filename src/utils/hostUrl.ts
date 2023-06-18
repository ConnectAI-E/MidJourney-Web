import { isDev } from './isDev'

export const HOST_URL = isDev
  ? 'http://localhost:8080'
  : `${import.meta.env.VITE_MIDJOURNEY_PROXY_URL}` // can only be used on the server

