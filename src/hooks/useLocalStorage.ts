import {io_ui as io} from 'kiss-msg';
import {event as e, StorageDto} from '@/event';

export function useLocalStorage() {
    const setItem = (key: string, value: string) => {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
           console.log('error', error);
        }
    };

    const getItem = (key: any): Promise<string> => {
        return new Promise((resolve, reject) => {
                try {
                    const value = localStorage.getItem(key);
                    if (value) {
                        resolve(value);
                    }
                    reject('no value');
                } catch (error) {
                    console.log('error', error);
                }
            },
        );

    };

    return {
        setItem,
        getItem,
    };
}

