import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dice6, 
  RotateCw, 
  RotateCcw, 
  Users, 
  Crown, 
  Shuffle, 
  Play,
  RefreshCw,
  Zap,
  User
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import API_URL from '../config/api';

const Container = styled.div`
  padding: ${props => props.theme.spacing.lg} 0;
  max-width: 1000px;
  margin: 0 auto;
  min-height: 80vh;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${props => props.theme.spacing.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.md};
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.1rem;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing.xl};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing.lg};
  }
`;

const Section = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.xl};
  text-align: center;
`;

const SectionTitle = styled.h2`
  color: ${props => props.theme.colors.text};
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: ${props => props.theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
`;

const UsersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const UserCard = styled(motion.div)`
  background: ${props => props.$isSelected ? 
    'linear-gradient(135deg, #FFD700 0%, #FFA000 100%)' : 
    props.theme.colors.background};
  border: 2px solid ${props => props.$isSelected ? '#FFD700' : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.md};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.medium};
    border-color: ${props => props.$isSelected ? '#FFD700' : props.theme.colors.primary};
  }

  ${props => props.$isSelected && `
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
    
    &::before {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: linear-gradient(45deg, #FFD700, #FFA000, #FFD700);
      border-radius: ${props.theme.borderRadius};
      z-index: -1;
      animation: shimmer 2s infinite;
    }
    
    @keyframes shimmer {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
  `}
`;

const UserAvatar = styled.div`
  width: 50px;
  height: 50px;
  background: ${props => props.$isSelected ? 'rgba(255, 255, 255, 0.9)' : props.theme.colors.primary};
  color: ${props => props.$isSelected ? '#B8860B' : 'white'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.2rem;
  margin: 0 auto ${props => props.theme.spacing.sm};
  position: relative;
`;

const CrownIcon = styled(motion.div)`
  position: absolute;
  top: -8px;
  right: -8px;
  background: #FFD700;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UserName = styled.div`
  font-weight: 600;
  color: ${props => props.$isSelected ? '#B8860B' : props.theme.colors.text};
  font-size: 0.9rem;
  text-align: center;
`;

const DirectionSelector = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.lg};
  justify-content: center;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const DirectionButton = styled(motion.button)`
  background: ${props => props.$isSelected ? 
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 
    props.theme.colors.background};
  border: 2px solid ${props => props.$isSelected ? '#667eea' : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.lg};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  min-width: 120px;
  color: ${props => props.$isSelected ? 'white' : props.theme.colors.text};
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.medium};
    border-color: ${props => props.$isSelected ? '#667eea' : props.theme.colors.primary};
  }

  ${props => props.$isSelected && `
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
  `}
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.lg};
  justify-content: center;
  flex-wrap: wrap;
`;

const ActionButton = styled(motion.button)`
  background: ${props => {
    if (props.$variant === 'random') return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    if (props.$variant === 'confirm') return 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
    return props.theme.colors.gradient;
  }};
  border: none;
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
  color: white;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  min-width: 160px;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.large};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const ResultCard = styled(motion.div)`
  background: linear-gradient(135deg, #FFD700 0%, #FFA000 100%);
  color: white;
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.xl};
  text-align: center;
  margin-top: ${props => props.theme.spacing.xl};
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.3);
`;

const ResultTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: ${props => props.theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
`;

const ResultDetails = styled.div`
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const LoadingState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.textSecondary};
`;

const DealerSelection = () => {
  const [users, setUsers] = useState([]);
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [selectedDirection, setSelectedDirection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/utenti`);
      setUsers(response.data.utenti || []);
    } catch (error) {
      console.error('Errore caricamento utenti:', error);
      toast.error('Errore nel caricamento degli utenti');
    } finally {
      setLoading(false);
    }
  };

  const handleRandomSelection = async () => {
    if (users.length === 0) return;
    
    setIsRandomizing(true);
    setResult(null);
    
    // Animazione di randomizzazione
    for (let i = 0; i < 20; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomDirection = Math.random() > 0.5 ? 'clockwise' : 'counterclockwise';
      
      setSelectedDealer(randomUser);
      setSelectedDirection(randomDirection);
      
      await new Promise(resolve => setTimeout(resolve, 100 + i * 10));
    }
    
   
    const finalDealer = users[Math.floor(Math.random() * users.length)];
    const finalDirection = Math.random() > 0.5 ? 'clockwise' : 'counterclockwise';
    
    setSelectedDealer(finalDealer);
    setSelectedDirection(finalDirection);
    setIsRandomizing(false);
    
    
    setTimeout(() => {
      setResult({
        dealer: finalDealer,
        direction: finalDirection
      });
      
      toast.success(`🎯 ${finalDealer.username} è il nuovo dealer!`, {
        duration: 4000,
        style: {
          background: 'linear-gradient(135deg, #FFD700 0%, #FFA000 100%)',
          color: 'white',
          fontWeight: '600'
        }
      });
    }, 500);
  };

  const handleConfirmSelection = () => {
    if (!selectedDealer || !selectedDirection) {
      toast.error('Seleziona sia il dealer che la direzione!');
      return;
    }

    setResult({
      dealer: selectedDealer,
      direction: selectedDirection
    });

    toast.success(`✅ Configurazione salvata!`, {
      duration: 3000,
      style: {
        background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
        color: 'white',
        fontWeight: '600'
      }
    });
  };

  const handleReset = () => {
    setSelectedDealer(null);
    setSelectedDirection(null);
    setResult(null);
  };

  if (loading) {
    return (
      <Container>
        <LoadingState>
          <Dice6 size={48} color="#B0BEC5" />
          <p>Caricamento utenti...</p>
        </LoadingState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>
          <Dice6 size={32} />
          Selezione Dealer
        </Title>
        <Subtitle>
          Scegli chi sarà il dealer e la direzione di gioco per la prossima sessione
        </Subtitle>
      </Header>

      <SectionGrid>
        {/* Selezione Dealer */}
        <Section>
          <SectionTitle>
            <Crown size={24} />
            Scegli il Dealer
          </SectionTitle>
          
          <UsersGrid>
            {users.map((user) => (
              <UserCard
                key={user.id}
                $isSelected={selectedDealer?.id === user.id}
                onClick={() => setSelectedDealer(user)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  scale: isRandomizing && selectedDealer?.id === user.id ? [1, 1.1, 1] : 1
                }}
                transition={{ duration: 0.2 }}
              >
                <UserAvatar $isSelected={selectedDealer?.id === user.id}>
                  {user.username.charAt(0).toUpperCase()}
                  <AnimatePresence>
                    {selectedDealer?.id === user.id && (
                      <CrownIcon
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Crown size={12} color="white" />
                      </CrownIcon>
                    )}
                  </AnimatePresence>
                </UserAvatar>
                <UserName $isSelected={selectedDealer?.id === user.id}>
                  {user.username}
                </UserName>
              </UserCard>
            ))}
          </UsersGrid>
        </Section>

        {/* Selezione Direzione */}
        <Section>
          <SectionTitle>
            <RefreshCw size={24} />
            Direzione di Gioco
          </SectionTitle>
          
          <DirectionSelector>
            <DirectionButton
              $isSelected={selectedDirection === 'clockwise'}
              onClick={() => setSelectedDirection('clockwise')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                rotate: isRandomizing && selectedDirection === 'clockwise' ? [0, 360] : 0
              }}
              transition={{ duration: 0.5 }}
            >
              <RotateCw size={32} />
              <span>Orario</span>
            </DirectionButton>
            
            <DirectionButton
              $isSelected={selectedDirection === 'counterclockwise'}
              onClick={() => setSelectedDirection('counterclockwise')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                rotate: isRandomizing && selectedDirection === 'counterclockwise' ? [0, -360] : 0
              }}
              transition={{ duration: 0.5 }}
            >
              <RotateCcw size={32} />
              <span>Antiorario</span>
            </DirectionButton>
          </DirectionSelector>
        </Section>
      </SectionGrid>

      {/* Pulsanti Azione */}
      <ActionButtons>
        <ActionButton
          $variant="random"
          onClick={handleRandomSelection}
          disabled={isRandomizing || users.length === 0}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isRandomizing ? (
            <>
              <Zap size={20} />
              Randomizzando...
            </>
          ) : (
            <>
              <Shuffle size={20} />
              Selezione Casuale
            </>
          )}
        </ActionButton>


        <ActionButton
          onClick={handleReset}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw size={20} />
          Reset
        </ActionButton>
      </ActionButtons>

      
    </Container>
  );
};

export default DealerSelection;