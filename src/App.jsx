// import { Switch, Route } from "wouter";
// import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import { ThemeProvider, createTheme } from "@mui/material";
import { CssBaseline } from "@mui/material";
import { Toaster } from "react-hot-toast";
import SignupForm from "./pages/SignupForm";
import LoginForm from "./pages/LoginForm";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1e88e5',
      light: '#64b5f6',
      dark: '#1565c0',
    },
    secondary: {
      main: '#06b6d4',
      light: '#67e8f9',
      dark: '#0891b2',
    },
    background: {
      default: '#f8fbff',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
    },
    divider: '#d7e2ee',
    success: {
      main: '#0ea5e9',
    },
    error: {
      main: '#ff6b6b',
    },
    warning: {
      main: '#ffa94d',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
    h5: {
      fontWeight: 700,
      fontSize: '1.75rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    subtitle1: {
      fontWeight: 600,
      color: '#e0e0e0',
    },
    body1: {
      color: '#d0d0d0',
      lineHeight: 1.6,
    },
    body2: {
      color: '#a0a0a0',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f8fbff',
          backgroundImage:
            'radial-gradient(circle at top left, rgba(96, 165, 250, 0.18), transparent 28%), radial-gradient(circle at top right, rgba(6, 182, 212, 0.16), transparent 30%), linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)',
          color: '#0f172a',
        },
        a: {
          color: '#1e88e5',
        },
        '*::selection': {
          backgroundColor: 'rgba(30, 136, 229, 0.18)',
          color: '#0f172a',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#ffffff',
          borderColor: '#d7e2ee',
          boxShadow: '0 16px 40px rgba(15, 23, 42, 0.08)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 999,
          backgroundImage: 'linear-gradient(135deg, #1e88e5 0%, #06b6d4 100%)',
          boxShadow: '0 10px 24px rgba(30, 136, 229, 0.22)',
          '&:hover': {
            backgroundImage: 'linear-gradient(135deg, #1565c0 0%, #0891b2 100%)',
            boxShadow: '0 14px 28px rgba(6, 182, 212, 0.26)',
          },
        },
        outlined: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 999,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderColor: '#d7e2ee',
          backgroundImage: 'none',
          boxShadow: '0 16px 40px rgba(15, 23, 42, 0.08)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
          borderRadius: 24,
        },
      },
    },
  },
});

function AppRouter() {
  return (
    <Router> 
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/signup" element={<SignupForm/>} />
        <Route path="/login" element={<LoginForm/>} />
        <Route element={<NotFound/>} />
      </Routes> 
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppRouter />
      <Toaster position="top-center" />
    </ThemeProvider>
  );
}

export default App;
