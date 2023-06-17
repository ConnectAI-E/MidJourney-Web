import React from 'react';

export enum ToastType {
    Success = 'success',
    Error = 'error',
    Warn = 'warn'
}

export const Toast = ({
                          type,
                          tip,
                          time = 3000,
                          closable = true,
                          onFinish = () => void 0
                      }: { type: ToastType, tip: string, time?: number, closable?: boolean, onFinish?: () => void; }) => {
    const [show, setShow] = React.useState(true);

    React.useEffect(() => {
        const timeout = setTimeout(() => {
          handleClose()
        }, time);

        return () => clearTimeout(timeout);
    }, [time,onFinish]);

    const getIconClass = () => {
        switch (type) {
            case ToastType.Success:
                return 'i-carbon-checkmark';
            case ToastType.Error:
                return 'i-carbon-error';
            case ToastType.Warn:
                return 'i-carbon-warning-alt';
            default:
                return '';
        }
    };

    const getColorClass = () => {
        switch (type) {
            case ToastType.Success:
                return 'text-green bg-green/10 border-green/50';
            case ToastType.Error:
                return 'text-red bg-red/10 border-red/50';
            case ToastType.Warn:
                return 'text-yellow bg-yellow/10 border-yellow/50';
            default:
                return '';
        }
    };
    const handleClose = () => {
        setShow(false);
        if (onFinish) {
            onFinish();
        }
    };


    return show ? (
        <div className={ `my-3 px-4 py-3 border ${ getColorClass() } w-[388px]` }>
            <div className={ `text-sm fib ${ type }` }>
                <div className="fis">
                    <div className={ `${ getIconClass() } h-[20px] mr-2` }/>
                    <span>{ tip }</span>
                </div>
                { closable && (
                    <button onClick={ handleClose }
                            className="flex-shrink-0 h-5 rounded-full bg-transparent hover:bg-grey-hover focus:outline-none">
                        <span className="sr-only">Close</span>
                        <svg className="h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M18.3 5.7a1 1 0 00-1.4 0L12 10.6l-4.9-4.9a1 1 0 00-1.4 1.4l4.9 4.9-4.9 4.9a1 1 0 001.4 1.4l4.9-4.9 4.9 4.9a1 1 0 001.4-1.4L13.4 12l4.9-4.9a1 1 0 000-1.4z"/>
                        </svg>
                    </button>
                ) }
            </div>

        </div>
    ) : null;
};
