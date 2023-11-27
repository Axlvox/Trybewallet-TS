import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCoin, addExpense, editExpense, setIsEditing } from '../redux/actions';
import { ReduxState, Dispatch, Expense, ExchangeRates } from '../types/types';

const INITIAL_EXPENSE = {
  value: '',
  currency: 'USD',
  method: 'Dinheiro',
  tag: 'Alimentação',
  description: '',
  totalExpense: 0,
};

function WalletForm() {
  const [selectedTag, setSelectedTag] = useState('Alimentação');
  const [selectedMethod, setSelectedMethod] = useState('Dinheiro');
  const [expenseData, setExpenseData] = useState(INITIAL_EXPENSE);
  const isEditing = useSelector((state: ReduxState) => state.wallet.isEditing);
  const dataState = useSelector((state: ReduxState) => state);
  const currencies = dataState.wallet.currencies || [];
  const dispatch: Dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCoin() as any);
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setExpenseData((prevExpenseData) => ({ ...prevExpenseData, [name]: value }));
  };

  const clearExpenseData = () => {
    setExpenseData(INITIAL_EXPENSE);
    setIsEditing(false);
  };

  const handleButtonClick = () => handleAddExpense();

  const handleAddExpense = async () => {
    try {
      const response = await fetch('https://economia.awesomeapi.com.br/json/all');
      const data = await response.json();
      const exchangeRates: ExchangeRates = {};
      currencies.forEach((currencyKey) => {
        const exchangeRate = data[currencyKey];
        if (exchangeRate) {
          exchangeRates[currencyKey] = {
            code: currencyKey,
            name: exchangeRate.name,
            ask: parseFloat(exchangeRate.ask.replace(',', '.')),
          };
        }
      });
      const selectedCurrencyRate = exchangeRates[expenseData.currency];

      if (selectedCurrencyRate) {
        const newExchangeRates = { ...data };

        if (isEditing) {
          const editedExpenseData: Expense = {
            id: dataState.wallet.expenses.length,
            value: parseFloat(expenseData.value).toString(),
            description: expenseData.description,
            method: selectedMethod,
            tag: selectedTag,
            exchangeRates: newExchangeRates,
          };
          dispatch(editExpense(editedExpenseData));
          clearExpenseData();
        } else {
          const newExpense: Expense = {
            id: dataState.wallet.expenses.length,
            value: parseFloat(expenseData.value).toString(),
            description: expenseData.description,
            currency: expenseData.currency,
            method: selectedMethod,
            tag: selectedTag,
            exchangeRates: newExchangeRates,
          };

          dispatch(addExpense(newExpense));
          clearExpenseData();
        }
      } else {
        console.error(`Taxa de câmbio para ${expenseData.currency} não encontrada.`);
      }
    } catch (error) {
      console.error('Erro ao adicionar ou editar despesa:', error);
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setExpenseData((prevExpenseData) => ({ ...prevExpenseData, [name]: value }));
  };

  return (
    <div>
      <label htmlFor="value">
        Valor da despesa:
        <input
          type="text"
          name="value"
          value={ expenseData.value }
          onChange={ handleInputChange }
          data-testid="value-input"
          placeholder="Valor da despesa"
        />
      </label>
      <label htmlFor="description">
        Descrição da despesa:
        <input
          type="text"
          name="description"
          value={ expenseData.description }
          onChange={ handleInputChange }
          data-testid="description-input"
          placeholder="Descrição da despesa"
        />
      </label>
      {' '}
      <label htmlFor="currency-input">Moeda: </label>
      <select
        id="currency-input"
        data-testid="currency-input"
        name="currency"
        value={ expenseData.currency }
        onChange={ handleSelectChange }
      >
        {currencies.map((currency) => (
          <option key={ currency } value={ currency }>
            {currency}
          </option>
        ))}
      </select>
      <label htmlFor="method-input">Método de Pagamento: </label>
      <select
        data-testid="method-input"
        name="method"
        value={ selectedMethod }
        onChange={ (e) => {
          setSelectedMethod(e.target.value);
          handleSelectChange(e);
        } }
      >
        <option value="Dinheiro">Dinheiro</option>
        <option value="Cartão de crédito">Cartão de crédito</option>
        <option value="Cartão de débito">Cartão de débito</option>
      </select>
      <label htmlFor="tag-input">Categoria: </label>
      <select
        data-testid="tag-input"
        name="tag"
        value={ selectedTag }
        onChange={ (e) => {
          setSelectedTag(e.target.value);
          handleSelectChange(e);
        } }
      >
        <option value="Alimentação">Alimentação</option>
        <option value="Lazer">Lazer</option>
        <option value="Trabalho">Trabalho</option>
        <option value="Transporte">Transporte</option>
        <option value="Saúde">Saúde</option>
      </select>
      <button data-testid="add-expense-button" onClick={ handleButtonClick }>
        {isEditing ? 'Editar despesa' : 'Adicionar despesa'}
      </button>
    </div>
  );
}

export default WalletForm;
