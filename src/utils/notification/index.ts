import { io_hook as io } from 'kiss-msg'
import { client, env } from 'kiss-core'
import { e } from '@/event'

function dataToString(data: any) {
  if (typeof data !== 'string')
    data = JSON.stringify(data)

  return data
}

io?.on(e.NOTIFY, (data) => {
  data = dataToString(data)
  if (env.inMg) {
    client.mg.notify(data, {
      position: 'bottom',
      type: 'normal',
    })
  }
  else {
    client.figma.notify(data, {
      timeout: 3000,
      error: false,
    })
  }
})

io?.on(e.WARN, (data) => {
  data = dataToString(data)
  if (env.inMg) {
    client.mg.notify(data, {
      position: 'bottom',
      type: 'warning',
    })
  }
  else {
    client.figma.notify(data, {
      timeout: 2000,
      error: false,
    })
  }
})

