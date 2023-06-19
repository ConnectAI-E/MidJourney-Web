import {afterTrimStartWithMulti} from '@/utils/string';
import {ActionType} from '../../../types';



export function judgeUserActionType(msg: string): ActionType {
    if (afterTrimStartWithMulti(msg, ['/imagine', '/image'])) {
        return 'IMAGINE';
    }
    return 'IMAGINE';
}
