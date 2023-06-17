import {useEffect, useState} from 'react';
import {useAtom} from 'jotai';
import {showBackBottomBtn} from '@/hooks/useLayout';

function BackToTopButton() {
    const [showBackTopBtn, setShowBackTopBtn] = useState(false);
    const [showDown, ] = useAtom(showBackBottomBtn)

    useEffect(() => {
        function handleScroll() {
            if (window.scrollY > 100) {
                setShowBackTopBtn(true);
            } else {
                setShowBackTopBtn(false);
            }
         }

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    function handleBackToTopClick() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function handleBackToBottomClick() {
        const scrollHeight = document.documentElement.scrollHeight;
        window.scrollTo({ top: scrollHeight, behavior: 'smooth' });
    }

    return (
        <>
            <button
                id="backtop_btn"
                className="gpt-back-top-btn"
                style={ { display: showBackTopBtn ? 'block' : 'none' } }
                onClick={ handleBackToTopClick }
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em"
                     viewBox="0 0 32 32">
                    <path fill="currentColor"
                          d="M16 4L6 14l1.41 1.41L15 7.83V28h2V7.83l7.59 7.58L26 14L16 4z"></path>
                </svg>
            </button>
            <button
                id="backbottom_btn"
                className="gpt-back-bottom-btn"
                style={ { display: showDown ? 'block' : 'none' } }
                onClick={ handleBackToBottomClick }
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em"
                     viewBox="0 0 32 32">
                    <path fill="currentColor"
                          d="M16 4L6 14l1.41 1.41L15 7.83V28h2V7.83l7.59 7.58L26 14L16 4z"></path>
                </svg>
            </button>
        </>
    );
}

export default BackToTopButton;
