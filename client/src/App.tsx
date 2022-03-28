import React, { useEffect, useState } from 'react';
import Routing from './components/routing';
import { LOGOUT } from './actions/types';

// Redux
import { Provider, useSelector } from 'react-redux';
import store, { AppState } from './store';
import { attemptLoadUser } from './thunks/auth';
import setAuthToken from './utils/setAuthToken';
import { Login } from './components/auth';
import { SET_UNAUTHENTICATED } from './types/AuthTypes';

const App = () => {
  useEffect(() => { 
    // check for token in LS
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    
    // log user out from all tabs if they log out in one tab
    // eslint-disable-next-line no-unreachable
    window.addEventListener('storage', () => {
      console.log('storage event');
      if (!localStorage.token) store.dispatch({ type: SET_UNAUTHENTICATED });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.StrictMode>
      <Provider store={store}>
        <Routing />
      </Provider>
    </React.StrictMode>
  );
};

export default App;
