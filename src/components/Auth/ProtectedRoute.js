import React from 'react';
import { Navigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { Trophy } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  gap: ${props => props.theme.spacing.lg};
`;

const LoadingSpinner = styled.div`
  width: 60px;
  height: 60px;
  background: ${props => props.theme.colors.gradient};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${spin} 1s linear infinite;
  box-shadow: ${props => props.theme.shadows.glow};
`;

const LoadingText = styled.h2`
  color: ${props => props.theme.colors.text};
  font-size: 1.2rem;
  font-weight: 600;
  text-align: center;
`;

const LoadingSubtext = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
  text-align: center;
  max-width: 400px;
`;

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <LoadingContainer>
        <LoadingSpinner>
          <Trophy size={28} color="white" />
        </LoadingSpinner>
        <LoadingText>Caricamento FantaCorrubbio...</LoadingText>
        <LoadingSubtext>
          Stiamo preparando la tua esperienza di fantacalcio
        </LoadingSubtext>
      </LoadingContainer>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;