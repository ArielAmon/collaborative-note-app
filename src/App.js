import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./services/contexts/AuthContext";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import NoteList from "./components/Notes/NoteList";
import NoteEditor from "./components/Notes/NoteEditor";
import Header from "./components/Layout/Header";
import LandingPage from "./components/LandingPage";
import {
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  console.log(
    "PrivateRoute - currentUser:",
    currentUser ? currentUser.email : "No user"
  );

  return currentUser ? children : <Navigate to="/" />;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Header />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Routes>
              <Route
                path="/"
                element={
                  <AuthRoute>
                    {(user) => {
                      console.log(
                        "/ route - user:",
                        user ? user.email : "No user"
                      );
                      return user ? <NoteList /> : <LandingPage />;
                    }}
                  </AuthRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/note/:id"
                element={
                  <PrivateRoute>
                    <NoteEditor />
                  </PrivateRoute>
                }
              />
            </Routes>
          </Container>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

function AuthRoute({ children }) {
  const { currentUser } = useAuth();
  console.log(
    "AuthRoute - currentUser:",
    currentUser ? currentUser.email : "No user"
  );

  return children(currentUser);
}

export default App;
