import * as React from 'react';
import {Header} from '@/components/Header';
import Generator from '@/components/Generator';
import QuickGo from '@/components/QuickGo';
import {Footer} from '@/components/Footer';

export function ChatPage() {

    return (
        <div>
            <Header/>
            <Generator/>
            <Footer/>
            <QuickGo/>
        </div>
    );
}
