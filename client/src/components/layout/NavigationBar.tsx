import React from 'react';
import { attemptLogout } from '../../thunks/auth'; 
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import { useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const NavigationBar = (props: any) => {
  const dispatch = useDispatch();
  const { open, toggleDrawer, auth } = props;

  const handleLogout = (e: any) => {
    e.preventDefault();
    dispatch(attemptLogout(auth));
    return <Navigate to="/login" />;
  };

  const authLinks = (
    <>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="open drawer"
        onClick={toggleDrawer}
        sx={{
          marginRight: '36px',
          ...(open && { display: 'none' }),
        }}
      > 
        <MenuIcon />
      </IconButton>
      <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
        <Link href="/timers" color="inherit" underline='none'>
          Close count
        </Link>
      </Typography>
      <nav>
        <Button href="#" variant="outlined" onClick={handleLogout} sx={{ my: 1, mx: 1.5 }}>
          Logout
        </Button>
      </nav>
    </>
  );

  const guestLinks = (
    <>
      <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
        Close count
      </Typography>
      <nav>
        <Link
          variant="button"
          color="text.primary"
          href="/register"
          sx={{ my: 1, mx: 1.5 }}
          underline='none'
        >
          Register
        </Link>
        <Link
          variant="button"
          color="text.primary"
          href="/login"
          sx={{ my: 1, mx: 1.5 }}
          underline='none'
        >
          Login
        </Link>
      </nav>
    </>
  );

  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
  })<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }));

  return (

      <AppBar
        position="absolute"
        color="default"
        elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
        open={open}
      >
        <Toolbar
          sx={{
            pr: '24px', // keep right padding when drawer closed
          }}
        >
          {auth.authenticated ? authLinks : guestLinks}
        </Toolbar>
      </AppBar>
  );
};

export default NavigationBar;
