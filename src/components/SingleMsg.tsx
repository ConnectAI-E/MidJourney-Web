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

interface Props {
  role: ChatMessage["role"];
  message: string;
  result?: ChatMessage["result"];
  showRetry?: () => boolean;
  onRetry?: () => void;
}

// https://windicss.org/utilities/general/colors.html
export default ({ role, message, result, showRetry, onRetry }: Props) => {
  const roleClass = {
    system: "bg-gradient-to-l from-gray-400 via-gray-300 to-gray-100",
    user: "bg-gradient-to-l from-amber-600  via-amber-400 to-orange-200",
    assistant: "bg-gradient-to-l from-green-600 via-green-400 to-cyan-200",
  };
  const [source, setSource] = useState("");
  const [state, copyToClipboard] = useCopyToClipboard();

  const ifDown = result?.finished
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

        {role === "user" && (
          <div
            className={`message prose break-words overflow-hidden text-[14px]  op-75 `}
            dangerouslySetInnerHTML={{ __html: htmlString() }}
          />
        )}
        {role === "assistant" && (
          <div className="message prose flex justify-start flex-col items-start break-words overflow-hidden text-[14px]">
            <div className="flex items-center justify-center gap-2 pt-4 font-700">
              {`[${result?.taskId}]  ${message}`}
            </div>
            <PhotoProvider>
              <PhotoView src={result?.imgUrl}>
                <img
                  src={result?.imgUrl}
                  alt=""
                  width={"300px"}
                  className={`mt-2 rounded-md`}
                />
              </PhotoView>
            </PhotoProvider>

            {ifDown&&
            <div className={"mt-2"}>
              <ActionBtn
                handleClickVariate={(e) => {
                  console.log("v"+e);
                }}
                HandleClickUpscale={(e) => {
                  console.log("u"+e);
                }}
              />
            </div>}

          </div>
        )}
      </div>
      {!showRetry ||
        (showRetry() && onRetry && (
          <div className="fie px-3 mb-2">
            <div onClick={onRetry} className="gpt-retry-btn">
              <IconRefresh />
              <span className={"text-[12px]"}>Regenerate</span>
            </div>
          </div>
        ))}
    </div>
  );
};
