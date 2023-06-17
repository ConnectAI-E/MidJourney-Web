import {ChatMessage} from '../../types';
import {useLocalStorage} from '@/hooks/useLocalStorage';
import SystemSetting from '@/components/SystemSetting';
import SingleMsg from '@/components/SingleMsg';
import React, {useEffect, useRef, useState} from 'react';
import ErrorMsg from '@/components/ErrorMsg';
import SendArea from '@/components/SendArea';
import {useAtom} from 'jotai';
import {msgAtom} from '@/hooks/useMessageList';
import {useGenerateResult} from '@/hooks/useGenerateResult';
import {useThrottleFn} from 'ahooks';
import {useQueryUserInfo, userPlanAtom} from '@/hooks/useQueryUserInfo';
import {ChatMessageProcessor} from '@/utils/Chat/ChatMessageProcessor';


export default function () {
    let inputRef = useRef<HTMLInputElement>(null);
    const [currentSystemRoleSettings, setCurrentSystemRoleSettings] = useState('');
    const [loading, setLoading] = useState(false);
    const { refetch: refetchUserInfo,ifFree } = useQueryUserInfo();
    const { getItem, setItem } = useLocalStorage();
    const [messageList, setMsgList] = useAtom(msgAtom.msgListAtom);
    const [, addUserMsg] = useAtom(msgAtom.addUserMsgAtom);
    const [, emptyAllList] = useAtom(msgAtom.emptyMsgListAtom);
    const [, delLastAssistantMsg] = useAtom(msgAtom.delLastAssistantMsgAtom);
    const [, addAssistantMsgAtom] = useAtom(msgAtom.AddAssistantMsgAtom);
    const [msgWithLastAssistantAtom] = useAtom(msgAtom.msgWithOutLastAssistantAtom);
    const [userPlan] = useAtom(userPlanAtom);
    const isAllowCache = useRef(false);
    const {
        currentError,
        generatedResults, generate, stopStream,
    } = useGenerateResult();
    //test
    useEffect(() => {
        if(isAllowCache.current){
            const  sortedMessages = new ChatMessageProcessor(messageList,userPlan).sortedMessages;
            setItem('messageList', JSON.stringify(sortedMessages));
        }
    }, [messageList]);


    const smoothToBottom = useThrottleFn(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, { wait: 400 });

    useEffect(() => {
        try {
            getItem('messageList').then((msgLists) => {
                // console.log('msgLists', msgLists);
                // exclude {}
                if (msgLists && msgLists !== '{}') {
                    setMsgList(JSON.parse(msgLists as any));
                }
            });
        } catch (err) {
            console.error(err);
        }

        setTimeout(() => {
            isAllowCache.current = true;
        },1000);


        // window.addEventListener('beforeunload', handleBeforeUnload);
        // return () => {
        //     window.removeEventListener('beforeunload', handleBeforeUnload);
        // };


    }, []);

    // const handleBeforeUnload = () => {
    //     // setItem('messageList', JSON.stringify(messageList));
    //     setItem('systemRoleSettings', currentSystemRoleSettings);
    // };
    const handleButtonClick = async () => {
        const inputValue = inputRef?.current;

        if (!inputValue)
            return;

        //if after trim still empty
        if (!inputValue.value.trim()) {
            return;
        }
        const newUserMsg = {
            role: 'user',
            content: inputValue.value,
            time: new Date().getTime(),
        } as any;
        const newMessageList = [...messageList, newUserMsg];

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        if (window?.umami) umami.trackEvent('chat_generate');
        addUserMsg(inputValue.value);

        if (inputRef.current) {
            inputRef.current.value = '';
        }

        await requestWithLatestMessage(newMessageList);

    };

    const archiveCurrentMessage = (result: string) => {
        if (result) {
            addAssistantMsgAtom(result);
            inputRef.current?.focus();
        }
    };
    const clear = () => {
        if (inputRef.current) {
            inputRef.current.value = '';
        }
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
        }
        emptyAllList();
    };
    const stopStreamFetch = () => {
        stopStream();
        archiveCurrentMessage(generatedResults);
    };

    const retryLastFetch = () => {
        delLastAssistantMsg();
        requestWithLatestMessage(msgWithLastAssistantAtom).then(
            () => {
            },
        );
    };
    useEffect(() => {
        smoothToBottom.run();
    }, [loading]);


    const requestWithLatestMessage = async (newMessageList: any) => {
        setLoading(true);
        // console.log(newMessageList);
        await generate(newMessageList).then(
            (result) => {
                archiveCurrentMessage(result);
            },
        );
        refetchUserInfo().then();
        setLoading(false);
    };

    const handleKeydown = (e: KeyboardEvent) => {
        if (e.isComposing || e.shiftKey)
            return;

        if (e.key === 'Enter')
            handleButtonClick().then(r => {
            });
    };


    return (
        <>
            <div className="mt-6 mb-2">
                <SystemSetting/>
                { messageList.map((message, index) => (
                    <SingleMsg
                        key={ index }
                        role={ message.role }
                        message={ message.content }
                        showRetry={ () => (message.role === 'assistant' && index === messageList.length - 1) }
                        onRetry={ retryLastFetch }
                    />
                )) }
                { loading && generatedResults && (
                    <SingleMsg
                        role="assistant"
                        message={ generatedResults }
                    />
                ) }

                { currentError &&
                    <ErrorMsg data={ currentError } onRetry={ retryLastFetch }/> }
                <SendArea ifDisabled={ false }
                          handleStopClick={ stopStreamFetch }
                          handleKeydown={ handleKeydown }
                          handleButtonClick={ handleButtonClick }
                          clear={ clear }
                          inputRefItem={ inputRef }
                          ifLoading={ loading }/>
            </div>

        </>

    );
}
