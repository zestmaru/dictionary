import { useState } from 'react';
import Cookies from 'js-cookie';
import { Sun, Moon } from 'react-bootstrap-icons';

export const themeSwitcher = () => {
  // Retrieve theme preference from cookie, default to 'light-mode'
  const initialMode = Cookies.get('theme') || 'light-mode';
  const [darkMode, setDarkMode] = useState(initialMode === 'dark-mode');

  const toggleTheme = () => {
    const newTheme = darkMode ? 'light-mode' : 'dark-mode';
    setDarkMode(!darkMode);
    // Store theme preference in a cookie
    Cookies.set('theme', newTheme);

    document.body.classList.toggle('dark-mode', newTheme === 'dark-mode');
  };

  const darkModeSwitch = (
    <div className="dark-mode-switch">
      <span className="switch-label">
        <Sun size={"1.5em"} />
      </span>
      <label className="switch">
        <input
          type="checkbox"
          className="custom-switch-input"
          checked={darkMode}
          onChange={toggleTheme}
        />
        <span className="slider round"></span>
      </label>
      <span className="switch-label switch-right">
        <Moon size={"1.5em"} />
      </span>
    </div>
  );

  return { darkMode, toggleTheme, darkModeSwitch };
};