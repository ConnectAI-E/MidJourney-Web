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
    return (
        <div
            className="fixed left-1/2 transform -translate-x-1/2 bottom-0px w-[420px] backdrop-blur-md pt-1 px-4 pb-4 z-100 text-[16px] rounded-md">
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
              ref={ inputRefItem }
              placeholder="Enter your question here..."
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
