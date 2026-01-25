import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Login, Register } from '../../features/auth';
// import Alert from '../layout/Alert';
import NotFound from '../layout/NotFound';
import { Timers } from '../../features/timers';
import NavigationBar from '../layout/NavigationBar';
import { CheckAuthentication } from './CheckAuthentication';
import PrivateRoute from './PrivateRoute';
import GuestRoute from './GuestRoute';
import Box from '@mui/material/Box';
import SideBar from '../layout/SideBar';
import { CssBaseline } from '@mui/material';
import { useAppSelector } from '../hooks';

const Routing = () => {
  useEffect(() => {
    CheckAuthentication();
  },[]);

  const auth = useAppSelector((state) => state.auth);

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
