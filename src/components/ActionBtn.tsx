import React from 'react';

interface ActionBtnProps {
  handleClickVariate: (arg: any) => void;
  HandleClickUpscale: (arg: any) => void;
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

    const handleClick = (arg:number) => {
        console.log(arg);

    };



    return (
      <div
        {...props}
        className="flex justify-start items-center gap-2 max-w-[300px] flex-wrap"
      >
        <BtnClick handleClick={() => HandleClickUpscale(1)} text={"U1"} />
        <BtnClick handleClick={() => HandleClickUpscale(2)} text={"U2"} />
        <BtnClick handleClick={() => HandleClickUpscale(3)} text={"U3"} />
        <BtnClick handleClick={() => HandleClickUpscale(4)} text={"U4"} />
        <BtnClick handleClick={() => handleClickVariate(1)} text={"V1"} />
        <BtnClick handleClick={() =>  handleClickVariate(2)} text={"V2"} />
        <BtnClick handleClick={() =>  handleClickVariate(3)} text={"V3"} />
        <BtnClick handleClick={() =>  handleClickVariate(4)} text={"V4"} />
      </div>
    );
};

export default ActionBtn;
