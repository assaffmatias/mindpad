import { useState, useEffect } from "react";
import Main from "./components/Main/Main";
import Navbar from "./components/Navbar/Navbar";

function App() {
  const [blur, setBlur] = useState(true); // ✅ solo en memoria
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved !== null ? saved === "true" : true;
  });

  const [data, setData] = useState(() => {
    const saved = localStorage.getItem("myData");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = e.target.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea") return;

      if (e.key.toLowerCase() === "b") setBlur((prev) => !prev);
      if (e.key.toLowerCase() === "t") setDarkMode((prev) => !prev);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const clearData = () => {
    localStorage.removeItem("myData");
    setData([]);
  };

  const toggleTheme = () => setDarkMode((prev) => !prev);
  const toggleBlur = () => setBlur((prev) => !prev);

  console.log(darkMode);


  return (
    <>
      <Navbar toggleBlur={toggleBlur} clearData={clearData} toggleTheme={toggleTheme} />
      <Main data={data} setData={setData} blur={blur} />
    </>
  );
}

export default App;
