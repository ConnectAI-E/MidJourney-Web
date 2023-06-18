import {afterTrimStartWithMulti} from '@/utils/string';
import {describe,test,expect} from 'vitest';
import {judgeUserActionType} from '@/utils/Chat/MsgProcess';


describe('to imagine', () => {
    test('/imagine', () => {
        const s = judgeUserActionType('/imagine a boy');
        expect(s).toEqual('IMAGINE');
    });

    test('/Imagine', () => {
        const s = judgeUserActionType('/Imagine a boy');
        expect(s).toEqual('IMAGINE');
    });


    test('defult', () => {
        const s = judgeUserActionType('/ a boy');
        expect(s).toEqual('IMAGINE');
    });


})
