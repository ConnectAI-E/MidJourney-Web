import React from 'react';

interface ActionBtnProps {
    handleClickVariate?: () => void;
    HandleClickUpscale?: () => void;
};


interface SimgleBtnProps {
    handleClick?: () => void;
    text?: string;
}

const BtnClick = ({ handleClick ,text}: SimgleBtnProps) => {
  return (
    <button
      onClick={handleClick}
      className="img-action-btn font-500 text-[12px] tracking-wide delay-75 "
    >
      {text}
    </button>
  );
};

const ActionBtn: React.FC<ActionBtnProps> = ({
                                                 handleClickVariate,
                                                 HandleClickUpscale,
                                                 ...props
}) => {



    return (
      <div
        {...props}
        className="flex justify-start items-center gap-2 max-w-[300px] flex-wrap"
      >
        <BtnClick handleClick={handleClickVariate} text={"U1"} />
        <BtnClick handleClick={handleClickVariate} text={"U2"} />
        <BtnClick handleClick={handleClickVariate} text={"U3"} />
        <BtnClick handleClick={handleClickVariate} text={"U4"} />
        <BtnClick handleClick={handleClickVariate} text={"V1"} />
        <BtnClick handleClick={handleClickVariate} text={"V2"} />
        <BtnClick handleClick={handleClickVariate} text={"V3"} />
        <BtnClick handleClick={handleClickVariate} text={"V4"} />
      </div>
    );
};

export default ActionBtn;
