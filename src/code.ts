import {client, env} from 'kiss-core';
import {cache, io_hook as io, tool} from 'kiss-msg';
import './utils/notification';
import {event, StorageDto} from './event';
import {firstParserConfig, updateNewConfig} from '@/code.state';

if (env.inMg) {
    client.mg.showUI(__html__, {
        width: 460,
        height: 820,
        visible: true,
    });
} else {
    client.figma.showUI(__html__, {
        width: 460,
        height: 800,
    });
}

if(!env.inMg){
    // console.log("client.figma.currentUse",client.figma.currentUser);
    io?.send(event.CODE_UPDATE_USER_UUID, client.figma.currentUser?.id)
}

io?.on(event.UI_INIT, () => {
    firstParserConfig().then((config) => {
        // console.log('config', config)
        io?.send(event.CODE_INIT_CONFIG, config)
    })
})
io?.on(event.UI_UPDATE_LICENCE, (data) => {
    console.log('license', data)
    updateNewConfig(data)
})

io?.on(event.UI_QUERY_LICENCE, () => {
    firstParserConfig().then((config) => {
        const licence = config?.licence
        io?.send(event.UI_QUERY_LICENCE_BACK, licence)
    })
})

io?.on(event.UI_CLOSE, () => {
    client.mg.closePlugin();
});

// io?.on(event.UI_INIT, () => {
//   firstParserConfig().then((config) => {
//     console.log('config', config)
//     io?.send(event.CODE_INIT_CONFIG, config)
//   })
// })

// io?.answer<Dto_Resize>('UI_CHANGE_SIZE', (data) => {
//   const sel = new SelParser().sel
//   const resizer = new IconResizer(sel, data)
//   resizer.run()
// })

// io?.on(event.UI_CHANGE_SIZE, (data) => {
//   const sel = new SelParser().sel
//   console.log(sel)
//   const resizer = new IconResizer(sel, data)
//   resizer.run()
// })


// localStorage
io?.answerBack<StorageDto>(event.STORAGE_SET,  (data) => {
    const cacheName = data.key;
    const cacheData = data.value;
    return cache.updateConfig(cacheName, cacheData)
});

io?.answerBack<StorageDto>(event.STORAGE_GET,  (data) => {
    const cacheName = data.key
    const defaultValue = data.defaultValue??null
    return  cache.getConfig(cacheName, defaultValue).then((cacheData) => {
        // console.log("cacheName", cacheName)
        // console.log("cacheData", cacheData)
        return cacheData
    }).catch(
        (err) => {
            return err
        }
    )
})







