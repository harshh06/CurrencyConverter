import "./App.css";
import Currency from "./components/Currency";
import { useEffect, useState } from "react";

// Exchange Rate API to get the up to date conversion rates ...

const API_KEY = "2ba9b375187a7da8e7dc13b0";
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/INR`; // to get all conversion rates according to base currency
const PAIR_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/`; // to get single conversion rate based on fromCurrency and toCurrency ..

function App() {
  //useState Hooks..

  const [currencyOptions, setCurrencyOptions] = useState([]); // pass an array to setState
  // this array contains all the currency options
  //console.log(currencyOptions);
  const [fromCurrency, setFromCurrency] = useState(); // state to set currency to be converted
  const [toCurrency, setToCurrency] = useState(); // state to set converted currency
  const [amount, setAmount] = useState(1); // initial amount set to 1
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true); // bool to find which amount is to be converted
  const [conversionRate, setConversionRate] = useState(); // to set conversion rate

  // useState Hooks End ..

  //condition to set toAmount and fromAmount ...

  let toAmount, fromAmount;
  if (amountInFromCurrency) {
    // if amount to be converted is in fromAmount
    fromAmount = amount;
    toAmount = amount * conversionRate;
  } else {
    toAmount = amount;
    fromAmount = amount / conversionRate;
  }
  // to get the conversion rates in currencyOptions Array and set initial to and from currencies and rates ..
  useEffect(() => {
    fetch(BASE_URL)
      .then((res) => res.json())
      .then((data) => {
        //console.log(data);
        const firstCurrency = Object.keys(data.conversion_rates)[0];
        setCurrencyOptions([...Object.keys(data.conversion_rates)]);
        setFromCurrency(data.base_code);
        setToCurrency(firstCurrency);
        setConversionRate(data.conversion_rates[firstCurrency]);
      });
  }, []); // only renders once as empty array never changes ..

  // to set conversion rate based on pair currencies whenever a particular currency changes ..
  useEffect(() => {
    if (fromCurrency != null && toCurrency != null) {
      fetch(`${PAIR_URL}/${fromCurrency}/${toCurrency}`)
        .then((res) => res.json())
        .then((data) => {
          //console.log(data);
          setConversionRate(data.conversion_rate);
        });
    }
  }, [fromCurrency, toCurrency]); // renders whenever any of these values change ..

  // functions to fill the input field ..
  function handleFromAmountChange(e) {
    setAmount(parseFloat(e.target.value));
    setAmountInFromCurrency(true);
  }

  function handleToAmountChange(e) {
    setAmount(parseFloat(e.target.value));
    setAmountInFromCurrency(false);
  }

  return (
    <div>
      <h1 className="header">Currency Converter</h1>
      <div className="card">
        <h3>
          {fromAmount} {fromCurrency} equals
        </h3>
        <h1>
          {toAmount} {toCurrency}
        </h1>
        <Currency
          currencyOptions={currencyOptions}
          selectedCurrency={fromCurrency}
          onChangeCurrency={(e) => setFromCurrency(e.target.value)}
          amount={parseFloat(fromAmount)}
          onChangeAmount={handleFromAmountChange}
        />
        <Currency
          currencyOptions={currencyOptions}
          selectedCurrency={toCurrency}
          onChangeCurrency={(e) => setToCurrency(e.target.value)}
          amount={parseFloat(toAmount)}
          onChangeAmount={handleToAmountChange}
        />
      </div>
    </div>
  );
}

export default App;
