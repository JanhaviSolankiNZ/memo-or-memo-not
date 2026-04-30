import { useEffect, useRef } from "react";

export function useFlashOnRender(renders) {
  const ref = useRef(null);

  useEffect(() => {
    console.log(renders)
    if (renders === 1) return;
    const el = ref.current;
    el.classList.remove("flash");
    void el.offsetWidth;
    el.classList.add("flash");
    const timer = setTimeout(() => el.classList.remove("flash"), 500);
    return () => clearInterval(timer);
  }, [renders]);

  return ref;
}
