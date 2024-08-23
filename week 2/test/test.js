// Test runner
async function runTests() {
    const testResults = document.getElementById('test-results');
    
    // Helper to add test results to the DOM
    function addResult(passed, description) {
      const result = document.createElement('div');
      result.style.color = passed ? 'green' : 'red';
      result.textContent = passed ? `✓ ${description}` : `✗ ${description}`;
      testResults.appendChild(result);
    }
  
    // Clear previous results
    currencyRatesArray.length = 0;
  
    // Test 1: Fetches and processes currency data correctly
    await getData();
  
    try {
      const test1Passed = currencyRatesArray.length > 0 &&
        currencyRatesArray[0].code === "EUR" &&
        currencyRatesArray[0].rate === 1.0;
  
      addResult(test1Passed, 'Fetches and processes currency data correctly');
    } catch (error) {
      addResult(false, 'Fetches and processes currency data correctly');
    }
  
    // Test 2: Handles fetch error
    const consoleErrorMock = createMockFunction();
    console.error = consoleErrorMock;
  
    // Manipulate the fetch function to return an error for the next test
    const originalFetch = window.fetch;
    window.fetch = () => Promise.reject(new Error('Network error'));
  
    await getData();
  
    try {
      const test2Passed = consoleErrorMock.mock.calls.length > 0 &&
        consoleErrorMock.mock.calls[0][0] === 'Error fetching the currency data:' &&
        consoleErrorMock.mock.calls[0][1].message.includes('Network error');
      
      addResult(test2Passed, 'Handles fetch error');
    } catch (error) {
      addResult(false, 'Handles fetch error');
    }
  
    // Restore original fetch function
    window.fetch = originalFetch;
  
    // Test 3: Handles JSON parsing error
    window.fetch = () =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: async () => { throw new Error('JSON parsing error'); }
      });
  
    console.error = consoleErrorMock;
    consoleErrorMock.mock.clear();
  
    await getData();
  
    try {
      const test3Passed = consoleErrorMock.mock.calls.length > 0 &&
        consoleErrorMock.mock.calls[0][0] === 'Error fetching the currency data:' &&
        consoleErrorMock.mock.calls[0][1].message.includes('JSON parsing error');
  
      addResult(test3Passed, 'Handles JSON parsing error');
    } catch (error) {
      addResult(false, 'Handles JSON parsing error');
    }
  
    // Restore original fetch function again
    window.fetch = originalFetch;
  }
  
  runTests();
  