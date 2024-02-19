"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation'

import '../css/App.css';

import { ToastContainer, toast } from 'react-toastify';
import LoaderSpinner from '../common/loaderSpinner';
import { themeSwitcher } from '../common/themeSwitcher';
import { getLocalizedString } from '../language/LanguageConfig.js';
import { languageSwitcher } from '../common/languageSwitcher';

import fetchWord from '../common/fetchWord';

import IndexPageElement from '../common/indexPageButton';
import AddWordForm from '../common/addWordForm';

function EditWordsPage() {
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

  const [forceRender, setForceRender] = useState(0);

  const pageSize = 10; // Set the number of items per page
  const apiUrl = `/api/get_list_word?page=${currentPage}`;

  const updateMainScreen = useCallback(() => {
    setForceRender(forceRender + 1);
  }, [forceRender]);

  useEffect(() => {
    setMounted(true);

    // Make API call when the component mounts or when the page changes
    fetchWord(apiUrl, setLoading, setWordData, setError, setCurrentScreen);
  }, [currentPage, forceRender]);

  useEffect(() => {
    languageSwitch(currentScreen);
  }, [currentLang, currentScreen]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);

    const newUrl = `/edit_words?page=${newPage}`;
    router.push(newUrl);
  };

  const handleDeleteWord = async (wordId) => {
    try {
      const response = await fetch(`/api/delete_word?_id=${wordId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        toast.success(getLocalizedString(currentLang, 'wordRemoved'));
        setTimeout(() => {
          updateMainScreen();
        }, 500);
      } else {
        const errorMessage = await response.text();
        toast.error(errorMessage, {
          onClose: () => { },
        });
      }
    } catch (error) {
      setError(error.message);
      toast.error(errorMessage, {
        onClose: () => { },
      });
    }
  };

  const renderPaginationControls = () => (
    <div className="text-xs-center">
      <p>{getLocalizedString(currentLang, 'total')}: {wordData.total_count}</p>
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

  const renderMainScreen = () => {
    if (wordData.word_list.length > 0) {
      return (
        <>
          <AddWordForm
            currentLang={currentLang}
            languageSwitch={languageSwitch}
            updateMainScreen={updateMainScreen}
          />
          <div className="container word-list">
            <table className="table table-bordered mx-auto">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Est</th>
                  <th scope="col">Eng</th>
                  <th scope="col">Rus</th>
                  <th scope="col">{getLocalizedString(currentLang, 'tableActions')}</th>
                </tr>
              </thead>
              <tbody>
                {wordData.word_list.map(word => (
                  <tr key={word._id}>
                    <td>{word._id}</td>
                    <td>{word.est}</td>
                    <td>{word.eng}</td>
                    <td>{word.rus}</td>
                    <td>
                      <button className="btn btn-danger" onClick={() => handleDeleteWord(word._id)}>{getLocalizedString(currentLang, 'delete')}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {renderPaginationControls()}
        </>
      );
    } else if (currentPage > 1) {
      handlePageChange(currentPage - 1)
    } else {
      return (
        <>
          <AddWordForm
            currentLang={currentLang}
            languageSwitch={languageSwitch}
            updateMainScreen={updateMainScreen}
          />
          <div className="container word-list">
            <p>{getLocalizedString(currentLang, 'noWordsFound')}</p>
          </div>
        </>
      );
    }
  };

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
        <div className="center-container">
          <LoaderSpinner />
        </div>
      ) : (
        <>
          <ToastContainer />
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