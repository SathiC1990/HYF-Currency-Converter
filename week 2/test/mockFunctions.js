class MockFunction {
    constructor() {
      this.calls = [];
    }
  
    call(...args) {
      this.calls.push(args);
    }
  
    clear() {
      this.calls.length = 0;
    }
  }
  
  function createMockFunction() {
    const mock = new MockFunction();
    const fn = (...args) => {
      mock.call(...args);
    };
    fn.mock = mock;
    return fn;
  }
  