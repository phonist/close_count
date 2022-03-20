import React, { useEffect } from 'react';
import Routing from './components/routing';
import { LOGOUT } from './actions/types';

// Redux
import { Provider, useSelector } from 'react-redux';
import store, { AppState } from './store';
import { attemptLoadUser } from './thunks/auth';
import setAuthToken from './utils/setAuthToken';

const App = () => {
  // const auth = useSelector((state: AppState ) => state.auth);
  useEffect(() => { 
    // check for token in LS
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    // let loadedUser = attemptLoadUser();
    // store.dispatch(auth); 
    
    // log user out from all tabs if they log out in one tab
    window.addEventListener('storage', () => {
      if (!localStorage.token) store.dispatch({ type: LOGOUT });
    });
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
