let currencyRates = {
    timestamp: 1519296206,
    base: "EUR",
    date: "2021-03-17",
    rates: {
        USD: 1.23396
    }
};

class CurrencyRate {
    constructor(code, rate, date) {
        this.code = code;
        this.rate = rate;
        this.date = date;
    }
}

const currencyRatesArray = Object.entries(currencyRates.rates).map(([code, rate, date]) => new CurrencyRate(code, rate, currencyRates.date));

function insertCurrencyRate() {
    const base = document.getElementById('base').value.toUpperCase();
    const targetCurrency = document.getElementById('targetCurrency').value.trim().toUpperCase();
    const rate = parseFloat(document.getElementById('rate').value);
    
    if (!currencyRates) {
        currencyRates = {
            timestamp: Date.now(),
            base: base,
            date: new Date().toISOString().split('T')[0],
            rates: {}
        };
    }

    if(targetCurrency === '' || rate === ''){
        alert('Currency or Rate cannot be blank');
        return;
    }

    if (currencyRates.base !== base) {
        alert('Base currency mismatch! Current base is ' + currencyRates.base);
        return;
    }

    if(currencyRatesArray.length > 0 && currencyRatesArray.findIndex(obj => obj.code == targetCurrency) !== -1){
        alert('Curreny already exists in the list');
        return;
    }


    currencyRates.timestamp = Date.now();
    currencyRates.date = new Date().toISOString().split('T')[0];
    currencyRates.rates[targetCurrency] = rate;
    document.getElementById('newRateOutput').textContent = JSON.stringify(currencyRates, null, 2);
  // const select = document.getElementById('targetCurrency').textContent;
  // const selectCurrencyText = select.options[select.selectedIndex].text;
   //console.log(currencyRatesArray.findIndex(obj => obj.code == select));
    currencyRatesArray.push(new CurrencyRate(targetCurrency, rate, currencyRates.date));
    populateCurrencyDropdown();
}

function populateCurrencyDropdown() {
    const selectedFromCurrencyLabel = document.getElementById('selected-from-currency-label');
    const selectedToCurrencyLabel = document.getElementById('selected-to-currency-label');
    const selectedCurrencyLabel = document.getElementById('selected-currency-label');
    const fromCurrency = document.getElementById('fromCurrency');
    const selectCurrency = document.getElementById('selectCurrency');
    const toCurrency = document.getElementById('toCurrency');
    const rates =  currencyRates.rates;
    
   /* while (fromCurrency.options.length > 1) {
        fromCurrency.remove(1);
        toCurrency.remove(1);
        selectCurrency.remove(1);
    }*/

    selectedFromCurrencyLabel.innerHTML = '';
    selectedToCurrencyLabel.innerHTML = '';

  /*  for (const [key, value] of Object.entries(rates)) {
        const fromCurrencyOption = document.createElement('option');
        fromCurrencyOption.value = value;
        fromCurrencyOption.text = `${key}`;
        fromCurrency.appendChild(fromCurrencyOption);

        const toCurrencyOption = document.createElement('option');
        toCurrencyOption.value = value;
        toCurrencyOption.text = `${key}`;
        toCurrency.appendChild(toCurrencyOption);

        const selectCurrencyOption = document.createElement('option');
        selectCurrencyOption.value = value;
        selectCurrencyOption.text = `${key}`;
        selectCurrency.appendChild(selectCurrencyOption);
    }

*/

    fromCurrency.addEventListener('change', function() {
        selectedFromCurrencyLabel.textContent = fromCurrency.value;
    });

    toCurrency.addEventListener('change', function() {
        selectedToCurrencyLabel.textContent = convertRate(findCurrencyRate(fromCurrency.value), findCurrencyRate(toCurrency.value)) + fromCurrency.value;
    });

    selectCurrency.addEventListener('change', function() {
        selectedCurrencyLabel.textContent = findCurrencyRate(selectCurrency.value);
    });
    console.log(currencyRatesArray);
    populateTable();
    populateDatalist();
}

function findCurrencyRate(currencyCode){
    let selectedArrIndex = currencyRatesArray.findIndex(obj => obj.code == currencyCode);
    return currencyRatesArray[selectedArrIndex].rate;
}

function convertRate(from, to){
    let rate = (to/from).toFixed(3);

    return rate;
}

function convertCurrency(){
    const amountInput = document.getElementById('amount').value;
    const fromRate = fromCurrency.value;
    const toRate = toCurrency.value;
    const convertedAmountLabel = document.getElementById('converted-amount-label');

    if(toRate === fromRate){
        alert("From and To currency cannot be same");
        return;
    }
    
    if (amountInput === null || amountInput.trim() === "") {
        alert("Amount cannot be blank");
        return;
    }

    let convertedAmount = convertRate(findCurrencyRate(fromRate), findCurrencyRate(toRate)) * amountInput;
    convertedAmountLabel.textContent = "Converted amount would be "+convertedAmount.toFixed(3)+toRate;

}


function updateRate() {
    const select = document.getElementById('selectCurrency');
    const rateUpdatedLabel = document.getElementById('rate-updated-label');
    const newRate = parseFloat(document.getElementById('newRate').value);
    const selectedCurrency = select.value;
    const selectCurrencyText = selectedCurrency;

    if (selectedCurrency && !isNaN(newRate)) {
        currencyRates.rates[selectCurrencyText] = newRate;
/*
        const selectedOption = select.options[select.selectedIndex];
        selectedOption.text = selectedOption.text;
        selectedOption.value = newRate;*/

        document.getElementById('newRateOutput').textContent = JSON.stringify(currencyRates, null, 2);
        rateUpdatedLabel.textContent = selectCurrencyText +" currency rate has been update to "+newRate;
        let selectedArrIndex = currencyRatesArray.findIndex(obj => obj.code == selectCurrencyText);
        currencyRatesArray[selectedArrIndex].rate = newRate;
        currencyRatesArray[selectedArrIndex].date = new Date().toISOString().split('T')[0];

        populateCurrencyDropdown();
    } else {
        alert('Please select a currency and enter a valid rate.');
    }
}

function populateTable() {
    const tableBody = document.getElementById('currencyTable').getElementsByTagName('tbody')[0];


    tableBody.innerHTML = '';

    currencyRatesArray.forEach(currencyRate => {
        const row = document.createElement('tr');

        const cellCode = document.createElement('td');
        cellCode.textContent = currencyRate.code;
        row.appendChild(cellCode);

        const cellRate = document.createElement('td');
        cellRate.textContent = currencyRate.rate.toFixed(3);
        row.appendChild(cellRate);

        const cellDate = document.createElement('td');
        cellDate.textContent = currencyRate.date;
        row.appendChild(cellDate);

        tableBody.appendChild(row);
    });
}

function populateDatalist() {
    const datalist = document.getElementById('currencySuggestions');

    datalist.innerHTML = '';

    currencyRatesArray.forEach(currencyRate => {
        const option = document.createElement('option');
        option.value = currencyRate.code;
        datalist.appendChild(option);
    });
}

function filterSuggestions() {
   // const searchInput = document.getElementById('currencySearch').value.toUpperCase();
    //const select = document.getElementById('currency');

    // Remove all options except the first one
   

    // Filter and add matching options to the dropdown
    
}