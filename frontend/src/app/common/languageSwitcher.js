import { useState } from 'react';
import Cookies from 'js-cookie';

import ReactCountryFlag from "react-country-flag"

export const languageSwitcher = () => {
  // Retrieve language preference from cookie, default to 'eng'
  const initialLang = Cookies.get('language') || 'eng';
  const [currentLang, setCurrentLang] = useState(initialLang);

  const toggleLanguage = () => {
    const newLang = currentLang === 'eng' ? 'rus' : 'eng';
    setCurrentLang(newLang);
    // Store language preference in a cookie
    Cookies.set('language', newLang);
  };

  const languageSwitch = (currentScreen) => (
    <div className="language-switch">
      {/* Render the language switch only on the main screen */}
      {currentScreen === 'main' && (
        <>
          <span className="switch-label"><ReactCountryFlag
            className="emojiFlag"
            countryCode="GB"
            style={{
              fontSize: '1.5em',
              lineHeight: '2em',
            }}
          /></span>
          <label className="switch">
            <input type="checkbox"
              className="custom-switch-input"
              checked={currentLang === 'rus'}
              onChange={toggleLanguage} />
            <span className="slider round"></span>
          </label>
          <span className="switch-label switch-right"><ReactCountryFlag
            className="emojiFlag"
            countryCode="RU"
            style={{
              fontSize: '1.5em',
              lineHeight: '2em',
            }}
          /></span>
        </>
      )}
    </div>
  );

  return { currentLang, toggleLanguage, languageSwitch };
};
