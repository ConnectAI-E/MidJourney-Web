import {afterTrimStartWithMulti} from '@/utils/string';
import {ActionType} from '../../../types';



export function judgeUserActionByInput(msg: string): ActionType {
    if (afterTrimStartWithMulti(msg, ['/imagine', '/image'])) {
        return 'IMAGINE';
    }
    if (afterTrimStartWithMulti(msg, ['⛳️ U1','⛳️ U2','⛳️ U3','⛳️ U4'])) {
        return 'UPSCALE';
    }
    if (afterTrimStartWithMulti(msg, ['🎲 V1','🎲 V2','🎲 V3','🎲 V4'])) {
        return 'VARIATION';
    }
    return 'IMAGINE';
}

export function judgeUserActionByType(type: string): ActionType {
    if(type==='imagine'){
        return 'IMAGINE';
    }
    if(type==='variate'){
        return 'VARIATION';
    }
    if(type==='upscale'){
        return 'UPSCALE';
    }
    if(type==='reroll'){
        return 'REROLL';
    }
    return 'UNKNOWN';

}
