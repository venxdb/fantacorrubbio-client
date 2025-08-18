import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Trophy, User, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Riuso styled components dal Login con alcune modifiche
const RegisterContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background: ${props => props.theme.colors.background};
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(45, 90, 135, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 167, 38, 0.1) 0%, transparent 50%),
    linear-gradient(135deg, ${props => props.theme.colors.background} 0%, #1a2332 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.lg};
  margin: 0;
  max-width: none;
`;

const RegisterCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 20px;
  padding: ${props => props.theme.spacing.xl};
  width: 100%;
  max-width: 450px !important; /* FORZA la larghezza massima */
  box-shadow: ${props => props.theme.shadows.large};
  backdrop-filter: blur(10px);
  margin: 0 auto; /* Centra la card */
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const LogoIcon = styled.div`
  width: 50px;
  height: 50px;
  background: ${props => props.theme.colors.gradient};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${props => props.theme.shadows.glow};
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  background: ${props => props.theme.colors.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.95rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const InputGroup = styled.div`
  position: relative;
`;

const InputLabel = styled.label`
  display: block;
  color: ${props => props.theme.colors.text};
  font-weight: 500;
  margin-bottom: ${props => props.theme.spacing.sm};
  font-size: 0.9rem;
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const InputIcon = styled.div`
  position: absolute;
  left: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.textSecondary};
  z-index: 1;
`;

const Input = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.md} ${props => props.theme.spacing.md} 48px;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  color: ${props => props.theme.colors.text};
  font-size: 0.95rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(45, 90, 135, 0.1);
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: ${props => props.theme.spacing.md};
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: ${props => props.theme.spacing.xs};
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    color: ${props => props.theme.colors.text};
  }
`;

const ErrorMessage = styled(motion.div)`
  color: ${props => props.theme.colors.error};
  background: rgba(244, 67, 54, 0.1);
  border: 1px solid rgba(244, 67, 54, 0.2);
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.md};
  font-size: 0.85rem;
  text-align: center;
`;

const RegisterButton = styled(motion.button)`
  background: ${props => props.theme.colors.gradient};
  border: none;
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.gradientHover};
    transform: translateY(-1px);
    box-shadow: ${props => props.theme.shadows.medium};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const WelcomeMessage = styled.div`
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.md};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const WelcomeTitle = styled.h3`
  color: ${props => props.theme.colors.success};
  font-weight: 600;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const WelcomeText = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
  line-height: 1.5;
`;

const CreditsBadge = styled.span`
  background: ${props => props.theme.colors.secondary};
  color: white;
  padding: 4px 8px;
  border-radius: 16px;
  font-weight: 600;
  font-size: 0.8rem;
`;

const Divider = styled.div`
  text-align: center;
  margin: ${props => props.theme.spacing.lg} 0;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: ${props => props.theme.colors.border};
  }
  
  span {
    background: ${props => props.theme.colors.surface};
    color: ${props => props.theme.colors.textSecondary};
    padding: 0 ${props => props.theme.spacing.md};
    font-size: 0.85rem;
  }
`;

const LoginLink = styled.div`
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
  
  a {
    color: ${props => props.theme.colors.secondary};
    text-decoration: none;
    font-weight: 600;
    transition: color 0.2s ease;
    
    &:hover {
      color: ${props => props.theme.colors.primary};
    }
  }
`;

const ValidationHint = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: ${props => props.theme.spacing.xs};
`;

const Register = () => {
  const { register, isAuthenticated, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Redirect se già autenticato
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const validateForm = () => {
    const errors = {};

    if (formData.username.length < 3) {
      errors.username = 'Username deve essere di almeno 3 caratteri';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = 'Email non valida';
    }

    if (formData.password.length < 6) {
      errors.password = 'Password deve essere di almeno 6 caratteri';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Le password non coincidono';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const { confirmPassword, ...submitData } = formData;
    await register(submitData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Cancella errore di validazione quando l'utente inizia a digitare
    if (validationErrors[e.target.name]) {
      setValidationErrors({
        ...validationErrors,
        [e.target.name]: ''
      });
    }
  };

  return (
    <RegisterContainer>
      <RegisterCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Header>
          <LogoContainer>
            <LogoIcon>
              <Trophy size={24} color="white" />
            </LogoIcon>
          </LogoContainer>
          <Title>FantaCorrubbio</Title>
          <Subtitle>Crea il tuo account</Subtitle>
        </Header>

        <WelcomeMessage>
        <WelcomeTitle>🔪 By order of the Peaky fucking Bblinders</WelcomeTitle>
          <WelcomeText>
            Registrandoti riceverai <CreditsBadge>350 crediti</CreditsBadge> per partecipare 
            alle aste 
          </WelcomeText>
        </WelcomeMessage>

        <Form onSubmit={handleSubmit}>
          {error && (
            <ErrorMessage
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </ErrorMessage>
          )}

          <InputGroup>
            <InputLabel>Username</InputLabel>
            <InputContainer>
              <InputIcon>
                <User size={18} />
              </InputIcon>
              <Input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Scegli un username"
                required
              />
            </InputContainer>
            {validationErrors.username && (
              <ValidationHint style={{ color: '#F44336' }}>
                {validationErrors.username}
              </ValidationHint>
            )}
          </InputGroup>

          <InputGroup>
            <InputLabel>Email</InputLabel>
            <InputContainer>
              <InputIcon>
                <Mail size={18} />
              </InputIcon>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="la.tua.email@esempio.com"
                required
              />
            </InputContainer>
            {validationErrors.email && (
              <ValidationHint style={{ color: '#F44336' }}>
                {validationErrors.email}
              </ValidationHint>
            )}
          </InputGroup>

          <InputGroup>
            <InputLabel>Password</InputLabel>
            <InputContainer>
              <InputIcon>
                <Lock size={18} />
              </InputIcon>
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Crea una password sicura"
                required
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </PasswordToggle>
            </InputContainer>
            {validationErrors.password && (
              <ValidationHint style={{ color: '#F44336' }}>
                {validationErrors.password}
              </ValidationHint>
            )}
            <ValidationHint>Minimo 6 caratteri</ValidationHint>
          </InputGroup>

          <InputGroup>
            <InputLabel>Conferma Password</InputLabel>
            <InputContainer>
              <InputIcon>
                <Lock size={18} />
              </InputIcon>
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Ripeti la password"
                required
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </PasswordToggle>
            </InputContainer>
            {validationErrors.confirmPassword && (
              <ValidationHint style={{ color: '#F44336' }}>
                {validationErrors.confirmPassword}
              </ValidationHint>
            )}
          </InputGroup>

          <RegisterButton
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? 'Creazione account...' : 'Crea Account'}
            {!isLoading && <ArrowRight size={18} />}
          </RegisterButton>
        </Form>

        <Divider>
          <span></span>
        </Divider>

        <LoginLink>
          Hai già un account?{' '}
          <Link to="/login">Accedi qui</Link>
        </LoginLink>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default Register;