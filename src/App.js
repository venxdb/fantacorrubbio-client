import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import './App.css';

// Context
import { AuthProvider } from './contexts/AuthContext';

// Components
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Calciatori from './pages/Calciatori';
import AstaLive from './pages/AstaLive';
import RisultatiAsta from './pages/RisultatiAsta';
import MiaRosa from './pages/MiaRosa';
import TutteLeRose from './pages/TutteLeRose';
import Classifica from './pages/Classifica';
import AdminPanel from './pages/AdminPanel';
import RandomPlayerWheel from './pages/RandomPlayerWheel';
import Login from './pages/Login';
import Register from './pages/Register';
import DealerSelection from './pages/DealerSelection';

const theme = {
  colors: {
    primary: '#2D5A87',
    secondary: '#FFA726',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    background: '#0F1419',
    surface: '#1A2332',
    surfaceHover: '#243447',
    text: '#FFFFFF',
    textSecondary: '#B0BEC5',
    border: '#37474F',
    gradient: 'linear-gradient(135deg, #2D5A87 0%, #1A4066 100%)',
    gradientHover: 'linear-gradient(135deg, #3A6B94 0%, #1F4A73 100%)'
  },
  shadows: {
    small: '0 2px 4px rgba(0,0,0,0.1)',
    medium: '0 4px 6px rgba(0,0,0,0.1)',
    large: '0 10px 15px rgba(0,0,0,0.1)',
    glow: '0 0 20px rgba(45, 90, 135, 0.3)'
  },
  borderRadius: '12px',
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem'
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    large: '1200px'
  }
};

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    width: 100%;
    height: 100%;
    font-size: 16px;

    @media (max-width: ${props => props.theme.breakpoints.tablet}) {
      font-size: 15px;
    }

    @media (max-width: ${props => props.theme.breakpoints.mobile}) {
      font-size: 14px;
    }

    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    line-height: 1.6;
    overflow-x: hidden;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
  }

  #root {
    min-height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  ::-webkit-scrollbar {
    width: 8px;

    @media (max-width: ${props => props.theme.breakpoints.tablet}) {
      width: 4px;
    }
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.surface};
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.secondary};
  }
`;

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
  background: ${props => props.theme.colors.background};
  position: relative;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  transition: margin-left 0.3s ease;
  
  margin-left: ${props => props.$sidebarOpen ? '280px' : '60px'};

  @media (min-width: 481px) {
    margin-left: ${props => props.$sidebarOpen ? '280px' : '65px'};
  }
  
  @media (min-width: 769px) {
    margin-left: ${props => props.$sidebarOpen ? '280px' : '70px'};
  }
  
  @media (min-width: 1025px) {
    margin-left: ${props => props.$sidebarOpen ? '280px' : '80px'};
  }
`;

const ContentArea = styled.div`
  flex: 1;
  padding: ${props => props.theme.spacing.lg};
  width: 100%;
  min-width: 0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 1024px) {
    padding: ${props => props.theme.spacing.md};
  }

  @media (max-width: 768px) {
    padding: ${props => props.theme.spacing.sm};
    padding-left: ${props => props.theme.spacing.md};
  }
  
  @media (max-width: 480px) {
    padding: ${props => props.theme.spacing.sm};
    padding-left: ${props => props.theme.spacing.md};
  }
`;

const SidebarOverlay = styled.div`
  display: none;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: ${props => props.$visible ? 'block' : 'none'};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 199;
    cursor: pointer;
  }
`;

function AppContent() {
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = React.useState(() => {
    return window.innerWidth > 1024;
  });

  React.useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth > 1024;
      
      if (!isDesktop && sidebarOpen) {
        setSidebarOpen(false);
      } else if (isDesktop && !sidebarOpen) {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  React.useEffect(() => {
    if (window.innerWidth <= 1024 && sidebarOpen) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  const toggleSidebar = React.useCallback((value) => {
    if (typeof value === 'boolean') {
      setSidebarOpen(value);
    } else {
      setSidebarOpen(prev => !prev);
    }
  }, []);

  const handleOverlayClick = React.useCallback(() => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  }, []);

  return (
    <AuthProvider>
      <AppContainer>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: theme.colors.surface,
              color: theme.colors.text,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.borderRadius,
              fontSize: '0.9rem',
              maxWidth: '90vw',
            },
            success: {
              iconTheme: {
                primary: theme.colors.success,
                secondary: theme.colors.text,
              },
            },
            error: {
              iconTheme: {
                primary: theme.colors.error,
                secondary: theme.colors.text,
              },
            },
          }}
        />

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <>
                  <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
                  <SidebarOverlay $visible={sidebarOpen} onClick={handleOverlayClick} />
                  <MainContent $sidebarOpen={sidebarOpen}>
                    <Header 
                      onToggleSidebar={toggleSidebar} 
                      sidebarOpen={sidebarOpen} 
                    />
                    <ContentArea>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/calciatori" element={<Calciatori />} />
                        <Route path="/asta-live" element={<AstaLive />} />
                        <Route path="/risultati-asta/:id" element={<RisultatiAsta />} />
                        <Route path="/mia-rosa" element={<MiaRosa />} />
                        <Route path="/tutte-le-rose" element={<TutteLeRose />} />
                        <Route path="/classifica" element={<Classifica />} />
                        <Route path="/giocatore-random" element={<RandomPlayerWheel />} />
                        <Route path="/dealer-selection" element={<DealerSelection />} />
                        <Route path="/admin" element={<AdminPanel />} />
                      </Routes>
                    </ContentArea>
                  </MainContent>
                </>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AppContainer>
    </AuthProvider>
  );
}

function App() {
  // 🔥 FAVICON: Aggiungi questo useEffect per impostare la favicon
  React.useEffect(() => {
    const setFavicon = () => {
      const faviconSvg = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚽</text></svg>";
      
      let link = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = faviconSvg;
    };

    setFavicon();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;