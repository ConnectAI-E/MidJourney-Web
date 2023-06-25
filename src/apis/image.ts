import {fetchGet, fetchMJGet, fetchMJPost, fetchPost} from '@/utils/fetchEnhance';
import {HOST_URL} from '@/utils/hostUrl';

export const getUserInfo = async () => {
    const response = await fetchGet(HOST_URL + '/api/user/plan');
    // console.log(response);
    if (response.code != 0) {
        throw new Error('Failed to fetch user info');
    }
    return response.data;
};

export const validateLicenseKey = async (key: string) => {
    const response = await fetchPost(HOST_URL + '/api/validate-license/' + key);
    if (response.code != 0) {
        throw new Error('license key is invalid');
    }
    // console.log(response);
    return response.data;
};


export const mjImageByPrompt = async (prompt: string) => {
    const response = await fetchMJPost('/mj/submit/imagine', { prompt: prompt });
    return response;
};


export const mjGetTaskInfo = async (taskId: string) => {
    const response = await fetchMJGet('/mj/task/' + taskId + '/fetch');
    return response;
};

export const mjImageUpScale = async (taskId: string, index: number) => {
    const response = await fetchMJPost('/mj/submit/change', {
        action: 'UPSCALE',
        taskId: taskId,
        index: index,
    });
    return response;
};

export const mjImageUpVariate = async (taskId: string, index: number) => {
    const response = await fetchMJPost('/mj/submit/change', {
        action: 'VARIATION',
        taskId: taskId,
        index: index,
    });
    return response;
};

export const mjImageUpReroll = async (taskId: string) => {
    const response = await fetchMJPost('/mj/submit/change', {
        action: 'REROLL',
        taskId: taskId,
    });
    return response;
};

export const mjImageDescribe = async (imageBase64: string) => {
    const response = await fetchMJPost('/mj/submit/describe', {
        base64: imageBase64,
    });
    return response;
};


export const mjImageBlend = async (ImageBase64s: string[]) => {
    const response = await fetchMJPost("/mj/submit/blend", {
      base64Array: ImageBase64s,
    });
    return response;
 }


export const mjGetQueue = async () => {
    const response = await fetchMJGet('/mj/queue');
    return response;
};


