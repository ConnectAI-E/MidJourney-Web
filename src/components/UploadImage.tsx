import React from 'react';
import {PhotoProvider, PhotoView} from 'react-photo-view';
import BtnDelete from '@/components/icons/BtnDelete';


interface ImageWithDeleteButtonProps {
    index: number;
    src: string;
    handleDelete: () => void;
}

const ImageWithDeleteButton = ({
                                   index,
                                   src,
                                   handleDelete,
                               }: ImageWithDeleteButtonProps) => {
    const handleClick = (event: any) => {
        event.stopPropagation();
        handleDelete();
    };
    return (

        <PhotoView key={ index } src={ src } triggers={['onDoubleClick']}>
            <div className="relative flex">
                <div onClick={ handleDelete }
                     className="text-white absolute right-1 top-1 text-[24px] rounded p-1 bg-slate/30 hover:bg-slate/60 cursor-pointer z-100">
                    <BtnDelete/>
                </div>
                <img
                    src={ src }
                    alt=""
                    width={ '120px' }
                    className={ `rounded-md` }
                />
            </div>
        </PhotoView>
    );
};

interface UploadImageProps {
    images: string[];
    handleDelete: (index: number) => void;
}

export default function UploadImage({ images, handleDelete }: UploadImageProps) {
    return (
        <div className="flex justify-start flex-row gap-3">
            <PhotoProvider>
                { images.map((image, index) => (
                    <ImageWithDeleteButton key={ index } index={ index } src={ image }
                                           handleDelete={ () => handleDelete(index) }/>
                )) }
            </PhotoProvider>
        </div>
    );
}
