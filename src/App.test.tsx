import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import App from './App';
import { renderWithRouterAndRedux } from './tests/helpers/renderWith';
import * as API from './services/index';
import mockData from './tests/helpers/mockData';
import { fetchApi } from './services/index';
import Wallet from './pages/Wallet';

// Constantes para os textos usados nos testes
const LOGIN_EMAIL_LABEL = /entrar/i;
const AXLVOX_EMAIL = /axlvox@mail\.com/i;
const AXLVOX_EMAIL_STRING = 'axlvox@mail.com';
const PASSWORD_STRING = 'password';
const VALUE_LABEL = /valor da despesa:/i;
const DESCRIPTION_LABEL = /descrição da despesa:/i;
const ADD_EXPENSE_LABEL = /adicionar despesa/i;
const MOEDA_LABEL = /moeda:/i;
const METODO_PAGAMENTO_LABEL = /método de pagamento:/i;
const CATEGORIA_LABEL = /categoria:/i;
const EMAIL_INPUT_TESTID = 'email-input';
const PASSWORD_INPUT_TESTID = 'password-input';
const CURRENCY_INPUT_TESTID = 'currency-input';
const METHOD_INPUT_TESTID = 'method-input';
const CATEGORY_INPUT_TESTID = 'tag-input';
const SPARTA_STRING = 'This is Sparta!';
const DELETE = 'delete-btn';

beforeEach(() => {
  vi.spyOn(API, 'fetchApi').mockResolvedValue(mockData);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Testes TrybeWallet', () => {
  test('Testa se os elementos estão presentes no componente Login', () => {
    renderWithRouterAndRedux(<App />);
    const emailInput = screen.getByRole('textbox');
    const passwordInput = screen.getByTestId(PASSWORD_INPUT_TESTID);
    const button = screen.getByRole('button', { name: LOGIN_EMAIL_LABEL });

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  test('A rota deve ser mudada para /carteira após o clique no botão.', async () => {
    renderWithRouterAndRedux(<App />);
    const emailInput = screen.getByTestId(EMAIL_INPUT_TESTID);
    const passwordInput = screen.getByTestId(PASSWORD_INPUT_TESTID);
    const loginButton = screen.getByRole('button', { name: LOGIN_EMAIL_LABEL });

    await userEvent.type(emailInput, AXLVOX_EMAIL_STRING);
    await userEvent.type(passwordInput, PASSWORD_STRING);
    await userEvent.click(loginButton);

    const email = screen.getByText(AXLVOX_EMAIL);
    const value = screen.getByText(VALUE_LABEL);
    const description = screen.getByText(DESCRIPTION_LABEL);

    expect(email).toBeInTheDocument();
    expect(value).toBeInTheDocument();
    expect(description).toBeInTheDocument();
  });

  test('Verifica a funcionalidade dos Inputs', async () => {
    renderWithRouterAndRedux(<Wallet />);

    expect(screen.getByRole('heading', {
      name: /0\.00/i,
    })).toBeInTheDocument();
    const addExpenseButton = screen.getByRole('button', {
      name: ADD_EXPENSE_LABEL,
    });
    const valueInput = screen.getByText(VALUE_LABEL);
    const descriptionInput = screen.getByText(DESCRIPTION_LABEL);
    expect(screen.getByText(MOEDA_LABEL)).toBeInTheDocument();
    expect(screen.getByText(METODO_PAGAMENTO_LABEL)).toBeInTheDocument();
    expect(screen.getByText(CATEGORIA_LABEL)).toBeInTheDocument();
    const currency = screen.getByTestId(CURRENCY_INPUT_TESTID);
    expect(currency).toBeInTheDocument();
    const method = screen.getByTestId(METHOD_INPUT_TESTID);
    expect(method).toBeInTheDocument();
    const category = screen.getByTestId(CATEGORY_INPUT_TESTID);
    expect(category).toBeInTheDocument();
    await userEvent.type(valueInput, '300');
    await userEvent.type(descriptionInput, SPARTA_STRING);
    await userEvent.selectOptions(method, 'Cartão de débito');
    await userEvent.selectOptions(category, 'Saúde');
    await userEvent.click(addExpenseButton);
  });
});

describe('Testes de Funções', () => {
  test('Teste a função deleteExpense', async () => {
    renderWithRouterAndRedux(<App />);
    const emailInput = screen.getByTestId(EMAIL_INPUT_TESTID);
    const passwordInput = screen.getByTestId(PASSWORD_INPUT_TESTID);
    const loginButton = screen.getByRole('button', { name: LOGIN_EMAIL_LABEL });

    await userEvent.type(emailInput, AXLVOX_EMAIL_STRING);
    await userEvent.type(passwordInput, PASSWORD_STRING);
    await userEvent.click(loginButton);

    test('Testa a funcionalidade do botão Excluir', async () => {
      renderWithRouterAndRedux(<App />);

      const emailInputNested = screen.getByTestId(EMAIL_INPUT_TESTID);
      const passwordInputNested = screen.getByTestId(PASSWORD_INPUT_TESTID);
      const loginButtonNested = screen.getByRole('button', { name: LOGIN_EMAIL_LABEL });

      await userEvent.type(emailInputNested, AXLVOX_EMAIL_STRING);
      await userEvent.type(passwordInputNested, PASSWORD_STRING);
      await userEvent.click(loginButtonNested);

      const addExpenseButton = screen.getByTestId('add-expense-button');
      fireEvent.click(addExpenseButton);

      const valueInput = screen.getByText(VALUE_LABEL);
      const descriptionInput = screen.getByText(DESCRIPTION_LABEL);

      await userEvent.type(valueInput, '300');
      await userEvent.type(descriptionInput, SPARTA_STRING);

      const expensesBeforeDelete = screen.getAllByTestId(DELETE).length;

      const deleteButton = screen.getByTestId(DELETE);
      fireEvent.click(deleteButton);

      const expensesAfterDelete = screen.getAllByTestId(DELETE).length;

      expect(expensesAfterDelete).toBe(expensesBeforeDelete - 1);
    });
  });
});

describe('Teste de integração da API', () => {
  it('Deve retornar dados válidos da API', async () => {
    const data = await fetchApi();
    expect(data).toHaveProperty('BTC');
    expect(typeof data.BTC.name).toBe('string');
    expect(typeof data.BTC.ask).toBe('string');
  });
});
