import {useRef, useState} from 'react';
import IconEnv from './icons/Env';
import {msgAtom} from '@/hooks/useMessageList';
import {useAtom} from 'jotai';
import {OPS_URL} from '@/utils/constants';

interface Props {
}

export default function SystemSetting(props: Props) {
    const systemInputRef = useRef<HTMLTextAreaElement>(null);
    const [editing, setEditing] = useState(false);
    const [currentSystemRoleSettings] = useAtom(msgAtom.msgSystemContentAtom);
    const [, addSystemRole] = useAtom(msgAtom.AddSystemMsgAtom);
    useEffect(() => {
        if (systemInputRef.current) {
            systemInputRef.current.focus();
            systemInputRef.current!.value = currentSystemRoleSettings;
        }
    }, [editing]);
    const handleSetBtnClick = () => {
        console.log(systemInputRef.current!.value);
        addSystemRole(systemInputRef.current!.value);
        setEditing(false);
    };

    const handleCancelBtnClick = () => {
        setEditing(false);
    };

    const [systemRoleEditing] = useAtom(msgAtom.ifAllowEditSystemMsgAtom);
    return (
        <div className="my-1">
            { (
                <>
                    { (
                        <a
                            href={ OPS_URL } target="_blank"
                            onClick={ () => setEditing(!editing) }
                            className="sys-edit-btn"
                        >
                            <IconEnv/>
                            <span>Open Prompt Studio</span>
                        </a>
                    ) }
                </>
            ) }
        </div>
    );
}
