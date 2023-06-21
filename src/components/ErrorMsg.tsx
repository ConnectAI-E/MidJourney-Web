import IconRefresh from './icons/Refresh'
import React from 'react'
import {ErrorMessage} from '../../types';

interface Props {
    data: ErrorMessage
    onRetry?: (arg:any) => void
}

export default ({ data, onRetry }: Props) => {
    return (
        <div className="my-4 px-2 py-2 border border-red/50 bg-red/10">
            {data.code && <div className="text-red mb-1">{data.code}</div>}
            <div className="text-red op-70 text-sm mb-2">{data.message}</div>
            {onRetry && (
                <div className="fie">
                    <div onClick={onRetry} className="gpt-retry-btn border-red/50 text-red text-sm">
                        <IconRefresh />
                        <span>Regenerate</span>
                    </div>
                </div>
            )}
        </div>
    )
}
