import {useAtom} from 'jotai';
import {atom} from 'jotai/index';
import {ChatMessage} from '../../types';
import {atomWithStorage} from 'jotai/utils';



export const taskInfoAtom = atomWithStorage<ChatMessage["result"]>('taskNow',{
    taskId: '',
})

export const ifTaskOnWorkingAtom = atomWithStorage('ifTaskOnWorking', false);

export const setTaskIdAtom = atom(null, (get, set, taskId: string) => {
    set(taskInfoAtom, {
        ...get(taskInfoAtom),
        taskId: taskId,
    });
})

export const getTaskIdAtom = atom((get) => {
    return get(taskInfoAtom)?.taskId;
})


