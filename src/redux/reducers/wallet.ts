import {
  FETCH_DATA_REQUEST,
  FETCH_DATA_SUCCESS,
  FETCH_DATA_FAILURE,
  ADD_EXPENSE,
  DELETE_EXPENSE,
  EXCHANGE_RATES,
  UPDATE_TOTAL_EXPENSE,
  SET_IS_EDITING,
} from '../actions';
import { Expense, ExchangeRate, ExchangeRates } from '../../types/types';

interface WalletState {
  currencies: string[];
  expenses: Expense[];
  editor: boolean;
  idToEdit: number;
  isFetch: boolean;
  totalExpense: number | null;
  exchangeRates: ExchangeRates;
  error: string;
  isEditing?: boolean,
}

const initialState: WalletState = {
  currencies: [],
  expenses: [],
  editor: false,
  idToEdit: 0,
  isFetch: false,
  totalExpense: null,
  exchangeRates: {},
  error: '',
  isEditing: false,
};

type ActionType =
  | {
    type: typeof FETCH_DATA_REQUEST;
    isFetch: boolean;
  }
  | {
    type: typeof FETCH_DATA_SUCCESS;
    payload: {
      currencies: string[];
    };
  }
  | {
    type: typeof FETCH_DATA_FAILURE;
    payload: {
      error: string;
    };
  }
  | {
    type: typeof ADD_EXPENSE;
    payload: Expense;
  }
  | {
    type: typeof EXCHANGE_RATES;
    payload: {
      exchangeRates: {
        [currency: string]: ExchangeRate;
      };
    };
  }
  | {
    type: typeof DELETE_EXPENSE;
    payload: {
      id: number;
    };
  }
  | {
    type: typeof UPDATE_TOTAL_EXPENSE;
    payload: number;
  }
  | {
    type: typeof SET_IS_EDITING;
    isEditing: boolean;
  };

function walletReducer(state = initialState, action: ActionType): WalletState {
  switch (action.type) {
    case FETCH_DATA_REQUEST:
      return {
        ...state,
        isFetch: action.isFetch,
      };
    case FETCH_DATA_SUCCESS:
      return {
        ...state,
        currencies: action.payload.currencies,
        isFetch: false,
      };
    case FETCH_DATA_FAILURE:
      return {
        ...state,
        error: action.payload.error,
        isFetch: false,
      };
    case ADD_EXPENSE: {
      const newExpense = {
        ...action.payload,
        id: state.expenses.length,
      };
      return {
        ...state,
        expenses: [...state.expenses, newExpense],
      };
    }
    case EXCHANGE_RATES:
      return {
        ...state,
        exchangeRates: action.payload.exchangeRates,
      };
    case DELETE_EXPENSE:
      return {
        ...state,
        expenses: state.expenses.filter((expense) => expense.id !== action.payload.id),
      };
    case UPDATE_TOTAL_EXPENSE:
      return {
        ...state,
        totalExpense: action.payload,
      };
    case SET_IS_EDITING:
      return {
        ...state,
        isEditing: action.payload,
      };
    default:
      return state;
  }
}

export const calculateTotalExpenses = (
  expenses: Expense[],
  exchangeRates: { [currency: string]: ExchangeRate },
) => {
  return expenses.reduce((total: number, expense: Expense) => {
    if (exchangeRates && exchangeRates[expense.currency]) {
      const exchangeRate = exchangeRates[expense.currency];
      const expenseValue = typeof
      expense.value === 'string' ? parseFloat(expense.value) : expense.value;
      if (!Number.isNaN(expenseValue) && typeof exchangeRate.ask === 'number') {
        total += expenseValue * exchangeRate.ask;
      }
    }
    return total;
  }, 0);
};

export default walletReducer;
