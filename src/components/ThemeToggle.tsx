import {Around} from '@theme-toggles/react';
import '@theme-toggles/react/css/Around.css';
import {useThemeToggle} from '@/hooks/useThemeToggle';
import React from 'react';


const ThemeToggle = () => {
    const { isToggled, handleToggleClick } = useThemeToggle();

    return (
        <div>
            <Around
                className={ `text-4xl ${ isToggled ? 'text-white' : 'text-dark' }` }
                toggled={ isToggled }
                toggle={ handleToggleClick }
            />
        </div>
    );
};

export default ThemeToggle;
