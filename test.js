const doSomethingAsync = () => {
    return new Promise(resolve => {
      console.log("settimeout öncesi içinde");
      setTimeout(() => resolve('I did something'), 3000)
      console.log("settimeout sonrası içinde");

    })
  }
  
  const doSomething = async () => {
    console.log("await öncesi içinde");

    console.log(await doSomethingAsync())
    console.log("await sonrası içinde");
    console.log("await2 sonrası içinde");


  }
console.log('Before')
doSomething()
console.log('After')


// async fonksiyon return değer olarak daima promise döndürür
// alttaki fonskiyonların ikisi de promise resolve değeri olarak "test" döndürür

  const aFunction = async () => {
    return 'test';
  };
  
  aFunction().then(alert); // This will alert 'test'

  const bFunction = () => {
    return Promise.resolve('test');
  };
  
  bFunction().then(alert); // This will alert 'test'

//As you can see in the example above, our code looks very simple. Compare it to //code using plain promises, with chaining and callback functions
  