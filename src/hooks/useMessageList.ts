/**
 * @name: useMessageList.ts
 * @author: river
 * @date: 2023/3/26 11:49 AM
 * @contact: laolei@forkway.cn
 * @description：jotai management
 */

import {atom} from 'jotai';
import {ChatMessage} from '../../types';
import {judgeUserActionByInput} from '@/utils/Chat/MsgProcess';

const msgListAtom = atom<ChatMessage[]>([
    // {
    //     role: 'user',
    //     content: 'a clever running bot',
    //     action: 'IMAGINE',
    // },
    // {
    //     role: 'assistant',
    //     content: `a clear running bot`,
    //     result: {
    //         action: 'IMAGINE',
    //         taskId: '6238457747811804',
    //         status: 'SUCCESS',
    //         imgUrl:
    //             'https://cdn.discordapp.com/attachments/1109486781751107616/1119660299058946098/lisarobinson_3808808359954139_a_bot_b3d60e48-7562-4138-8d21-b8b11bfe27e1.png?Authorization=123',
    //         finished: true,
    //     },
    // },
]);

const msgSystemContentAtom = atom<string>((get) => {
    const msgList = get(msgListAtom);
    const msgSystem = msgList.filter((msg) => msg.role === 'system');
    return msgSystem.length > 0 ? msgSystem[0].content : '';
});

const msgWithOutLastAssistantAtom = atom((get) => {
    let result;
    const msgList = get(msgListAtom);
    const lastOne = msgList.slice(-1)[0];
    if (lastOne && lastOne.role === 'assistant') {
        result = msgList.slice(0, -1);
    } else {
        result = msgList;
    }
    return result;

});

const msgLatestAtom = atom((get) => {
    return get(msgListAtom).slice(-1)[0];
});

const msgLastUserAtom = atom((get) => {
    // get user msg list
    const msgList = get(msgListAtom);
    const userMsgList = msgList.filter((msg) => msg.role === 'user');
    return userMsgList.length > 0 ? userMsgList.slice(-1)[0] : null;
})

const ifMsgEmptyAtom = atom((get) => {
    return get(msgListAtom).length === 0;
});

const addUserMsgAtom = atom(null, (get, set, msg: string) => {
    const newMsgList = get(msgListAtom);
    set(msgListAtom, [...newMsgList, {
        role: 'user',
        content: msg,
        time: new Date().getTime(),
        action: judgeUserActionByInput(msg),
    }]);
});

const addUserAtom = atom(null, (get, set, userMsg:ChatMessage) => {
    const newMsgList = get(msgListAtom);
    set(msgListAtom, [...newMsgList,userMsg]);
})


const emptyMsgListAtom = atom(null, (get, set) => {
    set(msgListAtom, []);
});

const AddSystemMsgAtom = atom(null, (get, set, sysMsg: string) => {
    const newMsgList = get(msgListAtom).filter((msg) => msg.role !== 'system') as any;
    if (!sysMsg.trim()) {
        set(msgListAtom, newMsgList);
        return;
    }
    set(msgListAtom, [...newMsgList, {
        role: 'system',
        content: sysMsg,
        time: new Date().getTime(),
    }]);
});

const AddAssistantMsgAtom = atom(null, (get, set, assistantMsg: ChatMessage['result']) => {
    const newMsgList = get(msgListAtom);
    // if in the same taskId in msgList, then not add
    if (newMsgList.filter((msg) => msg.result?.taskId === assistantMsg?.taskId).length > 0) {
        return;
    }

    set(msgListAtom, [...newMsgList, {
        role: 'assistant',
        content: assistantMsg?.prompt??"",
        result:assistantMsg,
        time: new Date().getTime(),
    }]);
});


const ifAllowEditSystemMsgAtom = atom((get) => {
    return get(msgListAtom).filter((msg) => msg.role === 'system').length === 0;
});

const delLastAssistantMsgAtom = atom(null, (get, set) => {
    // 找到最后一条消息，如果是助手的话，就删除
    const newMsgList = get(msgListAtom);
    const lastMsg = newMsgList.slice(-1)[0];
    if (lastMsg.role === 'assistant') {
        newMsgList.pop();
        set(msgListAtom, newMsgList);
    }
});


export const msgAtom = {
    msgListAtom,
    msgWithOutLastAssistantAtom,
    emptyMsgListAtom,
    msgSystemContentAtom,
    msgLatestAtom,
    msgLastUserAtom,
    ifMsgEmptyAtom,
    addUserMsgAtom,
    addUserAtom,
    AddSystemMsgAtom,
    AddAssistantMsgAtom,
    ifAllowEditSystemMsgAtom,
    delLastAssistantMsgAtom,
};
