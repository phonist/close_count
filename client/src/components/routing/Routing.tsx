import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Login, Register } from '../auth';
// import Alert from '../layout/Alert';
import NotFound from '../layout/NotFound';
import { Timers } from '../timers';
import NavigationBar from '../layout/NavigationBar';

const Routing = () => {
  return (
    <Router>
      {/* <Alert /> */}
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/timers" element={<Timers />}/>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router> 
  );
};

export default Routing;
