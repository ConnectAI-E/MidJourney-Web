import {useQuery} from 'react-query';
import {getUserInfo} from '@/apis/user';
import {atom} from 'jotai';

import debounce from 'lodash/debounce'

// const getUserInfoWithDebounce = debounce(getUserInfo, 3000)

export function useQueryUserInfo() {
    const { data, isLoading, refetch, isError,isSuccess } = useQuery(['userInfo'], getUserInfo,{
        refetchInterval: 1000*120, // 设置查询每隔 120 秒自动刷新一次
        staleTime: 1000*120, // 设置数据在 30 秒后过期
        refetchIntervalInBackground: false, // 设置在页面不可见时查询每隔 60 秒自动刷新一次
        keepPreviousData: true, // 设置在新的查询开始之前保持之前的数据
        retry: 1, // 设置查询失败时重试的次数
        refetchOnWindowFocus: false, // 设置在页面重新获得焦点时自动刷新
    });
    const [ifFree, setIfFree] = useState(false)
    useEffect(() => {
        if (data) {
            setIfFree(data.plan === 'free')
        }
    },[data])
    return {
        data,
        refetch,
        ifFree,
        isSuccess
    }

}


export const userPlanAtom = atom<'free' | 'paid'>('free');

