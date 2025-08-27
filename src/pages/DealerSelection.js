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
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a5d1a 0%, #0d4b0d 50%, #1a5d1a 100%);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #FFD700 0%, #FFA000 100%);
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
  color: #a7f3d0;
  font-size: 1.1rem;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const PokerTableContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${props => props.theme.spacing.xl};
  position: relative;
`;

const PokerTable = styled(motion.div)`
  width: 700px;
  height: 400px;
  background: linear-gradient(135deg, #228B22 0%, #006400 100%);
  border-radius: 50%;
  border: 8px solid #DAA520;
  box-shadow: 
    0 0 40px rgba(218, 165, 32, 0.3),
    inset 0 0 20px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%);
    pointer-events: none;
  }
`;

const CentralLogo = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`;

const CentralIcon = styled.div`
  background: linear-gradient(135deg, #DAA520 0%, #B8860B 100%);
  border-radius: 50%;
  padding: ${props => props.theme.spacing.lg};
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  margin-bottom: ${props => props.theme.spacing.sm};
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const CentralText = styled.p`
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`;

const DirectionIndicator = styled(motion.div)`
  margin-top: ${props => props.theme.spacing.sm};
  color: #FFD700;
`;

const PlayerPosition = styled(motion.div)`
  position: absolute;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PlayerAvatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 4px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  position: relative;

  ${props => props.$isSelected ? `
    background: linear-gradient(135deg, #FFD700 0%, #FFA000 100%);
    border-color: #FFD700;
    color: #B8860B;
    box-shadow: 
      0 8px 20px rgba(255, 215, 0, 0.4),
      0 0 30px rgba(255, 215, 0, 0.2);
  ` : `
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    border-color: #cbd5e1;
    color: #475569;

    &:hover {
      border-color: #FFD700;
      box-shadow: 0 6px 16px rgba(255, 215, 0, 0.2);
    }
  `}
`;

const CrownIcon = styled(motion.div)`
  position: absolute;
  top: -8px;
  right: -8px;
  background: #FFD700;
  border: 2px solid white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
`;

const PlayerName = styled.div`
  margin-top: ${props => props.theme.spacing.sm};
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  text-align: center;
  transition: all 0.3s ease;

  ${props => props.$isSelected ? `
    background: #FFD700;
    color: #B8860B;
  ` : `
    background: rgba(255, 255, 255, 0.9);
    color: #374151;
  `}
`;

const DealerChip = styled(motion.div)`
  position: absolute;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    background: white;
    border-radius: 50%;
  }
`;

const DirectionSection = styled.div`
  max-width: 600px;
  margin: 0 auto ${props => props.theme.spacing.xl};
`;

const SectionTitle = styled.h3`
  color: white;
  font-size: 1.3rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const DirectionButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.lg};
  justify-content: center;
