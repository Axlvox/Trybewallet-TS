import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateTotalExpense } from '../redux/actions';
import { calculateTotalExpenses } from '../redux/reducers/wallet';
import { ReduxState } from '../types/types';

function Header() {
  const email = useSelector((state: ReduxState) => state.user.email);
  const expenses = useSelector((state: ReduxState) => state.wallet.expenses);
  const exchangeRates = useSelector((state: ReduxState) => state.wallet.exchangeRates);
  const totalExpense = useSelector((state: ReduxState) => state.wallet.totalExpense);

  const dispatch = useDispatch();

  const updateTotalExpenseHandler = () => {
    const newTotalExpense = calculateTotalExpenses(expenses, exchangeRates);
    dispatch(updateTotalExpense(newTotalExpense));
  };

  useEffect(() => {
    updateTotalExpenseHandler();
  }, [expenses, exchangeRates, updateTotalExpenseHandler]);

  return (
    <div>
      <h2 data-testid="email-field">{email}</h2>
      <h2 data-testid="total-field">
        {totalExpense !== null ? totalExpense.toFixed(2) : '0.00'}
      </h2>
      <h2 data-testid="header-currency-field">BRL</h2>
    </div>
  );
}

export default Header;
