import {computed, ref} from '@vue/reactivity';
import {io_ui as io} from 'kiss-msg';
import {event as e} from '@/event';
import {useLocalStorage} from '@/hooks/useLocalStorage';
import {checkKeyFormat} from '@/utils/string';


export const licenceKeyRef = ref('');

export const ifShowLicenseKey = computed(() => {
    return licenceKeyRef.value === '';
});

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
io?.on(e.CODE_UPDATE_USER_UUID, (data) => {
    console.log("CODE_UPDATE_USER_UUID",data);
    userUUID.value = data || '';
});
