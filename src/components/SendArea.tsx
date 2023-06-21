import {FunctionComponent} from 'react';
import ClearIcon from './icons/Clear';

interface SendAreaProps {
    handleKeydown: (e: KeyboardEvent) => void;
    handleButtonClick: () => void;
    handleStopClick: () => void;
    clear: () => void;
    inputRefItem: any;
    ifLoading: boolean;
    ifDisabled: boolean;
}

const SendArea: FunctionComponent<SendAreaProps> = ({
                                                        ifDisabled,
                                                        handleKeydown,
                                                        handleButtonClick,
                                                        handleStopClick,
                                                        clear,
                                                        inputRefItem,
                                                        ifLoading,
                                                    }) => {

    const handlePaste = (event:any) => {
        const items = (event.clipboardData || event.originalEvent.clipboardData).items;
        for (const item of items) {
            if (item.type.indexOf('image') !== -1) {
                const file = item.getAsFile();
                // 在这里处理图片文件，比如上传到服务器或进行其他操作
                console.log(file);
            }
        }
    };

    return (
        <div
            className="fixed left-1/2 transform -translate-x-1/2 bottom-40px md:max-w-[90%] md:w-[560px] sm:sm:w-[90%] backdrop-blur-md pt-1 px-4 pb-4 z-100 text-[16px] rounded-md">
            { ifLoading ? (
                <div className="gen-cb-wrapper">
                    <span>Thinking...</span>
                    <div className="gen-cb-stop" onClick={handleStopClick}>Stop</div>
                </div>
            ) : (
                <div
                    className={
                        ifDisabled ? 'op-50 gen-text-wrapper' : 'gen-text-wrapper'
                    }
                >
          <textarea
              onPaste={handlePaste}
              ref={ inputRefItem }
              placeholder="Enter your description here..."
              autoComplete="off"
              // @ts-ignore
              onKeyDown={ handleKeydown }
              autoFocus
              onInput={ () => {
                  inputRefItem.current.style.height = 'auto';
                  inputRefItem.current.style.height = `${ inputRefItem.current.scrollHeight }px`;
              } }
              className="gen-textarea"
              rows={ 1 }
          />
                    <button
                        onClick={ handleButtonClick }
                        disabled={ ifDisabled }
                        className="gen-slate-btn"
                    >
                        Send
                    </button>
                    <button
                        title="Clear"
                        onClick={ clear }
                        disabled={ ifDisabled }
                        className="gen-slate-btn"
                    >
                        <ClearIcon/>
                    </button>
                </div>
            ) }
        </div>
    );
};

export default SendArea;
