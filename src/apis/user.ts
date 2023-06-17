import {fetchGet, fetchPost} from '@/utils/fetchEnhance';
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
}
