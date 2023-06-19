import React, {FunctionComponent} from 'react';
import {GITHUB_ORG_URL} from '@/utils/constants';
import {Toast, ToastType} from '@/components/Toast';
import {tw} from '@/utils/tw';
import '@/styles/licenseCheck.css';
import {validateLicenseKey} from '@/apis/image';
import {changeLicenceKeyAndCache, loadLicenseKey} from '@/ui.state';
import {useLocalStorage} from '@/hooks/useLocalStorage';
import {checkKeyFormat} from '@/utils/string';
import {useAtom} from 'jotai';
import {CloseLicenseFromAtom} from '@/hooks/useLayout';

interface OwnProps {
}

type Props = OwnProps;

interface ApiResponse {
    code: number;
}

interface FormInput {
    password: string;
}

const licenseForm: FunctionComponent<Props> = (props) => {
    const licenseKeyInputRef = useRef<HTMLInputElement>(null)
    const {getItem,setItem} = useLocalStorage();
    const[,closeLicenseEdit] = useAtom(CloseLicenseFromAtom)
    useEffect(() => {
        getItem("license").then((licenseKey)=> {
            // console.log(licenseKey);
            // changeLicenceKey(licenseKey);
            if (licenseKeyInputRef.current&&checkKeyFormat(licenseKey)) {
                licenseKeyInputRef.current.value = licenseKey;
            }
        }).catch()
    }, [])

    const [toast, setToast] = React.useState<{ type: ToastType, tip: string } | null>(null);

    const handleSuccess = (tip: string) => {
        setToast({ type: ToastType.Success, tip });
    };
    const handleError = (tip: string) => {
        setToast({ type: ToastType.Error, tip });
    };
    const handleWarn = (tip: string) => {
        setToast({ type: ToastType.Warn, tip });
    };
    const tip = {
        success: () => {
            handleSuccess('License updated successfully');
        },
        empty: () => {
            handleSuccess('License clear successfully');
        },
        repeat: () => {
            handleWarn('License is the same as before');
        },
        error: () => {
            handleError('License updated failed');
        },
    };

    const [invalid, setInvalid] = useState(false);


    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const license = licenseKeyInputRef.current?.value || ''
        if (license === loadLicenseKey()) {
            tip.repeat();
            return;
        }
        if (license === '') {
            changeLicenceKeyAndCache('')
            tip.empty();
            return;
        }


        try {
            const { if_validate } = await validateLicenseKey(license);
            if (if_validate) {
                tip.success();
                changeLicenceKeyAndCache(license);
                // 三秒后自动关闭
                setTimeout(() => {
                    closeLicenseEdit()
                },1200)
                return;
            }

        } catch {}


        setInvalid(true);
        tip.error();
        setTimeout(() => {
            setInvalid(false);
        }, 300);
    }


    return (
        <>
            <div className="mt-2 leading-normal text-sm op-50 dark:op-60">
                每日赠送的 1000 Tokens不够用？不妨试试
                <a
                    className="b-buy-link decoration-wavy underline-offset-8"
                    href={ GITHUB_ORG_URL } target="_blank"
                    rel="noopener noreferrer"
                >
                    插件合伙人计划
                </a> 。获取更多对话tokens，在无限可能中尽情释放AI力量。
            </div>
            <form id="input_container" onSubmit={ handleSubmit }
                  className={ tw(`flex mt-2`, invalid ? 'invalid' : '') }>
                <input id="password_input" type="pas"
                       placeholder="请输入您的合伙人专属License"
                       name="password"
                       ref={licenseKeyInputRef}
                       className="gpt-password-input"/>
                <button id="submit" className="gpt-password-submit">
                    <div className="i-carbon-arrow-right"/>
                </button>
            </form>
            { toast &&
                <Toast type={ toast.type } tip={ toast.tip } time={ 2000 } onFinish={
                    () => {
                        setToast(null);
                    }
                }/> }
        </>

    );
};

export default licenseForm;
