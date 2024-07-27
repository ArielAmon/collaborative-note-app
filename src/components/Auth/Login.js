import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { TextField, Button, Typography, Paper, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { auth } from "../../services/firebase";
import { useAuth } from "../../services/contexts/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Attempting login with:", email);
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful");
      navigate("/");
    } catch (error) {
      console.error("Login error:", error.message);
      setError(error.message);
    }
  };

  console.log(
    "Current user in Login component:",
    currentUser ? currentUser.email : "No user"
  );
  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 400, margin: "auto" }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" align="center">
            Login
          </Typography>
        </Grid>
        {error && (
          <Grid item xs={12}>
            <Typography color="error">{error}</Typography>
          </Grid>
        )}
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            Sign In
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default Login;
