"use client";

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

import { Oval } from 'react-loader-spinner'

import '../css/App.css';
import languages from '../language/LanguageConfig';

import ReactCountryFlag from "react-country-flag"

function SelectGameApp() {
  const [wordData, setWordData] = useState({ rus: '', eng: '' });
  const [userInput, setUserInput] = useState('');
  const [currentScreen, setCurrentScreen] = useState('main'); // Possible values: 'main', 'correct', 'incorrect', 'error'
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [mounted, setMounted] = useState(false);

  // Retrieve language preference from cookie, default to 'eng'
  const initialLang = Cookies.get('language') || 'eng';
  const [currentLang, setCurrentLang] = useState(initialLang);

  // Retrieve theme preference from cookie, default to 'light-mode'
  const initialMode = Cookies.get('theme') || 'light-mode';
  const [darkMode, setDarkMode] = useState(initialMode === 'dark-mode');

  useEffect(() => {
    setMounted(true);

    // Make API call when the component mounts
    fetchWord();

  }, []); // Empty dependency array ensures the effect runs only once

  useEffect(() => {
    setShuffledWordOrder(shuffleWords());

  }, [wordData]); // Update shuffledWordOrder when wordData changes

  const fetchWord = () => {
    setLoading(true);
  
    const timeout = 10000; // 10 seconds
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    );
  
    // Fetch data and handle the timeout scenario
    Promise.race([
      fetch('http://127.0.0.1:5000/get_random_est').then(response => {
        if (!response.ok) {
          throw new Error(`Backend error! Status: ${response.status}`);
        }
        return response.json();
      }),
      timeoutPromise,
    ])
      .then(data => {
        // Reset loading state
        setLoading(false);
  
        if (data === null) {
          throw new Error('Word data is null');
        }
  
        // Set word data and reset error state
        setWordData(data);
        setError(null);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
  
        // Reset loading state and set error state
        setLoading(false);
        setError(error.message);
        setCurrentScreen('error');
      });
  };
  
  const shuffleWords = () => {
    const words = [wordData["est"], wordData["random_est_1"], wordData["random_est_2"]];
    const shuffledWords = words.sort(() => Math.random() - 0.5);
    return shuffledWords;
  };

  const [shuffledWordOrder, setShuffledWordOrder] = useState(shuffleWords);

  const toggleLanguage = () => {
    const newLang = currentLang === 'eng' ? 'rus' : 'eng';
    setCurrentLang(newLang);
    // Store language preference in a cookie
    Cookies.set('language', newLang);
  };

  const toggleTheme = () => {
    const newTheme = darkMode ? 'light-mode' : 'dark-mode';
    setDarkMode(!darkMode);
    // Store theme preference in a cookie
    Cookies.set('theme', newTheme);
  };

  const handleWordButtonClick = (selectedWord) => {
    setUserInput(selectedWord);
    const correctValue = wordData["est"];
    
    if (selectedWord.toLowerCase() === correctValue.toLowerCase()) {
      setCurrentScreen('correct');
    } else {
      setCurrentScreen('incorrect');
    }
  };

  const handleRestart = () => {
    setCurrentScreen('main');
    setUserInput('');
    fetchWord(); // Make API request when restart button is pressed
  };

  const renderMainScreen = () => (
    <div className="center">
      <div className="label">
      {currentLang === 'rus'
        ? wordData["rus"]
        : wordData["eng"]}
      :
    </div>
      <div className="word-buttons">
        {shuffledWordOrder.map((word, index) => (
          <button key={index} className="btn btn-primary" onClick={() => handleWordButtonClick(word)}>
            {word}
          </button>
        ))}
      </div>
    </div>
  );

  const renderCorrectScreen = () => (
    <div className="center">
      <h2>{currentLang === 'rus'
        ? wordData["rus"]
        : wordData["eng"]}</h2>
      <h2>{languages[currentLang].correct} {wordData["est"]}</h2>
      <button className="btn btn-success" onClick={handleRestart}>{languages[currentLang].restart}</button>
    </div>
  );

  const renderIncorrectScreen = () => (
    <div className="center">
      <h2>{currentLang === 'rus'
        ? wordData["rus"]
        : wordData["eng"]}</h2>
      <h2>{languages[currentLang].incorrectSelected.replace('{rightWord}', 
      wordData["est"]).replace('{userSelected}', userInput)}</h2>
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
        <Oval
        visible={true}
        height="80"
        width="80"
        color="#0069d9"
        secondaryColor="#0062cc"
        ariaLabel="oval-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
      ) : (
        <>
          <div className="dark-mode-switch">
            <label className="switch">
              <input
                type="checkbox"
                className="custom-switch-input"
                checked={darkMode}
                onChange={toggleTheme}
              />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="language-switch">
            {/* Render the language switch only on the main screen */}
            {currentScreen === 'main' && (
            <>
              <span className="lang-label"><ReactCountryFlag
                className="emojiFlag"
                countryCode="GB"
                style={{
                    fontSize: '2em',
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
              <span className="lang-label lang2"><ReactCountryFlag
                className="emojiFlag"
                countryCode="RU"
                style={{
                    fontSize: '2em',
                    lineHeight: '2em',
                }}
            /></span>
            </>
            )}
          </div>
          {currentScreen === 'main' && renderMainScreen()}
          {currentScreen === 'correct' && renderCorrectScreen()}
          {currentScreen === 'incorrect' && renderIncorrectScreen()}
          {currentScreen === 'error' && renderErrorScreen()}
        </>
      )}

    </div>
  );
}

export default SelectGameApp;
