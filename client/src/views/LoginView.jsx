import React, { useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Alert,
} from "@mui/material";
import logo from '../assets/logo.png'
import axios from "axios";

function LoginView({ setToken, setUser }) {
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    try {
      const response = await axios.post("http://localhost:3000/api/login", {
        email: e.target.email.value,
        password: e.target.password.value,
      });
      setToken(response.data.token);

      try {
        const profileResponse = await axios.get(
          "http://localhost:3000/api/profile",
          {
            headers: { Authorization: response.data.token },
          }
        );
        setUser(profileResponse.data);
      } catch (profileError) {
        setError("Failed to fetch profile");
      }
    } catch (loginError) {
      console.log(loginError)
      setError(loginError.response.data.message || "Login failed");
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Card elevation={3} sx={{ p: 3 }}>
        <CardContent sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}>
          <form onSubmit={handleSubmit}>
            <img src={logo} width={'150px'}/>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              name="email"
            />
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              margin="normal"
              type="password"
              name="password"
            />

            <Button type="submit" variant="contained" fullWidth margin="normal">
              Login
            </Button>
          </form>
          {error && <Alert severity="error">{error}</Alert>}
        </CardContent>
      </Card>
    </Box>
  );
}

export default LoginView;
