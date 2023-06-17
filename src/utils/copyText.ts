/**
 * @name: copyText.ts
 * @author: river
 * @date: 2023/3/19 2:01 PM
 * @contact: laolei@forkway.cn
 * @description：
 */

import * as clipboard from 'clipboard-polyfill';

export function copyText(text: string) {
       return clipboard.writeText(text).then(
            () => {
                console.log('success!');
            },
            () => {
                console.log('error!');
            },
        );

}
