// Language strings

const languages = {
  eng: {
    lang: 'English',
    check: 'Check',
    restart: 'Restart',
    correct: 'Correct! The word was:',
    incorrect: 'Incorrect! The word was: {rightWord}, but you entered: {userInput}',
    incorrectSelected: 'Incorrect! The word was: {rightWord}, but you choosed: {userSelected}',
    placeholder: 'Type translate...',
    httpError: 'HTTP error!',
    emptyUserInput: 'Input cannot be empty!',
    indexSelectGame: 'Choose game mode',
    typeGame: 'Word Type',
    selectGame: '3 words',
    editWords: 'Edit Word List',
    indexPage: 'Index Page',
    noWordsFound: 'No words found',
    paginationFirst: 'First',
    paginationLast: 'Last',
    wordAdded: 'Word was added to the database!',
    addWord: 'Add word',
    closeModal: 'Close',
    saveWord: 'Save',
    tableActions: 'Actions',
    delete: 'Delete',
    total: 'Total',
    wordRemoved: 'Word was removed from the database!',
  },
  rus: {
    lang: 'Русский',
    check: 'Проверить',
    restart: 'Рестарт',
    correct: 'Правильно! Слово было:',
    incorrect: 'Неправильно! Слово было: {rightWord}, но Вы ввели: {userInput}',
    incorrectSelected: 'Неправильно! Слово было: {rightWord}, но Вы выбрали: {userSelected}',
    placeholder: 'Напишите перевод...',
    httpError: 'Ошибка HTTP!',
    emptyUserInput: 'Поле ввода не может быть пустым!',
    indexSelectGame: 'Выберите режим игры',
    typeGame: 'Ввод слова',
    selectGame: '3 слова',
    editWords: 'Редактировать список слов',
    indexPage: 'Главная Страница',
    noWordsFound: 'Слов не найдено',
    paginationFirst: 'Начало',
    paginationLast: 'Конец',
    wordAdded: 'Слово было добавлено в базу данных!',
    addWord: 'Add word',
    closeModal: 'Закрыть',
    saveWord: 'Сохранить',
    tableActions: 'Действия',
    delete: 'Удалить',
    total: 'Всего',
    wordRemoved: 'Слово было удалено из базы данных!',
  },
};

const getLocalizedString = (lang, key) => {
  const language = languages[lang];
  if (language && language[key] !== undefined) {
    return language[key];
  } else {
    // Log a warning to the console
    console.warn(`Translation key "${key}" not found for language "${lang}"`);

    return `Translation not available for key: ${key}`;
  }
};

export default languages;
export { getLocalizedString };
