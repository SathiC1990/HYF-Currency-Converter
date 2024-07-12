let currencyRates = {
    timestamp: 1519296206,
    base: "EUR",
    date: "2021-03-17",
    rates: {
        USD: 1.23396
    }
};

function insertCurrencyRate() {
    const base = document.getElementById('base').value.trim().toUpperCase();
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

    if (currencyRates.base !== base) {
        alert('Base currency mismatch! Current base is ' + currencyRates.base);
        return;
    }


    currencyRates.timestamp = Date.now();
    currencyRates.date = new Date().toISOString().split('T')[0];
    currencyRates.rates[targetCurrency] = rate;
    document.getElementById('newRateOutput').textContent = JSON.stringify(currencyRates, null, 2);
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
    
    while (fromCurrency.options.length > 1) {
        fromCurrency.remove(1);
        toCurrency.remove(1);
        selectCurrency.remove(1);
    }

    selectedFromCurrencyLabel.innerHTML = '';
    selectedToCurrencyLabel.innerHTML = '';

    for (const [key, value] of Object.entries(rates)) {
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



    fromCurrency.addEventListener('change', function() {
        selectedFromCurrencyLabel.textContent = this.options[this.selectedIndex].text;
    });

    toCurrency.addEventListener('change', function() {
        selectedToCurrencyLabel.textContent = convertRate(fromCurrency.options[fromCurrency.selectedIndex].value, this.value) + this.options[this.selectedIndex].text;
    });

    selectCurrency.addEventListener('change', function() {
        selectedCurrencyLabel.textContent = this.value;
    });

}

function convertRate(from, to){
    let rate = (to/from).toFixed(3);

    return rate;
}

function convertCurrency(){
    const amountInput = document.getElementById('amount').value;
    const fromRate = fromCurrency.options[fromCurrency.selectedIndex];
    const toRate = toCurrency.options[toCurrency.selectedIndex];
    const convertedAmountLabel = document.getElementById('converted-amount-label');

    if(toRate.text === fromRate.text){
        alert("From and To currency cannot be same");
        return;
    }
    
    if (isNaN(input)|| amountInput === null || amountInput.trim() === "") {
        alert("Amount cannot be blank");
        return;
    }

    let convertedAmount = convertRate(fromRate.value, toRate.value) * amountInput;
    convertedAmountLabel.textContent = "Converted amount would be "+convertedAmount+toRate.text;

}


function updateRate() {
    const select = document.getElementById('selectCurrency');
    const rateUpdatedLabel = document.getElementById('rate-updated-label');
    const newRate = parseFloat(document.getElementById('newRate').value);
    const selectedCurrency = select.value;
    const selectCurrencyText = select.options[select.selectedIndex].text;

    if (selectedCurrency && !isNaN(newRate)) {
        currencyRates.rates[selectCurrencyText] = newRate;

        const selectedOption = select.options[select.selectedIndex];
        selectedOption.text = selectedOption.text;
        selectedOption.value = newRate;

        document.getElementById('newRateOutput').textContent = JSON.stringify(currencyRates, null, 2);
        rateUpdatedLabel.textContent = selectCurrencyText +" currency rate has been update to "+newRate;

        populateCurrencyDropdown();
    } else {
        alert('Please select a currency and enter a valid rate.');
    }
}
