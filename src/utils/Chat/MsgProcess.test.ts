import {afterTrimStartWithMulti} from '@/utils/string';
import {describe,test,expect} from 'vitest';
import {judgeUserActionByInput} from '@/utils/Chat/MsgProcess';


describe('to imagine', () => {
    test('/imagine', () => {
        const s = judgeUserActionByInput('/imagine a boy');
        expect(s).toEqual('IMAGINE');
    });

    test('/Imagine', () => {
        const s = judgeUserActionByInput('/Imagine a boy');
        expect(s).toEqual('IMAGINE');
    });


    test('defult', () => {
        const s = judgeUserActionByInput('/ a boy');
        expect(s).toEqual('IMAGINE');
    });


})
