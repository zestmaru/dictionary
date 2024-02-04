"use client";

import React, { useState, useEffect } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../css/App.css';
import languages from '../language/LanguageConfig';
import LoaderSpinner from '../common/loaderSpinner';
import { themeSwitcher } from '../common/themeSwitcher';
import { languageSwitcher } from '../common/languageSwitcher';
import fetchWord from '../common/fetchWord';

function TypeGameApp() {
  const [wordData, setWordData] = useState({ rus: '', eng: '' });
  const [userInput, setUserInput] = useState('');
  const [currentScreen, setCurrentScreen] = useState('main'); // Possible values: 'main', 'correct', 'incorrect', 'error'
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [mounted, setMounted] = useState(false);

  const { languageSwitch, currentLang } = languageSwitcher();
  const { darkMode, darkModeSwitch } = themeSwitcher();

  const apiUrl = 'http://127.0.0.1:5000/get_single_word';

  useEffect(() => {
    setMounted(true);
    
    // Make API call when the component mounts
    fetchWord(apiUrl, setLoading, setWordData, setError, setCurrentScreen);
  }, []); // Empty dependency array ensures the effect runs only once

  // Handle language switch on the client side
  useEffect(() => {
    languageSwitch(currentScreen);
  }, [currentLang, currentScreen]);

  const handleInputChange = (e) => {
    // Update user input as the user types
    setUserInput(e.target.value);
  };

  const handleButtonClick = () => {
    if (userInput.trim() === '') {
      toast.error(languages[currentLang].emptyUserInput);
      return;
    }

    // Check if the input matches the correct value when the button is clicked
    const correctValue = wordData[currentLang];

    if (userInput.toLowerCase() === correctValue.toLowerCase()) {
      setCurrentScreen('correct');
    } else {
      setCurrentScreen('incorrect');
    }
  };

  const handleRestart = () => {
    setCurrentScreen('main');
    setUserInput('');

    // Make API request when restart button is pressed
    fetchWord(apiUrl, setLoading, setWordData, setError, setCurrentScreen);
  };

  const renderMainScreen = () => (
    <div className="center">
      <div className="label">{wordData["est"]}:</div>
      <input type="text" className="form-control" 
        placeholder={languages[currentLang].placeholder} 
        onChange={handleInputChange} value={userInput} />
      <button className="btn btn-primary" onClick={handleButtonClick}>{languages[currentLang].check}</button>
    </div>
  );

  const renderCorrectScreen = () => (
    <div className="center">
      <h2>{wordData["est"]}</h2>
      <h2>{languages[currentLang].correct} {wordData[currentLang]}</h2>
      <button className="btn btn-success" onClick={handleRestart}>{languages[currentLang].restart}</button>
    </div>
  );

  const renderIncorrectScreen = () => (
    <div className="center">
      <h2>{wordData["est"]}</h2>
      <h2>{languages[currentLang].incorrect.replace('{rightWord}', 
      wordData[currentLang]).replace('{userInput}', userInput)}</h2>
      <button className="btn btn-danger" onClick={handleRestart}>{languages[currentLang].restart}</button>
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
    <div className={`App ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      {loading ? (
        <LoaderSpinner />
      ) : (
        <>
          {darkModeSwitch}
          {languageSwitch(currentScreen)}
          {currentScreen === 'main' && renderMainScreen()}
          {currentScreen === 'correct' && renderCorrectScreen()}
          {currentScreen === 'incorrect' && renderIncorrectScreen()}
          {currentScreen === 'error' && renderErrorScreen()}
        </>
      )}
      <ToastContainer />
    </div>
  );
}

export default TypeGameApp;
