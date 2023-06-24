import {FunctionComponent} from 'react';
import ClearIcon from './icons/Clear';
import UploadImage from '@/components/UploadImage';
import {useAtom} from 'jotai';
import {uploadImagesUrlAtom} from '@/hooks/useUplodImage';

interface SendAreaProps {
    handleKeydown: (e: KeyboardEvent) => void;
    handleButtonClick: () => void;
    handleStopClick: () => void;
    clear: () => void;
    inputRefItem: any;
    ifLoading: boolean;
    ifDisabled: boolean;
}

const SendArea = forwardRef(({
                                                        ifDisabled,
                                                        handleKeydown,
                                                        handleButtonClick,
                                                        handleStopClick,
                                                        clear,
                                                        inputRefItem,
                                                        ifLoading,
                                                    }:SendAreaProps,ref) => {

    const textareaRef = useRef(null);
    const [imageSrcs, setImageSrcs] = useState<string[]>([]);
    const [imageUploadSrc,setImageUpload] = useAtom(uploadImagesUrlAtom)
    useEffect(() => {
        setImageUpload(imageSrcs)
        // if(imageSrcs.length===0) return
        console.log(imageSrcs);
    },[imageSrcs])

    const handlePaste = (event: any) => {
        const items = (event.clipboardData || event.originalEvent.clipboardData).items;
        const imageFiles = [] as any;

        for (const item of items) {
            if (item.type.indexOf('image') !== -1) {
                const file = item.getAsFile();
                const imageUrl = URL.createObjectURL(file);
                imageFiles.push(imageUrl);
            }
        }
        setImageSrcs([...imageSrcs, ...imageFiles]);
    };

    function emptyImagesSrc(){
        setImageSrcs([])
    }

    useImperativeHandle(ref, () => ({
        emptyImagesSrc
    }));

    const handleDeleteByIndex = (index: number) => {
        const newImageSrcs = [...imageSrcs];
        newImageSrcs.splice(index, 1);
        setImageSrcs(newImageSrcs);
    }
    const description = useMemo(() => {
        const imageLength = imageSrcs.length;
        return imageLength > 0 ? imageLength>1? `Blend ${imageLength} uploaded images`:
            `Describe 1 uploaded images` : "Enter your description here...";
    }, [imageSrcs])

    const inDescriptionOrBlend = useMemo(() => {
        const imageLength = imageSrcs.length;
        return imageLength > 0 
    }, [imageSrcs])
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
            {imageSrcs.length > 0 && (
              <div className="pt-2">
                <UploadImage
                  images={imageSrcs}
                  handleDelete={(index: any) => {
                    handleDeleteByIndex(index);
                  }}
                ></UploadImage>
              </div>
            )}
            <div
              className={
                ifDisabled ? "op-50 gen-text-wrapper" : "gen-text-wrapper"
              }
            >
              <textarea
                onPaste={handlePaste}
                ref={inputRefItem}
                placeholder={description}
                autoComplete="off"
                // @ts-ignore
                onKeyDown={handleKeydown}
                disabled={ifDisabled || inDescriptionOrBlend}
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
})

export default SendArea;
