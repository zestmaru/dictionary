import React, { useState, useEffect } from 'react';

import { getLocalizedString } from '../language/LanguageConfig.js';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { PlusSquare } from 'react-bootstrap-icons';

function AddWordForm({ currentLang, languageSwitch, updateMainScreen }) {

    const [currentScreen] = useState('main');
    const [wordData, setWordData] = useState({ est: '', eng: '', rus: '' });
    const [showModal, setShowModal] = useState(false);
    const [file, setFile] = useState(null);

    const handleChange = (field, value) => {
        setWordData(prevData => ({
            ...prevData,
            [field]: value,
        }));
    };

    useEffect(() => {
        languageSwitch(currentScreen);
    }, [currentLang, currentScreen, languageSwitch]);

    const handleAddWord = async () => {
        // Validate the form before adding the word
        if (wordData.est.trim() === '' || wordData.eng.trim() === '' || wordData.rus.trim() === '') {
            toast.error(getLocalizedString(currentLang, 'emptyUserInput'), {
                onClose: () => { },
            });
            return;
        }

        try {
            // Create a JSON object to send to the backend
            const dataToSend = {
                est: wordData.est,
                eng: wordData.eng,
                rus: wordData.rus,
            };

            const response = await fetch('/api/add_word', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            if (response.ok) {
                // Reset the form after adding the word
                setWordData({ est: '', eng: '', rus: '' });

                updateMainScreen();

                // Close the modal with a delay to allow the fade effect
                setTimeout(() => {
                    toast.success(getLocalizedString(currentLang, 'wordAdded'));
                    handleClose();

                }, 300);
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'An error occurred', {
                    onClose: () => { },
                });
            }
        } catch (error) {
            toast.error(error.message || 'An error occurred', {
                onClose: () => {},
            });
        }
    };

    const handleExport = async () => {
        try {
            const response = await fetch('/api/get_list_word?page=0');
            if (response.ok) {
                const data = await response.json();

                const jsonString = JSON.stringify(data, null, 2);
                const blob = new Blob([jsonString], { type: 'application/json' });

                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = 'word_list.json';

                document.body.appendChild(link);
                link.click();

                document.body.removeChild(link);

                toast.success(getLocalizedString(currentLang, 'dbExported'));
                setTimeout(() => {
                    updateMainScreen();
                  }, 500);
            } else {
                const errorData = await response.text();
                toast.error(errorData.message || 'An error occurred', {
                    onClose: () => { },
                });
            }
        } catch (error) {
            toast.error(errorMessage, {
                onClose: () => { },
            });
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        handleImport(selectedFile);
    };

    const handleImport = async (selectedFile) => {
        try {
            if (!selectedFile) {
                toast.error(getLocalizedString(currentLang, 'selectFile'), {
                    onClose: () => {},
                });
                return;
            }

            if (selectedFile.type !== 'application/json') {
                toast.error(getLocalizedString(currentLang, 'invalidFileType'), {
                    onClose: () => {},
                });
                return;
            }

            const response = await fetch('/api/add_word_list', {
                method: 'PUT',
                body: selectedFile,
                headers: {
                    
                  },
            });

            if (response.ok) {
                toast.success(getLocalizedString(currentLang, 'dbImported'));
            } else {
                const errorData = await response.text();
                toast.error(errorData.message || 'An error occurred', {
                    onClose: () => { },
                });
            }
        } catch (error) {
            toast.error(error.message || 'An error occurred', {
                onClose: () => {},
            });
        }
    };

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    return (
        <div>
            <div className="container">
                <div className="row">
                    <div className="col-sm">
                        <button type="button" className="btn btn-primary" onClick={handleShow}>
                            {getLocalizedString(currentLang, 'addWord')}
                        </button>
                    </div>
                    <div className="col-sm">
                    <label htmlFor="fileInput" className="btn btn-success">
                        {getLocalizedString(currentLang, 'importEntireObject')}
                        <input
                            type="file"
                            id="fileInput"
                            accept=".json"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                    </label>
                    </div>
                    <div className="col-sm">
                        <button type="button" className="btn btn-warning" onClick={handleExport}>
                            {getLocalizedString(currentLang, 'exportEntireObject')}
                        </button>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title"><PlusSquare size={"1.5em"} /></h5>
                                <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}>
                                    <span aria-hidden="true"></span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form className="text-center">
                                    <div className="form-group row justify-content-center">
                                        <label className="col-sm-2 col-form-label">Est:</label>
                                        <div className="col-sm-8">
                                            <input type="text" className="form-control" value={wordData.est} onChange={(e) => handleChange('est', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="form-group row justify-content-center">
                                        <label className="col-sm-2 col-form-label">Eng:</label>
                                        <div className="col-sm-8">
                                            <input type="text" className="form-control" value={wordData.eng} onChange={(e) => handleChange('eng', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="form-group row justify-content-center">
                                        <label className="col-sm-2 col-form-label">Rus:</label>
                                        <div className="col-sm-8">
                                            <input type="text" className="form-control" value={wordData.rus} onChange={(e) => handleChange('rus', e.target.value)} />
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleClose}>
                                    {getLocalizedString(currentLang, 'closeModal')}
                                </button>
                                <button type="button" className="btn btn-primary" onClick={handleAddWord}>
                                    {getLocalizedString(currentLang, 'saveWord')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showModal && <div className="modal-backdrop fade show"></div>}

            <ToastContainer />
        </div>
    );
}

export default AddWordForm;
