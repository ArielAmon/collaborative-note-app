import React from "react";
import { Typography, Button, Container, Paper, Grid } from "@mui/material";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
      <Paper
        variant="outlined"
        sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
      >
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Welcome to Collaborative Note-Taking App
        </Typography>
        <Typography variant="body1" align="center" paragraph>
          Create, edit, and share notes in real-time. Collaborate with others
          and stay organized.
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <Button
              component={Link}
              to="/login"
              variant="contained"
              color="primary"
            >
              Login
            </Button>
          </Grid>
          <Grid item>
            <Button
              component={Link}
              to="/register"
              variant="outlined"
              color="primary"
            >
              Register
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default LandingPage;
