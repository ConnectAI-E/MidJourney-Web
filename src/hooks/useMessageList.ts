/**
 * @name: useMessageList.ts
 * @author: river
 * @date: 2023/3/26 11:49 AM
 * @contact: laolei@forkway.cn
 * @description：jotai management
 */

import {atom} from 'jotai';
import {ChatMessage} from '../../types';

const msgListAtom = atom<ChatMessage[]>([]);

const msgSystemContentAtom = atom<string>((get) => {
    const msgList = get(msgListAtom);
    const msgSystem = msgList.filter((msg) => msg.role === 'system');
    return msgSystem.length > 0 ? msgSystem[0].content : '';
})

const msgWithOutLastAssistantAtom = atom((get) => {
    let result ;
    const msgList = get(msgListAtom);
    const lastOne = msgList.slice(-1)[0];
    if (lastOne && lastOne.role === 'assistant') {
        result = msgList.slice(0, -1);
    }else {
        result = msgList;
    }
    return result

})

const msgLatestAtom = atom((get) => {
    return get(msgListAtom).slice(-1)[0];
})

const ifMsgEmptyAtom = atom((get) => {
    return get(msgListAtom).length === 0;
});

const addUserMsgAtom = atom(null,  (get, set, msg:string) => {
    const newMsgList = get(msgListAtom)
    set(msgListAtom, [...newMsgList, {
        role: 'user',
        content: msg,
        time: new Date().getTime(),
    }]);
});

const emptyMsgListAtom = atom(null, (get, set) => {
    set(msgListAtom, []);
})

const AddSystemMsgAtom = atom(null, (get, set, sysMsg:string) => {
    const newMsgList = get(msgListAtom).filter((msg) => msg.role !== 'system') as any;
    if (!sysMsg.trim()){
        set(msgListAtom, newMsgList);
        return;
    }
    set(msgListAtom, [...newMsgList, {
        role: 'system',
        content: sysMsg,
        time: new Date().getTime(),
    }]);
})

const AddAssistantMsgAtom  = atom(null, (get, set, assistantMsg:string) => {
    const newMsgList = get(msgListAtom);
    set(msgListAtom, [...newMsgList, {
        role: 'assistant',
        content: assistantMsg,
        time: new Date().getTime(),
    }]);
})


const ifAllowEditSystemMsgAtom = atom((get) => {
    return get(msgListAtom).filter((msg) => msg.role === 'system').length === 0;
})

const delLastAssistantMsgAtom = atom(null, (get, set) => {
    // 找到最后一条消息，如果是助手的话，就删除
    const newMsgList = get(msgListAtom);
    const lastMsg = newMsgList.slice(-1)[0];
    if (lastMsg.role === 'assistant') {
        newMsgList.pop();
        set(msgListAtom, newMsgList);
    }
})


export const msgAtom = {
    msgListAtom,
    msgWithOutLastAssistantAtom,
    emptyMsgListAtom,
    msgSystemContentAtom,
    msgLatestAtom,
    ifMsgEmptyAtom,
    addUserMsgAtom,
    AddSystemMsgAtom,
    AddAssistantMsgAtom,
    ifAllowEditSystemMsgAtom,
    delLastAssistantMsgAtom
}
