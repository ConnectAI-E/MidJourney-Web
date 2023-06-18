import { ref} from '@vue/reactivity';
import {useLocalStorage} from '@/hooks/useLocalStorage';
import {checkKeyFormat} from '@/utils/string';


export const licenceKeyRef = ref('');


export const changeLicenceKey = (key: string) => {
    if (!checkKeyFormat(key)) return;
    licenceKeyRef.value = key;
};

export const changeLicenceKeyAndCache = (key: string) => {
    if (!checkKeyFormat(key)) return;
        licenceKeyRef.value = key;
        useLocalStorage().setItem('license', key);
};

export const loadLicenseKey = () => {
    return licenceKeyRef.value;
};

export const userUUID = ref('');
