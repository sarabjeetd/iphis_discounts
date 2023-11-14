async function fetchExchangeRates() {
  // const fetch = useFetch();                                                          //fetch is giving me  Wasm binary file error
  const apiKey = 'fca_live_Eo0mEZFSSUzxR07aAFCVRV1eLYqW7iirUG4kSOnS';
  const apiUrl = `https://api.freecurrencyapi.com/v1/latest?apikey=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.data; // Extracting the exchange rates from the API response
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return null;
  }
}



fetchExchangeRates().then(exchangeRates => {
  if (exchangeRates) {
    console.log('Exchange rates new: ' + exchangeRates )
  } else {
    console.log('Failed to fetch exchange rates. Using default calculations.');
  }

});