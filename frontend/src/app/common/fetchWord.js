const fetchWord = async (url, setLoading, setWordData, setError, setCurrentScreen) => {
  setLoading(true);

  const timeout = 10000; // 10 seconds
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Request timeout')), timeout)
  );

  try {
    const response = await Promise.race([
      fetch(url),
      timeoutPromise,
    ]);

    if (!response.ok) {
      throw new Error(`Backend error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Reset loading state
    setLoading(false);

    if (data === null) {
      throw new Error('Word data is null');
    }

    // Set word data and reset error state
    setWordData(data);
    setError(null);
  } catch (error) {
    console.error('Error fetching data:', error);

    // Reset loading state and set error state
    setLoading(false);
    setError(error.message);
    setCurrentScreen('error');
  }
};

export default fetchWord;
