import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteExpense, setIsEditing } from '../redux/actions';
import { ReduxState, Expense } from '../types/types';

function Table() {
  const expenses = useSelector((state: ReduxState) => state.wallet.expenses);
  const dispatch = useDispatch();
  const [editingExpense, setEditingExpense] = useState(null);
  const editedExpense = useSelector((state: ReduxState) => state.wallet.editedExpense);

  const handleEditClick = (expense: Expense) => {
    setEditingExpense(expense); // Defina a despesa em edição no estado local
    dispatch(setIsEditing(true));
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Descrição</th>
          <th>Tag</th>
          <th>Método de pagamento</th>
          <th>Valor</th>
          <th>Moeda</th>
          <th>Câmbio utilizado</th>
          <th>Valor convertido</th>
          <th>Moeda de conversão</th>
          <th>Editar/Excluir</th>
        </tr>
      </thead>
      <tbody>
        {expenses.map((expense: Expense) => {
          const currency = expense.exchangeRates[expense.currency]?.name || '';
          const exchange = (
            parseFloat(expense.exchangeRates[expense.currency]
              ?.ask.toString() || '0')
          ).toFixed(2);
          const converted = (
            parseFloat(expense.value.toString())
            * parseFloat(expense.exchangeRates[expense.currency]
              ?.ask.toString() || '0')
          ).toFixed(2);
          return (
            <tr key={ expense.id }>
              <td>{expense.description}</td>
              <td>{expense.tag}</td>
              <td>{expense.method}</td>
              <td>
                {parseFloat(expense.value.toString()).toFixed(2)}
              </td>
              <td>{currency}</td>
              <td>{exchange}</td>
              <td>{converted}</td>
              <td>
                <button
                  data-testid="edit-btn"
                  onClick={ () => handleEditClick(expense) }
                >
                  Editar
                </button>
              </td>
              <td>
                <button
                  data-testid="delete-btn"
                  onClick={ () => dispatch(deleteExpense(expense.id)) }
                >
                  Excluir
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default Table;
