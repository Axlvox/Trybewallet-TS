import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setEmail, setPassword } from '../redux/actions';
import { UserState } from '../redux/reducers/user';

function Login() {
  const dispatch = useDispatch();
  const user = useSelector((state: { user: UserState }) => state.user);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    dispatch(setEmail(newEmail));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    dispatch(setPassword(newPassword));
  };

  function handleLogin() {
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email);
    const isPasswordValid = user.password.length >= 6;

    if (isEmailValid && isPasswordValid) {
      setError('');
      navigate('/carteira');
    } else {
      setError('Credenciais inválidas');
    }
  }

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email);
  const isPasswordValid = user.password.length >= 6;
  const isButtonDisabled = !isEmailValid || !isPasswordValid;

  return (
    <div>
      <div>Login</div>
      <div>
        <input
          type="text"
          value={ user.email }
          onChange={ handleEmailChange }
          data-testid="email-input"
        />
        <input
          type="password"
          value={ user.password }
          onChange={ handlePasswordChange }
          data-testid="password-input"
        />
        <button
          type="submit"
          data-testid="login-submit-button"
          disabled={ isButtonDisabled }
          onClick={ handleLogin }
        >
          Entrar
        </button>
        {error && <p>{error}</p>}
      </div>
    </div>
  );
}

export default Login;
