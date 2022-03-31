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
      <NavigationBar />
      <Routes>
        <Route path="/" element={<PrivateRoute/>}>
          <Route path="/timers" element={<Timers />}/>
        </Route>
        
        <Route path="/" element={<GuestRoute/>}>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router> 
  );
};

export default Routing;
