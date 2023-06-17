// @flow
import * as React from 'react';
import {Header} from '@/components/Header';
import Generator from '@/components/Generator';
import QuickGo from '@/components/QuickGo';
import {Footer} from '@/components/Footer';
import {changeLicenceKey, licenceKeyRef, userUUID} from '@/ui.state';
import {useLocalStorage} from '@/hooks/useLocalStorage';
import {useQueryUserInfo} from '@/hooks/useQueryUserInfo';

export function ChatPage() {
    const { getItem, setItem } = useLocalStorage();
    const { refetch } = useQueryUserInfo();
    useEffect(() => {
        getItem('license').then((license) => {
            changeLicenceKey(license);
            refetch().then();
        }).catch(() => {
        });
    }, [licenceKeyRef.value]);


    useEffect(() => {
        if (userUUID.value === '') return;
        refetch().then();
    }, [userUUID.value]);

    return (
        <div>
            <Header/>
            <Generator/>
            <Footer/>
            <QuickGo/>
        </div>
    );
}
