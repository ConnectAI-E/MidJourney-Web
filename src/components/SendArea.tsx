import {FunctionComponent} from 'react';
import ClearIcon from './icons/Clear';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import BtnDelete from './icons/BtnDelete';

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
      <div className="fixed left-1/2 transform -translate-x-1/2 bottom-40px md:max-w-[90%] md:w-[560px] sm:sm:w-[90%] backdrop-blur-md pt-1 px-4 pb-4 z-100 text-[16px] rounded-md">
        {ifLoading ? (
          <div className="gen-cb-wrapper">
            <span>Thinking...</span>
            <div className="gen-cb-stop" onClick={handleStopClick}>
              Stop
            </div>
          </div>
        ) : (
          <div>
            <div className="pt-2">
              <div className="flex justify-start flex-row gap-3">
                <PhotoProvider>
                  <PhotoView
                    key={2}
                    src={
                      "https://cdn.discordapp.com/attachments/1119994309563908108/1120402510419595364/princemarcus_0539869785357807__eb9c2d26-74a1-471a-8bc1-52ba7ac17f17.png"
                    }
                  >
                    <div className="relative flex">
                      <div className="text-white  absolute right-1 top-1 text-[24px] rounded  p-1 bg-slate/30  hover:bg-slate/60 cursor-pointer">
                        <BtnDelete />
                      </div>
                      <img
                        src={
                          "https://cdn.discordapp.com/attachments/1119994309563908108/1120402510419595364/princemarcus_0539869785357807__eb9c2d26-74a1-471a-8bc1-52ba7ac17f17.png"
                        }
                        alt=""
                        width={"120px"}
                        className={`rounded-md`}
                      />
                    </div>
                  </PhotoView>
                  <PhotoView
                    key={3}
                    src={
                      "https://cdn.discordapp.com/attachments/1119994309563908108/1120401991902965800/princemarcus_0539869785357807__5c462b56-b585-4bfd-880e-b4236a335a90.png"
                    }
                  >
                    <div className="relative flex">
                      <div className="text-white  absolute right-1 top-1 text-[24px] rounded  p-1 bg-slate/10  hover:bg-dark-4/10 cursor-pointer">
                        <BtnDelete />
                      </div>
                      <img
                        src={
                          "https://cdn.discordapp.com/attachments/1119994309563908108/1120401991902965800/princemarcus_0539869785357807__5c462b56-b585-4bfd-880e-b4236a335a90.png"
                        }
                        alt=""
                        width={"120px"}
                        className={`rounded-md`}
                      />
                    </div>
                  </PhotoView>
                </PhotoProvider>
              </div>
            </div>
            <div
              className={
                ifDisabled ? "op-50 gen-text-wrapper" : "gen-text-wrapper"
              }
            >
              <textarea
                onPaste={handlePaste}
                ref={inputRefItem}
                placeholder="Enter your description here..."
                autoComplete="off"
                // @ts-ignore
                onKeyDown={handleKeydown}
                autoFocus
                onInput={() => {
                  inputRefItem.current.style.height = "auto";
                  inputRefItem.current.style.height = `${inputRefItem.current.scrollHeight}px`;
                }}
                className="gen-textarea"
                rows={1}
              />
              <button
                onClick={handleButtonClick}
                disabled={ifDisabled}
                className="gen-slate-btn"
              >
                Send
              </button>
              <button
                title="Clear"
                onClick={clear}
                disabled={ifDisabled}
                className="gen-slate-btn"
              >
                <ClearIcon />
              </button>
            </div>
          </div>
        )}
      </div>
    );
};

export default SendArea;
