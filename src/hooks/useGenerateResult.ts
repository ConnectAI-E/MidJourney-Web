import {ChatMessage, ErrorMessage} from '../../types';
import {HOST_URL} from '@/utils/hostUrl';
import {useState} from 'react';
import {useAtom} from 'jotai';
import {licenceKeyRef, userUUID} from '@/ui.state';
import {ChatMessageProcessor} from '@/utils/Chat/ChatMessageProcessor';
import {useQueryUserInfo} from '@/hooks/useQueryUserInfo';
import {showEnterLicense, ShowLicenseFromAtom} from '@/hooks/useLayout';



function formatMsgBody(body: ChatMessage[],isFree=true):ChatMessage[]{
    const instance = new ChatMessageProcessor(body, isFree?'free':'paid',2000,200)
    return instance.senderMessages
}
export const useGenerateResult = () => {
    // const navigate = useNavigate();
    const controllerNewOne = new AbortController() as any;
    const controller= useRef(controllerNewOne);
    // const timestamp = Date.now();
    const [currentError, setCurrentError] = useState<ErrorMessage>();
    const [,showLicenseEdit] = useAtom(ShowLicenseFromAtom)
    const [generatedResults, setGeneratedResults] = useState<string>('');
    const isStreamingRef = useRef<boolean>(true)
    const{ifFree} = useQueryUserInfo()
    async function generate(body: ChatMessage[]):Promise<string> {
        // console.log(body);
        setGeneratedResults('');
        setCurrentError(undefined)
        readyStream()


        try {
            const response = await fetch(HOST_URL+'/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-License-Key':licenceKeyRef.value ,
                    'X-UUID': userUUID.value
                },
                body: JSON.stringify({
                    Messages:formatMsgBody(body,ifFree),
                }),
                signal: controller.current.signal,
            });

            if (!response.ok) {
                if (response.status === 403) {
                    setTimeout(() => {
                        showLicenseEdit()
                    },800)
                    throw new Error('No available tokens left');
                }
                if (response.status === 400) {
                    throw new Error('Not a valid message');
                }

                throw new Error('Request OpenAI Failed With Bad Network ');
            }

            // This data is a ReadableStream
            const data = response.body;
            if (!data) {
                return ''
            }

            const reader = data.getReader();
            const decoder = new TextDecoder();
            let done = false;
            let result = '';
            while (!done && isStreamingRef.current) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                const chunkValue = decoder.decode(value);
                if (chunkValue === '\n' && generatedResults.endsWith('\n'))
                    continue;
                setGeneratedResults((prev) => prev + chunkValue);
                result += chunkValue;
            }
            if(done){
                controller.current.abort();
            }
            reader.cancel().then(() => {
                readyStream()
            })
            return result;

        } catch (error) {
            console.error(error);
            const errorResponse = error as ErrorMessage;
            controller.current.abort();
            if (errorResponse?.code == 20) {
                // 用户主动取消付款w
                setCurrentError( undefined)
                return '';
            }
            setCurrentError(error as any)
            return '';
        }


    }
    function stopStream() {
        controller.current.abort();
        isStreamingRef.current = false;
    }

    function readyStream() {
        isStreamingRef.current = true;
        controller.current = new AbortController() as any;
    }

    return { generatedResults, generate,stopStream, currentError };
};