`;

const DirectionButton = styled(motion.button)`
  background: ${props => props.$isSelected ? 
    'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' : 
    'rgba(255, 255, 255, 0.1)'};
  border: 2px solid ${props => props.$isSelected ? '#3b82f6' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.lg} ${props => props.theme.spacing.xl};
  color: white;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  min-width: 160px;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.$isSelected ? 
      'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' : 
      'rgba(255, 255, 255, 0.2)'};
    border-color: ${props => props.$isSelected ? '#3b82f6' : '#3b82f6'};
  }

  ${props => props.$isSelected && `
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
  `}
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.lg};
  justify-content: center;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const ActionButton = styled(motion.button)`
  background: ${props => {
    if (props.$variant === 'random') return 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)';
    if (props.$variant === 'confirm') return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    return 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
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
  min-width: 180px;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
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
  max-width: 500px;
  margin: 0 auto;
  box-shadow: 0 0 40px rgba(255, 215, 0, 0.4);
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
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const LoadingState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xxl};
  color: white;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ParticleContainer = styled(motion.div)`
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
`;

const Particle = styled(motion.div)`
  position: absolute;
  width: 8px;
  height: 8px;
  background: #FFD700;
  border-radius: 50%;
  box-shadow: 0 0 10px #FFD700;
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

  const handleReset = () => {
    setSelectedDealer(null);
    setSelectedDirection(null);
    setResult(null);
  };

  // Calcola le posizioni dei giocatori attorno al tavolo
  const getPlayerPosition = (index, total) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2; // Inizia dal top
    const radiusX = 280; // Raggio orizzontale dell'ellisse
    const radiusY = 160; // Raggio verticale dell'ellisse
    const x = Math.cos(angle) * radiusX;
    const y = Math.sin(angle) * radiusY;
    return { x, y, angle };
  };

  if (loading) {
    return (
      <Container>
        <LoadingState>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Dice6 size={48} color="#FFD700" />
          </motion.div>
          <p style={{ marginTop: '1rem', fontSize: '1.2rem' }}>Preparando il tavolo da poker...</p>
        </LoadingState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>
          <Dice6 size={32} />
          Tavolo da Poker
        </Title>
        <Subtitle>
          Seleziona il dealer per la prossima mano
        </Subtitle>
      </Header>

      {/* Tavolo da Poker */}
      <PokerTableContainer>
        <PokerTable
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo centrale */}
          <CentralLogo
            animate={{ 
              rotate: selectedDirection === 'clockwise' ? 360 : selectedDirection === 'counterclockwise' ? -360 : 0 
            }}
            transition={{ duration: 2, ease: "easeInOut" }}
          >
            <CentralIcon>
              <Crown size={28} color="white" />
            </CentralIcon>
            <CentralText>DEALER</CentralText>
            
            {/* Freccia direzionale */}
            {selectedDirection && (
              <DirectionIndicator
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                {selectedDirection === 'clockwise' ? (
                  <RotateCw size={20} />
                ) : (
                  <RotateCcw size={20} />
                )}
              </DirectionIndicator>
            )}
          </CentralLogo>

          {/* Posizioni dei giocatori */}
          {users.map((user, index) => {
            const position = getPlayerPosition(index, users.length);
            const isSelected = selectedDealer?.id === user.id;
            
            return (
              <PlayerPosition
                key={user.id}
                style={{
                  left: `calc(50% + ${position.x}px)`,
                  top: `calc(50% + ${position.y}px)`,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => setSelectedDealer(user)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  scale: isRandomizing && isSelected ? [1, 1.2, 1] : 1,
                  rotate: isRandomizing && isSelected ? [0, 360] : 0
                }}
                transition={{ duration: 0.3 }}
              >
                <PlayerAvatar $isSelected={isSelected}>
                  {user.username.charAt(0).toUpperCase()}
                  
                  {/* Corona per il dealer selezionato */}
                  <AnimatePresence>
                    {isSelected && (
                      <CrownIcon
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Crown size={10} color="white" />
                      </CrownIcon>
                    )}
                  </AnimatePresence>
                </PlayerAvatar>
                
                <PlayerName $isSelected={isSelected}>
                  {user.username}
                </PlayerName>
              </PlayerPosition>
            );
          })}

          {/* Chip del dealer */}
          {selectedDealer && (
            <DealerChip
              style={{
                left: `calc(50% + ${getPlayerPosition(users.findIndex(u => u.id === selectedDealer.id), users.length).x}px)`,
                top: `calc(50% + ${getPlayerPosition(users.findIndex(u => u.id === selectedDealer.id), users.length).y}px)`,
                transform: 'translate(-50%, -120%)'
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
          )}

          {/* Effetti particelle */}
          <AnimatePresence>
            {result && (
              <ParticleContainer
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {[...Array(15)].map((_, i) => (
                  <Particle
                    key={i}
                    style={{
                      left: `${45 + Math.random() * 10}%`,
                      top: `${45 + Math.random() * 10}%`,
                    }}
                    initial={{ scale: 0, y: 0 }}
                    animate={{ 
                      scale: [0, 1, 0],
                      y: [0, -60, -120],
                      opacity: [0, 1, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      delay: i * 0.1,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </ParticleContainer>
            )}
          </AnimatePresence>
        </PokerTable>
      </PokerTableContainer>

      {/* Controlli direzione */}
      <DirectionSection>
        <SectionTitle>Direzione di Gioco</SectionTitle>
        <DirectionButtons>
          <DirectionButton
            $isSelected={selectedDirection === 'clockwise'}
            onClick={() => setSelectedDirection('clockwise')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCw size={24} />
            Senso Orario
          </DirectionButton>
          
          <DirectionButton
            $isSelected={selectedDirection === 'counterclockwise'}
            onClick={() => setSelectedDirection('counterclockwise')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw size={24} />
            Senso Antiorario
          </DirectionButton>
        </DirectionButtons>
      </DirectionSection>

      {/* Pulsanti azione */}
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
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                <Zap size={20} />
              </motion.div>
              Mescolando...
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
          Reset Tavolo
        </ActionButton>
      </ActionButtons>

      {/* Risultato finale */}
      <AnimatePresence>
        {result && (
          <ResultCard
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <ResultTitle>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Crown size={32} />
              </motion.div>
              Nuovo Dealer!
            </ResultTitle>
            <ResultDetails>
              <strong>{result.dealer.username}</strong> è il dealer
            </ResultDetails>
            <ResultDetails>
              Direzione: <strong>{result.direction === 'clockwise' ? 'Senso Orario' : 'Senso Antiorario'}</strong>
            </ResultDetails>
          </ResultCard>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default DealerSelection;