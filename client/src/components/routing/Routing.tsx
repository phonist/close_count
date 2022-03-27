import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Login, Register } from '../auth';
// import Alert from '../layout/Alert';
import NotFound from '../layout/NotFound';
import { Timers } from '../timers';
import NavigationBar from '../layout/NavigationBar';
import { CheckAuthentication } from '../../utils/CheckAuthentication';
import PrivateRoute from '../../utils/PrivateRoute';
import GuestRoute from '../../utils/GuestRoute';

const Routing = () => {
  useEffect(() => {
    CheckAuthentication();
  },[]);

  return (
    <Router>
      {/* <Alert /> */}
      <NavigationBar />
      <Routes>
        <Route path="/" element={<GuestRoute> <Login /> </GuestRoute>} />

        <Route path="/register" element={<GuestRoute> <Register /></GuestRoute>} />
        <Route path="/login" element={<GuestRoute> <Login /> </GuestRoute>} />
        <Route path="/timers" element={<PrivateRoute> <Timers /> </PrivateRoute>}/>
        <Route path="*" element={<GuestRoute> <NotFound /> </GuestRoute>} />
      </Routes>
    </Router> 
  );
};

export default Routing;
