import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Login, Register } from '../auth';
// import Alert from '../layout/Alert';
import NotFound from '../layout/NotFound';
import { Timers } from '../timers';
import NavigationBar from '../layout/NavigationBar';
import { CheckAuthentication } from '../../utils/CheckAuthentication';
import PrivateRoute from '../../utils/PrivateRoute';
import GuestRoute from '../../utils/GuestRoute';
import Box from '@mui/material/Box';
import SideBar from '../layout/SideBar';
import { CssBaseline } from '@mui/material';
import { AppState } from '../../store';
import { useSelector, useDispatch } from 'react-redux';

const Routing = () => {
  useEffect(() => {
    CheckAuthentication();
  },[]);

  const auth = useSelector((state:AppState) => state.auth);

  const [open, setOpen] = useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
      <Box sx={{ display: 'flex' }}>
        <CssBaseline/>
        <NavigationBar open={open} toggleDrawer={toggleDrawer} auth={auth}/>
        
        {auth.authenticated && <SideBar open={open} toggleDrawer={toggleDrawer}/>}

        <Router>
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

      </Box>
  );
};

export default Routing;
