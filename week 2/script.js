let currencyRates= "";
let watcherTargetRate = null;
let watcherFromCurrency = null;
let watcherToCurrency = null;

class CurrencyRate {
    constructor(code, rate, date) {
        this.code = code;
        this.rate = rate;
        this.date = date;
    }
}


async function getData() {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/SathiC1990/sathic1990/main/data/currency.json"
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const myData = await response.json();
    currencyRates = myData;

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
    populateCurrencyDropdown();
}
  

document.addEventListener('DOMContentLoaded', function() {
    getData();
    startTimer();
    let coll = document.querySelectorAll(".collapsible");
    coll.forEach(function(collapsible) {
        collapsible.addEventListener("click", function() {
            this.classList.toggle("active");
            let content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    });

    document.getElementById('insertRateButton').addEventListener('click', function() {
        insertCurrencyRate();
    });

    document.getElementById('convertCurrencyButton').addEventListener('click', function(event) {
        convertCurrency();
    });

    document.getElementById('updateCurrencyButton').addEventListener('click', function(event) {
        updateRate();
    });

    document.getElementById('setAlertButton').addEventListener('click', function(event) {
        setAlert();
    });

    init();
});

function setAlert(){
    event.preventDefault();
    targetRate = parseFloat(document.getElementById('desiredRate').value);
    watcherFromCurrency = document.querySelector('#popupFromCurrency').value;
    watcherToCurrency = document.querySelector('#popupToCurrency').value;
    alert(`You will be notified when the ${watcherFromCurrency} to ${watcherToCurrency} rate reaches ${targetRate} ${watcherToCurrency}.`);
    popup.style.display = 'none';
}

function checkRates() {
    if (targetRate === null) return;

    const currentRate = findCurrencyRate(watcherToCurrency);
    console.log(`Current rate: 1 ${watcherFromCurrency} = ${currentRate.toFixed(2)} ${watcherToCurrency}`);
    document.getElementById('status').innerText = `Current ${watcherFromCurrency} to ${watcherToCurrency} rate: ${currentRate.toFixed(2)} ${watcherToCurrency}`;
    document.getElementById('alertRate').innerText = `1 ${watcherFromCurrency} = ${currentRate.toFixed(2)} ${watcherToCurrency}`;

    if (currentRate >= targetRate) {
        document.getElementById('banner').style.display = 'block';
        sendBrowserNotification(currentRate.toFixed(2));
    } else {
        document.getElementById('banner').style.display = 'none';
    }
}

// Function to send a browser notification
function sendBrowserNotification(rate) {
    if (Notification.permission === 'granted') {
        new Notification('Rate Alert', {
            body: `The ${watcherFromCurrency} to ${watcherToCurrency} rate has reached ${rate}! Consider converting now.`,
        });
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification('Rate Alert', {
                    body: `The ${watcherFromCurrency} to ${watcherToCurrency} rate has reached ${rate}! Consider converting now.`,
                });
            }
        });
    }
}


let currencyRatesArray = [];


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

    currencyRatesArray.push(new CurrencyRate(targetCurrency, rate, currencyRates.date));
    populateCurrencyDropdown();
}

function populateCurrencyDropdown() {
    const selectedFromCurrencyLabel = document.querySelector('#selected-from-currency-label');
    const popupFromCurrencyLabel = document.querySelector('#popup-from-currency-label');
    const selectedToCurrencyLabel = document.querySelector('#selected-to-currency-label');
    const popupToCurrencyLabel = document.querySelector('#popup-to-currency-label');
    const selectedCurrencyLabel = document.querySelector('#selected-currency-label');
    const fromCurrency = document.querySelector('#fromCurrency');
    const popupFromCurrency = document.querySelector('#popupFromCurrency');
    const selectCurrency = document.querySelector('#selectCurrency');
    const toCurrency = document.querySelector('#toCurrency');
    const popupToCurrency = document.querySelector('#popupToCurrency');
    const rates = currencyRates.rates;

    selectedFromCurrencyLabel.innerHTML = '';
    selectedToCurrencyLabel.innerHTML = '';
    popupFromCurrencyLabel.innerHTML = '';
    popupToCurrencyLabel.innerHTML = '';

    fromCurrency.addEventListener('change', function() {
        selectedFromCurrencyLabel.textContent = fromCurrency.value;
    });

    popupFromCurrency.addEventListener('change', function() {
        popupFromCurrencyLabel.textContent = popupFromCurrency.value;
    });

    toCurrency.addEventListener('change', function() {
        selectedToCurrencyLabel.textContent = convertRate(findCurrencyRate(fromCurrency.value), findCurrencyRate(toCurrency.value)) + toCurrency.value;
    });

    popupToCurrency.addEventListener('change', function() {
        popupToCurrencyLabel.textContent = convertRate(findCurrencyRate(popupFromCurrency.value), findCurrencyRate(popupToCurrency.value)) + popupToCurrency.value;
        
    });

    selectCurrency.addEventListener('change', function() {
        selectedCurrencyLabel.textContent = findCurrencyRate(selectCurrency.value);
    });

    populateTable();
    populateDatalist();
}

function sendBrowserNotification(rate) {
    if (Notification.permission === 'granted') {
        new Notification('Rate Alert', {
            body: `The ${fromCurrency} to ${toCurrency} rate has reached ${rate}! Consider converting now.`,
        });
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification('Rate Alert', {
                    body: `The ${fromCurrency} to ${toCurrency} rate has reached ${rate}! Consider converting now.`,
                });
            }
        });
    }
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
    const fromRate = document.querySelector('#fromCurrency').value;
    const toRate = document.querySelector('#toCurrency').value;
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

//---------------------
var popup = document.getElementById('popup');

var btn = document.getElementById('openPopupBtn');

var span = document.getElementsByClassName('close')[0];

btn.onclick = function() {
    popup.style.display = 'block';
}

span.onclick = function() {
    popup.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == popup) {
        popup.style.display = 'none';
    }
}

var form = document.getElementById('popupForm');
form.onsubmit = function(event) {
    event.preventDefault();
    alert('Form submitted! Name: ' + form.name.value + ', Email: ' + form.email.value);
    popup.style.display = 'none';
}

function init() {
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
    }
    setInterval(checkRates, 30000); 
}

