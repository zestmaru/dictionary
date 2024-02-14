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
    const { darkModeSwitch } = themeSwitcher();

    // Handle language switch on the client side
    useEffect(() => {
        languageSwitch(currentScreen);
    }, [currentLang, currentScreen]);

    return (
        <div className="App">
            <>
            <div className="container">
                <div className="row">
                    <div className="col-md-4">
                        <div className="top-bar">
                            {languageSwitch(currentScreen)}
                        </div>
                    </div>
                    <div className="col-md-4">
                        
                    </div>
                    <div className="col-md-4 d-flex justify-content-end">
                        <div className="top-bar text-right">
                            {darkModeSwitch}
                        </div>
                    </div>
                </div>
            </div>
            <div className="container center-container">
                <div className="label">
                    {languages[currentLang].indexSelectGame}:
                </div>
                <div className="word-buttons">
                    <Link legacyBehavior href="/type_game">
                        <button className="btn btn-primary">{languages[currentLang].typeGame}</button>
                    </Link>
                    <Link legacyBehavior href="/select_game">
                        <button className="btn btn-primary"> {languages[currentLang].selectGame}</button>
                    </Link>
                </div>
                <div style={{marginTop: '10px'}}>
                    <Link legacyBehavior href="/edit_words">
                        <button className="btn btn-primary"> {languages[currentLang].editWords}</button>
                    </Link>
                </div>
            </div>
            </>
        </div>
    )
}