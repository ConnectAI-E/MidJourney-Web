import {useQuery} from 'react-query';
import {getUserInfo, mjGetTaskInfo} from '@/apis/image';
import {atom, useAtom} from 'jotai';

import debounce from 'lodash/debounce'
import {
    getTaskIdAtom,
    ifTaskOnWorkingAtom,
    setTaskIdAtom,
    taskInfoAtom,
} from '@/hooks/useTaskInfo';
import {msgAtom} from '@/hooks/useMessageList';

// const getUserInfoWithDebounce = debounce(getUserInfo, 3000)

export function useQueryTaskInfo() {
    const [ifOnTask,setEndTask] = useAtom(ifTaskOnWorkingAtom)
    const[taskNow,setTaskNow] = useAtom(taskInfoAtom)
    const[,addAssistantMsg] = useAtom(msgAtom.AddAssistantMsgAtom)
    const [ifLoading, setLoading] = useState(false)
    const [taskId] = useAtom(getTaskIdAtom);

    const { data, isLoading, refetch, isError,isSuccess } = useQuery(['taskInfo',taskId], ()=>mjGetTaskInfo(taskId??""),{
        refetchInterval: 1000*3, // 设置查询每隔 120 秒自动刷新一次
        staleTime: 1000*120, // 设置数据在 30 秒后过期
        refetchIntervalInBackground: false, // 设置在页面不可见时查询每隔 60 秒自动刷新一次
        keepPreviousData: false, // 设置在新的查询开始之前保持之前的数据
        retry: 1, // 设置查询失败时重试的次数
        refetchOnWindowFocus: false, // 设置在页面重新获得焦点时自动刷新
        enabled: ifLoading
    });
    // useEffect(() => {
    //     console.log(data,"data");
    //     data&&setTaskNow({
    //         taskId: data?.id,
    //         prompt: data?.prompt,
    //         promptEn: data?.promptEn,
    //         progress: data?.progress,
    //         action: data?.action,
    //         imgUrl: data?.imageUrl,
    //         status: data?.status,
    //         finished: data?.progress === "100%",
    //     })
    //     if(data?.progress === "100%"){
    //         taskNow&&addAssistantMsg(taskNow)
    //         setEndTask(false)
    //     }
    // },[data])

    useEffect(() => {
        setLoading(ifOnTask)
    }, [ifOnTask]);

    return {
        data,
        refetch,
        isSuccess
    }

}


export const userPlanAtom = atom<'free' | 'paid'>('free');

