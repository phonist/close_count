import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  Avatar,
  Button,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Stack,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { attemptRegister } from '../thunks';
import { CssBaseline, Container } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';


function Copyright(props:any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="#">
        Close Count
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

const Register = () => {
    const dispatch = useAppDispatch();
    const auth = useAppSelector((state) => state.auth);
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      password2: ''
    });
  
    const { name, email, password, password2 } = formData;
  
    const onChange = (e:any) =>
      setFormData({ ...formData, [e.target.name]: e.target.value });
  
    const handleSubmit = async (e: any) => {
      e.preventDefault();
      if (password !== password2) {
        // alert user here
      } else {
        dispatch(attemptRegister({ name, email, password }));
      }
    };
  
    if (auth.authenticated) {
      return <Navigate to="/timers" />;
    }

    return (
        <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="sm">
            <CssBaseline />
            <Box
                sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 6,
                }}
            >
                <Card sx={{ width: '100%', borderRadius: 2, border: '1px solid #e5e7eb', boxShadow: 'none' }}>
                    <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                        <Stack spacing={2}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                    <LockOutlinedIcon />
                                </Avatar>
                                <Box>
                                    <Typography component="h1" variant="h5">
                                        Sign Up
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Create your Close Count account.
                                    </Typography>
                                </Box>
                            </Box>
                            <Divider />
                            <Box component="form" onSubmit={handleSubmit} noValidate>
                                <Stack spacing={2}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="name"
                                        label="Name"
                                        name="name"
                                        autoComplete="name"
                                        autoFocus
                                        onChange={onChange}
                                        value={name}
                                    />
                                    <TextField
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        name="email"
                                        autoComplete="email"
                                        onChange={onChange}
                                        value={email}
                                    />
                                    <TextField
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        id="password"
                                        autoComplete="new-password"
                                        onChange={onChange}
                                        value={password}
                                    />
                                    <TextField
                                        required
                                        fullWidth
                                        name="password2"
                                        label="Confirm Password"
                                        type="password"
                                        id="password2"
                                        autoComplete="new-password"
                                        onChange={onChange}
                                        value={password2}
                                    />
                                    <Button type="submit" fullWidth variant="contained">
                                        Sign Up
                                    </Button>
                                    <Grid container justifyContent="flex-end">
                                        <Grid item>
                                            <Link href="/login" variant="body2">
                                                Already have an account? Sign in
                                            </Link>
                                        </Grid>
                                    </Grid>
                                </Stack>
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>
            </Box>
            <Copyright sx={{ mb: 3 }} />
        </Container>
        </ThemeProvider>
    );
};

export default Register;
