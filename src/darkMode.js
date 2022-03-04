import React, { useState, useEffect, createContext } from "react";

//https://levelup.gitconnected.com/dark-mode-in-react-533faaee3c6e

export const themes = {
  dark: "",
  light: "white-content",
};

export const swapMode = (theme) => {
    switch (theme) {
      case themes.light:
        document.body.classList.add('white-content');
        break;
      case themes.dark:
      default:
        document.body.classList.remove('white-content');
        break;
    }
  }

export const ThemeContext = createContext({
    theme: themes.dark,
  changeTheme: () => {},
});

export default function ThemeContextWrapper(props) {
  const [theme, setTheme] = useState(props.theme);

  function changeTheme(theme) {
    setTheme(theme);
  }
 // console.log(theme)
  swapMode(theme)

  return (
    <ThemeContext.Provider value={{ theme: theme, changeTheme: changeTheme }}>
      {props.children}
    </ThemeContext.Provider>
  );
}