import {atom} from 'jotai';


export const showBackBottomBtn = atom(false);
export const showBackTopBtn = atom(false);

export const showEnterLicense = atom(false);
export const ShowLicenseFromAtom = atom(null, (get, set) => {
    set(showEnterLicense, true);
});

export const CloseLicenseFromAtom = atom(null, (get, set) => {
    set(showEnterLicense, false);
})
