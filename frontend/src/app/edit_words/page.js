"use client";

import React, { useState, useEffect } from 'react';

import '../css/App.css';

import LoaderSpinner from '../common/loaderSpinner';
import { themeSwitcher } from '../common/themeSwitcher';
import languages from '../language/LanguageConfig';
import { languageSwitcher } from '../common/languageSwitcher';

import fetchWord from '../common/fetchWord';

import IndexPageElement from '../common/indexPageButton';

function EditWordsPage(){
    const [words, setWordData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentScreen, setCurrentScreen] = useState('main');
    const [error, setError] = useState(null);

    const { languageSwitch, currentLang } = languageSwitcher();
    const { darkModeSwitch } = themeSwitcher();

    const [mounted, setMounted] = useState(false);
    const apiUrl = 'http://127.0.0.1:5000/get_list_word';

    useEffect(() => {
      setMounted(true);
      
      // Make API call when the component mounts
      fetchWord(apiUrl, setLoading, setWordData, setError, setCurrentScreen);
    }, []); // Empty dependency array ensures the effect runs only once

    useEffect(() => {
      languageSwitch(currentScreen);
    }, [currentLang, currentScreen]);

    const renderMainScreen = () => (
      <div className="container word-list">
        <ul className="list-group mx-auto">
          {words.map(word => (
            <div key={word._id} className="list-group-item">
              <p>{word.eng}</p>
              <p>{word.est}</p>
              <p>{word.rus}</p>
            </div>
          ))}
        </ul>
      </div>
    );

    const renderErrorScreen = () => (
      <div className="error-screen">
        <h2>{languages[currentLang].httpError}</h2>
        <p>{error}</p>
        {/* No switch or button on the error screen */}
      </div>
    );

    if (!mounted) return <></>;

    return (
        <div className="App">
          {loading ? (
            <LoaderSpinner />
          ) : (
            <>
              <div className="container">
                <div className="row">
                    <div className="col-md-4">
                      <div className="top-bar">
                        {languageSwitch(currentScreen)}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="top-bar text-center">
                        <IndexPageElement />
                      </div>
                    </div>
                    <div className="col-md-4 d-flex justify-content-end">
                      <div className="top-bar text-right">
                        {darkModeSwitch}
                      </div>
                    </div>
                </div>
              </div>
              {currentScreen === 'main' && renderMainScreen()}
              {currentScreen === 'error' && renderErrorScreen()}
            </>
          )}
        </div>
      );
}

export default EditWordsPage;