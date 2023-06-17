import {io_ui as io} from 'kiss-msg';
import {event as e, StorageDto} from '@/event';

export function useLocalStorage() {
    const setItem = (key: string, value: string) => {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            io?.queryBack<StorageDto>(e.STORAGE_SET, {
                key,
                value,
            }).then((data) => console.log(data));
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
                    io?.queryBack<StorageDto>(e.STORAGE_GET, { key }).then((data: any) => {
                        resolve(data);
                    }).catch((err) => {
                        reject(err);
                    });
                }
            },
        );

    };

    return {
        setItem,
        getItem,
    };
}

