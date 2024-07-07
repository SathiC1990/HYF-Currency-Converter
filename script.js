document.addEventListener('DOMContentLoaded', function() {
	
	const datetimeLabel = document.getElementById('datetime-label');
	
    const apiUrl = 'https://continentl.com/api/currency-list?key=sk-IeOV6687e666e4751302';
    const fromDropdown = document.getElementById('from-currency-dropdown');
    const toDropdown = document.getElementById('to-currency-dropdown');
	const selectedFromCurrencyLabel = document.getElementById('selected-from-currency-label');

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            data.forEach(currency => {
                const option1 = document.createElement('option');
                option1.value = currency.currency_code;
                option1.text = currency.name;
                fromDropdown.appendChild(option1);

                const option2 = document.createElement('option');
                option2.value = currency.currency_code; 
                option2.text = currency.name; 
                toDropdown.appendChild(option2);
            });
        })
        .catch(error => console.error('Error fetching the currency list:', error));
		
		
		
	const now = new Date();

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const formattedDateTime = now.toLocaleDateString('en-US', options);

    datetimeLabel.textContent = formattedDateTime;
	
	
	
	fromDropdown.addEventListener('change', function() {
        selectedFromCurrencyLabel.textContent = this.value;
    });
});


function resetForm() {
    document.getElementById('currency_form').reset();
}