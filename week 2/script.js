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

document.addEventListener('DOMContentLoaded', function() {
    var coll = document.querySelectorAll(".collapsible");
    coll.forEach(function(collapsible) {
        collapsible.addEventListener("click", function() {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    });

    document.querySelector('#insertCurrencyForm').addEventListener('submit', function(event) {
        event.preventDefault();
        insertCurrencyRate();
    });

    document.querySelector('#convertCurrencyForm').addEventListener('submit', function(event) {
        event.preventDefault();
        convertCurrency();
    });

    document.querySelector('#updateCurrencyForm').addEventListener('submit', function(event) {
        event.preventDefault();
        updateRate();
    });

    populateCurrencyDropdown();
});


let currencyRatesArray = [];
currencyRatesArray.push(new CurrencyRate("EUR", 1.0, currencyRates.date));

currencyRatesArray = currencyRatesArray.concat(
    Object.entries(currencyRates.rates).map(
        ([code, rate]) => new CurrencyRate(code, rate, currencyRates.date)
    )
);

function insertCurrencyRate() {
    const base = document.querySelector('#base').value.toUpperCase();
    const targetCurrency = document.querySelector('#targetCurrency').value.trim().toUpperCase();
    const rate = parseFloat(document.querySelector('#rate').value);

    if (!currencyRates) {
        currencyRates = {
            timestamp: Date.now(),
            base: base,
            date: new Date().toISOString().split('T')[0],
            rates: {}
        };
    }

    if (targetCurrency === '' || rate === '') {
        alert('Currency or Rate cannot be blank');
        return;
    }

    if (currencyRates.base !== base) {
        alert('Base currency mismatch! Current base is ' + currencyRates.base);
        return;
    }

    if (currencyRatesArray.length > 0 && currencyRatesArray.findIndex(obj => obj.code == targetCurrency) !== -1) {
        alert('Currency already exists in the list');
        return;
    }

    currencyRates.timestamp = Date.now();
    currencyRates.date = new Date().toISOString().split('T')[0];
    currencyRates.rates[targetCurrency] = rate;
    document.querySelector('#newRateOutput').textContent = JSON.stringify(currencyRates, null, 2);

    currencyRatesArray.push(new CurrencyRate(targetCurrency, rate, currencyRates.date));
    populateCurrencyDropdown();
}

function populateCurrencyDropdown() {
    startTimer();
    const selectedFromCurrencyLabel = document.querySelector('#selected-from-currency-label');
    const selectedToCurrencyLabel = document.querySelector('#selected-to-currency-label');
    const selectedCurrencyLabel = document.querySelector('#selected-currency-label');
    const fromCurrency = document.querySelector('#fromCurrency');
    const selectCurrency = document.querySelector('#selectCurrency');
    const toCurrency = document.querySelector('#toCurrency');
    const rates = currencyRates.rates;

    selectedFromCurrencyLabel.innerHTML = '';
    selectedToCurrencyLabel.innerHTML = '';

    fromCurrency.addEventListener('change', function() {
        selectedFromCurrencyLabel.textContent = fromCurrency.value;
    });

    toCurrency.addEventListener('change', function() {
        selectedToCurrencyLabel.textContent = convertRate(findCurrencyRate(fromCurrency.value), findCurrencyRate(toCurrency.value)) + fromCurrency.value;
    });

    selectCurrency.addEventListener('change', function() {
        selectedCurrencyLabel.textContent = findCurrencyRate(selectCurrency.value);
    });

    populateTable();
    populateDatalist();
}

function findCurrencyRate(currencyCode) {
    let selectedArrIndex = currencyRatesArray.findIndex(obj => obj.code == currencyCode);
    return currencyRatesArray[selectedArrIndex].rate;
}

function convertRate(from, to) {
    let rate = (to/from).toFixed(3);
    return rate;
}

function convertCurrency() {
    const amountInput = document.querySelector('#amount').value;
    const fromRate = fromCurrency.value;
    const toRate = toCurrency.value;
    const convertedAmountLabel = document.querySelector('#converted-amount-label');

    if (toRate === fromRate) {
        alert("From and To currency cannot be the same");
        return;
    }

    if (amountInput === null || amountInput.trim() === "") {
        alert("Amount cannot be blank");
        return;
    }

    let convertedAmount = convertRate(findCurrencyRate(fromRate), findCurrencyRate(toRate)) * amountInput;
    convertedAmountLabel.textContent = "Converted amount would be " + convertedAmount.toFixed(3) + toRate;
}

function updateRate() {
    const select = document.querySelector('#selectCurrency');
    const rateUpdatedLabel = document.querySelector('#rate-updated-label');
    const newRate = parseFloat(document.querySelector('#newRate').value);
    const selectedCurrency = select.value;

    if (selectedCurrency && !isNaN(newRate)) {
        currencyRates.rates[selectedCurrency] = newRate;

        document.querySelector('#newRateOutput').textContent = JSON.stringify(currencyRates, null, 2);
        rateUpdatedLabel.textContent = selectedCurrency + " currency rate has been updated to " + newRate;
        let selectedArrIndex = currencyRatesArray.findIndex(obj => obj.code == selectedCurrency);
        currencyRatesArray[selectedArrIndex].rate = newRate;
        currencyRatesArray[selectedArrIndex].date = new Date().toISOString().split('T')[0];

        populateCurrencyDropdown();
    } else {
        alert('Please select a currency and enter a valid rate.');
    }
}

function populateTable() {
    const tableBody = document.querySelector('#currencyTable tbody');

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
    const datalist = document.querySelector('#currencySuggestions');

    datalist.innerHTML = '';

    currencyRatesArray.forEach(currencyRate => {
        const option = document.createElement('option');
        option.value = currencyRate.code;
        datalist.appendChild(option);
    });
}

function updateTimer() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    const currentHour = now.getHours();
    const timerElement = document.querySelector('#timer');

    if (currentHour >= 9 && currentHour < 17) {
        timerElement.innerText = `${timeString} - Market is open`;
        timerElement.className = 'timer-container open';
    } else {
        timerElement.innerText = `${timeString} - Market is closed`;
        timerElement.className = 'timer-container closed';
    }
}

function startTimer() {
    updateTimer(); 
    setInterval(updateTimer, 1000);
}