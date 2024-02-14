"use client";

import React, { useState, useEffect } from 'react';

import '../css/App.css';

import languages from '../language/LanguageConfig';
import LoaderSpinner from '../common/loaderSpinner';
import { themeSwitcher } from '../common/themeSwitcher';
import { languageSwitcher } from '../common/languageSwitcher';
import fetchWord from '../common/fetchWord';

import IndexPageElement from '../common/indexPageButton';

function SelectGameApp() {
  const [wordData, setWordData] = useState({ rus: '', eng: '' });
  const [userInput, setUserInput] = useState('');
  const [currentScreen, setCurrentScreen] = useState('main'); // Possible values: 'main', 'correct', 'incorrect', 'error'
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [mounted, setMounted] = useState(false);

  const { languageSwitch, currentLang } = languageSwitcher();
  const { darkModeSwitch } = themeSwitcher();

  const apiUrl = 'http://127.0.0.1:5000/get_random_est';

  useEffect(() => {
    setMounted(true);

    // Make API call when the component mounts
    fetchWord(apiUrl, setLoading, setWordData, setError, setCurrentScreen);
  }, []); // Empty dependency array ensures the effect runs only once

  useEffect(() => {
    setShuffledWordOrder(shuffleWords());

  }, [wordData]); // Update shuffledWordOrder when wordData changes

  // Handle language switch on the client side
  useEffect(() => {
    languageSwitch(currentScreen);
  }, [currentLang, currentScreen]);

  const shuffleWords = () => {
    const words = [wordData["est"], wordData["random_est_1"], wordData["random_est_2"]];
    const shuffledWords = words.sort(() => Math.random() - 0.5);
    return shuffledWords;
  };

  const [shuffledWordOrder, setShuffledWordOrder] = useState(shuffleWords);

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
    fetchWord(apiUrl, setLoading, setWordData, setError, setCurrentScreen); // Make API request when restart button is pressed
  };

  const renderMainScreen = () => (
    <div className="container center-container">
      <div className="label">
      {currentLang === 'rus'
        ? wordData["rus"]
        : wordData["eng"]}
      :
    </div>
      <div className="word-buttons">
        {shuffledWordOrder.map((word, index) => (
          <button key={index} 
            className="btn btn-primary" 
            onClick={() => handleWordButtonClick(word)}>
            {word}
          </button>
        ))}
      </div>
    </div>
  );

  const renderCorrectScreen = () => (
    <div className="container center-container">
      <h2>{currentLang === 'rus'
        ? wordData["rus"]
        : wordData["eng"]}</h2>
      <h2>{languages[currentLang].correct} {wordData["est"]}</h2>
      <button 
        className="btn btn-success" 
        onClick={handleRestart}>{languages[currentLang].restart}</button>
    </div>
  );

  const renderIncorrectScreen = () => (
    <div className="container center-container">
      <h2>{currentLang === 'rus'
        ? wordData["rus"]
        : wordData["eng"]}</h2>
      <h2>{languages[currentLang].incorrectSelected.replace('{rightWord}', 
      wordData["est"]).replace('{userSelected}', userInput)}</h2>
      <button 
        className="btn btn-danger" 
        onClick={handleRestart}>{languages[currentLang].restart}</button>
    </div>
  );

  const renderErrorScreen = () => (
    <div className="container center-container error-screen">
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
          {currentScreen === 'correct' && renderCorrectScreen()}
          {currentScreen === 'incorrect' && renderIncorrectScreen()}
          {currentScreen === 'error' && renderErrorScreen()}
        </>
      )}
    </div>
  );
}

export default SelectGameApp;
