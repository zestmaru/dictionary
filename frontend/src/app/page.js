"use client";

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

import { Oval } from 'react-loader-spinner'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './css/App.css';

import languages from './language/LanguageConfig';

function App() {
  const [wordData, setWordData] = useState({ rus: '', eng: '' });
  const [userInput, setUserInput] = useState('');
  const [currentScreen, setCurrentScreen] = useState('main'); // Possible values: 'main', 'correct', 'incorrect', 'error'
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [mounted, setMounted] = useState(false);

  // Retrieve language preference from cookie, default to 'eng'
  const initialLang = Cookies.get('language') || 'eng';
  const [currentLang, setCurrentLang] = useState(initialLang);

  useEffect(() => {
    setMounted(true);
    
    // Make API call when the component mounts
    fetchWord();
  }, []); // Empty dependency array ensures the effect runs only once

  const fetchWord = () => {
    setLoading(true);
  
    const timeout = 10000; // 10 seconds
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    );
  
    // Fetch data and handle the timeout scenario
    Promise.race([
      fetch('http://127.0.0.1:5000/get_single_word').then(response => {
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
  
  const toggleLanguage = () => {
    const newLang = currentLang === 'eng' ? 'rus' : 'eng';
    setCurrentLang(newLang);
    // Store language preference in a cookie
    Cookies.set('language', newLang);
  };

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
    fetchWord(); // Make API request when restart button is pressed
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
    <div className="App">
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
          {/* Main content */}
          <div className="language-switch">
            {/* Render the switch only on the main screen */}
            {currentScreen === 'main' && (
            <>
              <span className="lang-label">{languages['eng'].lang}</span>
              <label className="switch">
                <input type="checkbox" 
                  className="custom-switch-input" 
                  checked={currentLang === 'rus'} 
                  onChange={toggleLanguage} />
                <span className="slider round"></span>
              </label>
              <span className="lang-label lang2">{languages['rus'].lang}</span>
            </>
            )}
          </div>
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

export default App;
