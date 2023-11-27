// Coloque aqui suas actions
import { Dispatch, Expense, ExchangeRates, ReduxState } from '../../types/types';

export const SET_EMAIL = 'SET_EMAIL';
export const SET_PASSWORD = 'SET_PASSWORD';
export const ADD_EXPENSE = 'ADD_EXPENSE';
export const FETCH_DATA_REQUEST = 'FETCH_DATA_REQUEST';
export const FETCH_DATA_SUCCESS = 'FETCH_DATA_SUCCESS';
export const FETCH_DATA_FAILURE = 'FETCH_DATA_FAILURE';
export const SET_SELECTED_CURRENCY = 'SET_SELECTED_CURRENCY';
export const UPDATE_TOTAL_EXPENSE = 'UPDATE_TOTAL_EXPENSE';
export const EXCHANGE_RATES = 'EXCHANGE_RATES';
export const DELETE_EXPENSE = 'DELETE_EXPENSE';
export const EDIT_EXPENSE = 'EDIT_EXPENSE';
export const SET_IS_EDITING = 'SET_IS_EDITING';

export const updateTotalExpense = (totalExpense: any) => ({
  type: UPDATE_TOTAL_EXPENSE,
  payload: totalExpense,
});

export const setEmail = (email: string) => {
  return {
    type: SET_EMAIL,
    payload: email,
  };
};

export const setPassword = (password: string) => {
  return {
    type: SET_PASSWORD,
    payload: password,
  };
};

export const addExpense = (expense: Expense) => ({
  type: ADD_EXPENSE,
  payload: expense,
});

export const setSelectedCurrency = (currency: string) => {
  return {
    type: SET_SELECTED_CURRENCY,
    payload: currency,
  };
};

export const fetchDataRequest = () => {
  return { type: FETCH_DATA_REQUEST };
};

export const fetchDataSuccess = (data: any, currencies: string[]) => {
  return {
    type: FETCH_DATA_SUCCESS,
    payload: { data, currencies },
  };
};

export const fetchDataFailure = (error: any) => {
  return {
    type: FETCH_DATA_FAILURE,
    payload: error,
  };
};

export const setExchangeRates = (exchangeRate: ExchangeRates) => {
  return {
    type: EXCHANGE_RATES,
    payload: {
      exchangeRates: exchangeRate,
    },
  };
};

export const deleteExpense = (id: number) => {
  return {
    type: DELETE_EXPENSE,
    payload: { id },
  };
};
export const editExpense = (editedExpenseData: Expense) => {
  return {
    type: EDIT_EXPENSE,
    payload: editedExpenseData,
  };
};

export const setIsEditing = (isEditing: ReduxState) => {
  return {
    type: SET_IS_EDITING,
    payload: isEditing,
  };
};

// type GetState = () => ReduxState;

export function fetchCoin() {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(fetchDataRequest());
      const response = await fetch('https://economia.awesomeapi.com.br/json/all');
      const data = await response.json();
      const currencies = Object.keys(data).filter((currency) => currency !== 'USDT');

      const exchangeRates: ExchangeRates = {};

      currencies.forEach((currency) => {
        const exchangeRate = data[currency];
        if (exchangeRate) {
          exchangeRates[currency] = {
            code: currency,
            name: exchangeRate.name,
            ask: parseFloat(exchangeRate.ask.replace(',', '.')),
          };
        }
      });

      dispatch(fetchDataSuccess(JSON.stringify(data), currencies));
      dispatch(setExchangeRates(exchangeRates));
    } catch (error: any) {
      dispatch(fetchDataFailure(error));
    }
  };
}
