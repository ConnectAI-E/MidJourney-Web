import { useState } from "react";
import MarkdownIt from "markdown-it";
// @ts-ignore
import mdKatex from "markdown-it-katex";
import mdHighlight from "markdown-it-highlightjs";
import { useCopyToClipboard } from "react-use";
import IconRefresh from "./icons/Refresh";
import type { ChatMessage } from "../../types";
import "@/styles/message.scss";
import { PhotoProvider, PhotoView } from "react-photo-view";
import ActionBtn from '@/components/ActionBtn';
import {computed} from '@vue/reactivity';

interface Props {
  role: ChatMessage["role"];
  //user 的操作
  action?: ChatMessage["action"];
  //user 上传的图片
  uploadImages?: ChatMessage["uploadImages"];
  message: string;
  result?: ChatMessage["result"];
  showRetry?: () => boolean;
  onRetry?: (arg:any) => void;
  clickAction?: (arg:any) => void;
}

// https://windicss.org/utilities/general/colors.html
export default ({ role, message, result, showRetry, onRetry ,clickAction,action,uploadImages}: Props) => {

  // console.log(uploadImages);
  const roleClass = {
    system: "bg-gradient-to-l from-gray-400 via-gray-300 to-gray-100",
    user: "bg-gradient-to-l from-amber-600  via-amber-400 to-orange-200",
    assistant: "bg-gradient-to-l from-green-600 via-green-400 to-cyan-200",
  };
  const [source, setSource] = useState("");
  const [state, copyToClipboard] = useCopyToClipboard();

  const ifDown = result?.finished

  const ifCanBeVariate = computed(() => {
    console.log("22",result?.action);
    return result?.finished && result.action != 'UPSCALE'
  })
  const htmlString = () => {
    const md = MarkdownIt({
      linkify: true,
      breaks: true,
    })
      .use(mdKatex)
      .use(mdHighlight);
    const fence = md.renderer.rules.fence!;
    md.renderer.rules.fence = (...args) => {
      const [tokens, idx] = args;
      const token = tokens[idx];
      const rawCode = fence(...args);

      return `<div relative>
      <div data-code="${encodeURIComponent(
        token.content
      )}" class="copy-btn gpt-copy-btn group">
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32"><path fill="currentColor" d="M28 10v18H10V10h18m0-2H10a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2Z" /><path fill="currentColor" d="M4 18H2V4a2 2 0 0 1 2-2h14v2H4Z" /></svg>
            <div class="group-hover:op-100 gpt-copy-tips">
                         ${state ? "Copied" : "Copy"}
            </div>
      </div>
      ${rawCode}
      </div>`;
    };

    return md.render(message);
  };

  return (
    <div className="py-2 -mx-4 px-4 transition-colors md:hover:bg-slate/5 ">
      <div className={`flex gap-3 rounded-lg `}>
        <div
          className={`shrink-0 w-7 h-7 mt-4 rounded-full op-80 ${roleClass[role]}`}
        />

        {role === "user" && action != "DESCRIBE" && (
          <div
            className={`message prose break-words overflow-hidden text-[14px]  op-75 `}
            dangerouslySetInnerHTML={{ __html: htmlString() }}
          />
        )}
        {role === "user" && action == "DESCRIBE" && uploadImages && (
          <div className="message prose flex justify-start flex-col items-start break-words overflow-hidden text-[14px]">
            <div className="flex items-center justify-center gap-2 pt-4 font-700">
              {`🍺 Describe Following Image`}
            </div>
            <PhotoView src={uploadImages[0]}>
              <img
                src={uploadImages[0]}
                alt=""
                width={"300px"}
                className={`mt-2 rounded-md select-none`}
              />
            </PhotoView>
          </div>
        )}
        {role === "user" && action == "BLEND" && uploadImages && (
          <div className="message prose flex justify-start flex-col items-start break-words overflow-hidden text-[14px]">
            <div className="flex items-center justify-center gap-2 pt-4 font-700">
              {`🍺 Blend Following Images`}
            </div>
            {uploadImages.map((item, index) => { 
              return (
                <PhotoView src={item}>
                  <img
                    src={item}
                    alt=""
                    width={"300px"}
                    className={`mt-2 rounded-md select-none`}
                  />
                </PhotoView>
              )
            })}
          </div>
        )}
        {role === "assistant" && result?.action != "DESCRIBE" && (
          <div className=" message prose flex justify-start flex-col items-start break-words overflow-hidden text-[14px]">
            <div className="flex items-center justify-center gap-2 pt-4 font-700 whitespace-pre-wrap ">
              {`${result?.finished ? "✅" : `⏳ ${result?.progress}`} [${
                result?.taskId
              }] ${message} `}
            </div>
            <PhotoView src={result?.imgUrl}>
              <img
                src={result?.imgUrl}
                alt=""
                width={"300px"}
                className={`mt-2 rounded-md select-none`}
              />
            </PhotoView>
            {result?.finished && result.action != "UPSCALE" && result.action != "BLEND"  && (
              <div className={"mt-2"}>
                <ActionBtn
                  handleClickVariate={(e) => {
                    clickAction &&
                      clickAction({
                        type: "variate",
                        content: `🎲 V${e} [${result?.taskId}]`,
                        index: e,
                        taskId: result?.taskId,
                      });
                  }}
                  HandleClickUpscale={(e) => {
                    clickAction &&
                      clickAction({
                        type: "upscale",
                        content: `⛳️ U${e} [${result?.taskId}]`,
                        index: e,
                        taskId: result?.taskId,
                      });
                  }}
                />
              </div>
            )}
          </div>
        )}
        {role === "assistant" && result?.action == "DESCRIBE" && (
          <div className=" message prose flex justify-start flex-col items-start break-words overflow-hidden text-[14px]">
            <div className="flex items-center justify-center gap-2 pt-4 font-700 whitespace-pre-wrap ">
              {`${result?.finished ? "✅" : `⏳ ${result?.progress}`} [${
                result?.taskId
              }] `}
            </div>
            <div
              className={`message prose break-words overflow-hidden text-[14px]  op-75 `}
              dangerouslySetInnerHTML={{ __html: htmlString() }}
            />
            <PhotoView src={result?.imgUrl}>
              <img
                src={result?.imgUrl}
                alt=""
                width={"300px"}
                className={`mt-2 rounded-md select-none`}
              />
            </PhotoView>
          </div>
        )}
      </div>
      {!showRetry ||
        (showRetry() && onRetry && result?.action != "UPSCALE" && (
          <div className="fie px-3 mb-2">
            <div
              onClick={() => {
                // return onRetry && onRetry({
                //   type: "reroll",
                //   content: `🍭 ReRoll [${result?.taskId}]`,
                //   taskId: result?.taskId
                // })
                return (
                  onRetry &&
                  onRetry({
                    type: "imagine",
                    content: message,
                    taskId: result?.taskId,
                  })
                );
              }}
              className="gpt-retry-btn"
            >
              <IconRefresh />
              <span className={"text-[12px]"}>Regenerate</span>
            </div>
          </div>
        ))}
    </div>
  );
};
