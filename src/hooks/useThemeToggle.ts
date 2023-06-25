import {useEffect, useState} from 'react';
import {useLocalStorage} from '@/hooks/useLocalStorage';
import {an} from 'vitest/dist/types-94cfe4b4';

export const useThemeToggle = () => {
  const [isToggled, setToggle] = useState(false);
  const { setItem, getItem } = useLocalStorage();
  useEffect(() => {
    getItem('theme').then(
        (theme) => {
          // console.log("theme",theme);
          document.documentElement.classList.toggle('dark', theme === 'dark');
          document.documentElement.classList.add(theme);
          setToggle(theme === 'dark');
        },
    ).catch(
        () => {
          const colorSchema = window.matchMedia('(prefers-color-scheme: dark)');
          const handleColorSchemaChange = () => {
            document.documentElement.classList.toggle('dark', colorSchema.matches);
            setToggle(colorSchema.matches);
          };
          handleColorSchemaChange(); // update toggle initially
          colorSchema.addEventListener('change', handleColorSchemaChange);
          return () => {
            colorSchema.removeEventListener('change', handleColorSchemaChange);
          };
        },
    );


  }, []);

  const handleToggleClick = () => {
    const element = document.documentElement;
    const isDark = !element.classList.contains('dark');
    element.classList.add("animate");

    setTimeout(() => {
      element.classList.toggle("active");
      toggleTheme(event);
    }, 150);

    setTimeout(() => element.classList.remove("animate"), 300);

    setItem('theme', isDark ? 'dark' : 'light');
    setToggle(isDark);
  };

  function toggleTheme(event:any) {
    const element = document.documentElement;
    const willDark = ! element.classList.contains('dark')
    const doc = document as any
    const transition = doc.startViewTransition(() => {
      const isDark = !element.classList.contains('dark');
      element.classList.toggle('dark', isDark);
    });

    const x = event?.clientX ?? window.innerWidth;
    const y = event?.clientY ?? 0;

    const endRadius = Math.hypot(
        Math.max(x, innerWidth - x),
        Math.max(y, innerHeight - y)
    );
    void transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];
      document.documentElement.animate(
          {
            clipPath: willDark ? clipPath : [...clipPath].reverse(),
          },
          {
            duration: 500,
            easing: "ease-in",
            pseudoElement: willDark
                ? "::view-transition-new(root)"
                : "::view-transition-old(root)",
          }
      );
    });
  }

  return {
    isToggled,
    handleToggleClick,
  };
};
