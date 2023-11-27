import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

export type ExchangeRates = {
  [currency: string]: ExchangeRate;
};

export type ExchangeRate = {
  code: string;
  name: string;
  ask: number | undefined;
};

export type Expense = {
  id?: number;
  value: string;
  currency?: string;
  method: string;
  tag: string;
  description: string;
  exchangeRates: {
    [currency: string]: ExchangeRate;
  };
  convertedValue?: number;
};

export type ReduxState = {
  user: {
    email: string;
  };
  wallet: {
    currencies: string[];
    expenses: Expense[];
    editor: boolean;
    idToEdit: number;
    totalExpense: number | null;
    exchangeRates: {
      [currency: string]: ExchangeRate;
    };
    editedExpense?: Expense;
    isEditing?: boolean;
  };
};

export type Dispatch = ThunkDispatch<ReduxState, null, AnyAction>;
