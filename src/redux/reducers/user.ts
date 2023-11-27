// Esse reducer será responsável por tratar as informações da pessoa usuária

// user.ts

type UserState = {
  email: string;
  password: string;
};

const initialState: UserState = {
  email: '',
  password: '',
};

const user = (state = initialState, action: any) => {
  switch (action.type) {
    case 'SET_EMAIL':
      return { ...state, email: action.payload };
    case 'SET_PASSWORD':
      return { ...state, password: action.payload };
    default:
      return state;
  }
};

export default user;
export type { UserState };
