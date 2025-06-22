import { useEffect, useState } from "react";
import PillIcon from "../assets/icons/Pill.svg";
import { Link } from "react-router-dom";

export default function AddButton() {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY) {
        setVisible(true); // Scroll up
      } else {
        setVisible(false); // Scroll down
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <Link to="/scan">
      <button
        className={`cursor-pointer fixed z-10 bottom-[6rem] right-5 w-[3.25rem] h-[3.25rem] px-[1rem] flex items-center justify-center gap-[1rem] max-h-[30rem] bg-[var(--primary-color)] rounded-full transition-transform duration-300 ease-in-out
        ${visible ? "scale-100 animate-bounce-in" : "scale-0"}`}
      >
        <img src={PillIcon} alt="Add" />
      </button>
    </Link>
  );
}
