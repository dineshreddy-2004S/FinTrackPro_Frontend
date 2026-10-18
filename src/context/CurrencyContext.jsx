import React, { createContext, useState, useContext } from 'react';

export const CURRENCY_CONFIG = {
  USD: { symbol: '$', rate: 1.0, locale: 'en-US' },
  INR: { symbol: '₹', rate: 86.5, locale: 'en-IN' },
  EUR: { symbol: '€', rate: 0.92, locale: 'de-DE' },
  GBP: { symbol: '£', rate: 0.79, locale: 'en-GB' },
};

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('USD');

  const formatCurrency = (amountInUSD, decimals = 0) => {
    if (amountInUSD === null || amountInUSD === undefined || isNaN(amountInUSD)) {
      return 'NA';
    }
    const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.USD;
    const converted = Number(amountInUSD) * config.rate;
    return `${config.symbol}${converted.toLocaleString(config.locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}`;
  };

  const convertValue = (amountInUSD) => {
    if (amountInUSD === null || amountInUSD === undefined || isNaN(amountInUSD)) return 0;
    const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.USD;
    return Number(amountInUSD) * config.rate;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatCurrency,
        convertValue,
        activeSymbol: CURRENCY_CONFIG[currency]?.symbol || '$',
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);