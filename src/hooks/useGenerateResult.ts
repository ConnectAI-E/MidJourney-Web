import {ChatMessage, ErrorMessage} from '../../types';
import {useState} from 'react';
import {useAtom} from 'jotai';
import {ChatMessageProcessor} from '@/utils/Chat/ChatMessageProcessor';
import {ShowLicenseFromAtom} from '@/hooks/useLayout';
import {mjImageByPrompt} from '@/apis/image';
import {ifTaskOnWorkingAtom, setTaskIdAtom} from '@/hooks/useTaskInfo';


function formatMsgBody(body: ChatMessage[], isFree = true): ChatMessage[] {
    const instance = new ChatMessageProcessor(body, isFree ? 'free' : 'paid', 2000, 200);
    return instance.senderMessages;
}

export const useGenerateResult = () => {
    const [currentError, setCurrentError] = useState<ErrorMessage>();
    const [, showLicenseEdit] = useAtom(ShowLicenseFromAtom);
    const [generatedResults, setGeneratedResults] = useState<ChatMessage>({
        role: 'assistant',
        content: '',
    });
    const [, setTaskId] = useAtom(setTaskIdAtom);
    const [,setWorking] = useAtom(ifTaskOnWorkingAtom)
    const isStreamingRef = useRef<boolean>(true);

    async function generate(body: ChatMessage): Promise<any> {
        setCurrentError(undefined);
        let response:any;
        try {
            const action = body.action;
            if (action === 'IMAGINE') {
                response = await mjImageByPrompt(
                    body.content,
                );
                // response= {
                //     result:"8306746338615707",
                //     code:1
                // }
                console.log(response)
                setTaskId(response?.result);
                setWorking(true)

                // setTimeout(() => {
                //     setWorking(false)
                // },10000)

            }
            // if (!response.code) {
            //     if (response.status === 403) {
            //         setTimeout(() => {
            //             showLicenseEdit()
            //         },800)
            //         throw new Error('No available tokens left');
            //     }
            //     if (response.status === 400) {
            //         throw new Error('Not a valid message');
            //     }
            //
            //     throw new Error('Request OpenAI Failed With Bad Network ');
            // }

            const code = response?.code;
            const result = response?.result;
            if (code === 1) {
                console.log('提交成功');
                return result;
            }
            if (code === 0) {
                throw new Error('task is already exist')
            }
            if (code === 1) {
                throw new Error('wait in list')
            }

            return {};

        } catch (error) {
            const errorResponse = error as ErrorMessage;
            // if (errorResponse?.code == 20) {
            //     setCurrentError(undefined);
            //     return;
            // }
            setCurrentError(error as any);
            return {};
        }


    }

    function stopStream() {
        isStreamingRef.current = false;
    }


    return { generatedResults, generate, stopStream, currentError };
};
