class CurrencyRate {
    constructor(code, rate, date) {
      this.code = code;
      this.rate = rate;
      this.date = date;
    }
  }
  
  let currencyRatesArray = [];
  
  async function getData() {
    try {
      const response = await fetch(
        "https://raw.githubusercontent.com/SathiC1990/sathic1990/main/data/currency.json"
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const myData = await response.json();
      const currencyRates = myData;
  
      console.log(currencyRates);
  
      currencyRatesArray.push(new CurrencyRate("EUR", 1.0, currencyRates.date));
  
      currencyRatesArray = currencyRatesArray.concat(
        Object.entries(currencyRates.rates).map(
          ([code, rate]) => new CurrencyRate(code, rate, currencyRates.date)
        )
      );
    } catch (error) {
      console.error('Error fetching the currency data:', error);
    }
  }
  