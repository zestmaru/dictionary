import React, { useState, useEffect } from 'react';

import { getLocalizedString } from '../language/LanguageConfig.js';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { PlusSquare } from 'react-bootstrap-icons';

function AddWordForm({ currentLang, languageSwitch, updateMainScreen }) {

    const [currentScreen] = useState('main');
    const [wordData, setWordData] = useState({ est: '', eng: '', rus: '' });
    const [showModal, setShowModal] = useState(false);

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

            const response = await fetch('http://127.0.0.1:5000/add_word', {
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
            console.error('Error during fetch:', error);
            toast.error('An error occurred', {
                onClose: () => { },
            });
        }
    };

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    return (
        <div>
            <button type="button" className="btn btn-primary" onClick={handleShow}>
                <PlusSquare size={"1.5em"} />
            </button>

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
