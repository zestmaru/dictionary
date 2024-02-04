"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

import './css/App.css';

import { themeSwitcher } from './common/themeSwitcher';
import { languageSwitcher } from './common/languageSwitcher';
import languages from './language/LanguageConfig';

export default function Index() {
    const [currentScreen] = useState('main');
    
    const { languageSwitch, currentLang } = languageSwitcher();
    const { darkMode, darkModeSwitch } = themeSwitcher();

    // Handle language switch on the client side
    useEffect(() => {
        languageSwitch(currentScreen);
    }, [currentLang, currentScreen]);

    return (
        <div className={`App ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <>
            {darkModeSwitch}
            {languageSwitch(currentScreen)}
            <div className="label">
                {languages[currentLang].indexSelectGame}:
            </div>
            <div className="word-buttons">
                <Link legacyBehavior href="/type_game">
                    <button className="btn btn-primary">{languages[currentLang].typeGame}</button>
                </Link>
                <Link legacyBehavior href="/select_game">
                    <button className="btn btn-primary"> {languages[currentLang].SelectGame}</button>
                </Link>
            </div>
            </>
        </div>
    )
}