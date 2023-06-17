import { isDev } from './isDev'

export const HOST_URL = isDev
  ? 'http://localhost:8000'
  : `${import.meta.env.VITE_HOST_URL}` // can only be used on the server

