"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation'

import '../css/App.css';

import LoaderSpinner from '../common/loaderSpinner';
import { themeSwitcher } from '../common/themeSwitcher';
import { getLocalizedString } from '../language/LanguageConfig.js';
import { languageSwitcher } from '../common/languageSwitcher';

import fetchWord from '../common/fetchWord';

import IndexPageElement from '../common/indexPageButton';

function EditWordsPage(){
    const router = useRouter();
    const searchParams = useSearchParams()
    const page = searchParams.get('page')

    const [wordData, setWordData] = useState({ word_list: [], total_count: 0 });
    const [loading, setLoading] = useState(false);
    const [currentScreen, setCurrentScreen] = useState('main');
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(page ? parseInt(page, 10) : 1); // Set initial page based on the URL parameter

    const { languageSwitch, currentLang } = languageSwitcher();
    const { darkModeSwitch } = themeSwitcher();

    const [mounted, setMounted] = useState(false);

    const pageSize = 10; // Set the number of items per page
    const apiUrl = `http://127.0.0.1:5000/get_list_word?page=${currentPage}`;

    useEffect(() => {
      setMounted(true);
  
      // Make API call when the component mounts or when the page changes
      fetchWord(apiUrl, setLoading, setWordData, setError, setCurrentScreen);
    }, [currentPage]); // Include currentPage in the dependency array

    useEffect(() => {
      languageSwitch(currentScreen);
    }, [currentLang, currentScreen]);

    const handlePageChange = (newPage) => {
      setCurrentPage(newPage);

      const newUrl = `/edit_words?page=${newPage}`;
      router.push(newUrl);
    };

    const renderPaginationControls = () => (
      <div className="text-xs-center">
        <nav aria-label="Page navigation">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              >
                {getLocalizedString(currentLang, 'paginationFirst')}
              </button>
            </li>
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &laquo;
              </button>
            </li>
            {Array.from({ length: Math.ceil(wordData.total_count / pageSize) }, (_, index) => (
              <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                  {currentPage === index + 1 && <span className="sr-only"></span>}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage * pageSize >= wordData.total_count ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage * pageSize >= wordData.total_count}
              >
                &raquo;
              </button>
            </li>
            <li className={`page-item ${currentPage * pageSize >= wordData.total_count ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(Math.ceil(wordData.total_count / pageSize))}
                disabled={currentPage * pageSize >= wordData.total_count}
              >
                {getLocalizedString(currentLang, 'paginationLast')}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    );

    const renderMainScreen = () => (
      <>
        {wordData.word_list.length > 0 ? (
          <>
          <div className="container word-list">
            <ul className="list-group mx-auto">
              {wordData.word_list.map(word => (
                <div key={word._id} className="list-group-item">
                  <p>{word._id}</p>
                  <p>{word.eng}</p>
                  <p>{word.est}</p>
                  <p>{word.rus}</p>
                </div>
              ))}
            </ul>
          </div>
            {renderPaginationControls()}
          </>
        ) : (
          <div className="container word-list">
            <p>{getLocalizedString(currentLang, 'noWordsFound')}</p>
          </div>
        )}
      </>
    );

    const renderErrorScreen = () => (
      <div className="error-screen">
        <h2>{getLocalizedString(currentLang, 'httpError')}</h2>
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