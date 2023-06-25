import {atom} from 'jotai';



export const uploadImagesUrlAtom = atom<string[]>([])

export const hasUploadImagesAtom = atom((get) => {
    return get(uploadImagesUrlAtom).length > 0;
})


export const firstImageAtom = atom((get) => {
    if (get(uploadImagesUrlAtom).length === 0) {
        return "";
    }
    return get(uploadImagesUrlAtom)[0];
})
