import { useEffect, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export const useThemeToggle = () => {
  const [isToggled, setToggle] = useState(false);
  const { setItem, getItem } = useLocalStorage();
  useEffect(() => {
    getItem("theme")
      .then((theme) => {
        // console.log("theme",theme);
        document.documentElement.classList.toggle("dark", theme === "dark");
        document.documentElement.classList.add(theme);
        setToggle(theme === "dark");
      })
      .catch(() => {
        const colorSchema = window.matchMedia("(prefers-color-scheme: dark)");
        const handleColorSchemaChange = () => {
          document.documentElement.classList.toggle(
            "dark",
            colorSchema.matches
          );
          setToggle(colorSchema.matches);
        };
        handleColorSchemaChange(); // update toggle initially
        colorSchema.addEventListener("change", handleColorSchemaChange);
        return () => {
          colorSchema.removeEventListener("change", handleColorSchemaChange);
        };
      });
  }, []);

  const handleToggleClick = (event) => {
    const element = document.documentElement;
    element.classList.add("animate");

    setTimeout(() => {
      element.classList.toggle("active");
      toggleTheme(event);
    }, 150);

    setTimeout(() => element.classList.remove("animate"), 300);

    // element.classList.toggle("dark", isDark);
    setItem("theme", isDark ? "dark" : "light");
    setToggle(isDark);
  };

  /**
   * 切换主题色，扩散渐变动画
   *
   * @param {MouseEvent} event 点击事件
   */
  function toggleTheme(event) {
    const willDark = !isDark();

    const transition = document.startViewTransition(() => {
      toggleDark();
    });

    // 传入点击事件，从点击处开始扩散。否则，从右上角开始扩散
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

  /**
   * 当前主题色是否是暗色
   */
  function isDark() {
    return document.documentElement.classList.contains("dark");
  }

  function toggleDark() {
    document.documentElement.classList.toggle("dark");
  }

  return {
    isToggled,
    handleToggleClick,
  };
};
