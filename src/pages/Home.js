import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Users, 
  Gavel, 
  Star, 
  TrendingUp, 
  Coins,
  Target,
  ArrowRight,
  Play
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config/api';

// 🆕 Container principale responsive
const HomeContainer = styled.div`
  padding: ${props => props.theme.spacing.lg} 0;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  
  /* 🆕 Tablet: padding ridotto */
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: ${props => props.theme.spacing.md} 0;
    max-width: 100%;
  }
  
  /* 🆕 Mobile: padding minimo */
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: ${props => props.theme.spacing.sm} 0;
  }
`;

// 🆕 Welcome section responsive migliorata
const WelcomeSection = styled(motion.div)`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xl};
  
  /* 🆕 Mobile: margini ridotti */
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    margin-bottom: ${props => props.theme.spacing.lg};
  }
`;

// 🆕 Titolo responsive con scaling fluido
const WelcomeTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  background: ${props => props.theme.colors.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${props => props.theme.spacing.sm};
  line-height: 1.2;
  
  /* 🆕 Large desktop: titolo più grande */
  @media (min-width: ${props => props.theme.breakpoints.large}) {
    font-size: 3rem;
  }
  
  /* 🆕 Tablet: ridotto */
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 2.2rem;
  }
  
  /* 🆕 Mobile: molto più piccolo */
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 1.8rem;
    margin-bottom: ${props => props.theme.spacing.xs};
  }
  
  /* 🆕 Mobile molto piccolo */
  @media (max-width: 360px) {
    font-size: 1.6rem;
  }
`;

// 🆕 Sottotitolo responsive
const WelcomeSubtitle = styled.p`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: ${props => props.theme.spacing.lg};
  line-height: 1.5;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  
  /* 🆕 Tablet: font ridotto */
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 1.1rem;
    max-width: 500px;
  }
  
  /* 🆕 Mobile: molto più piccolo */
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 1rem;
    margin-bottom: ${props => props.theme.spacing.md};
    padding: 0 ${props => props.theme.spacing.sm};
  }
`;

// 🆕 Grid responsive intelligente
const QuickActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
  
  /* 🆕 Large desktop: 4 colonne */
  @media (min-width: ${props => props.theme.breakpoints.large}) {
    grid-template-columns: repeat(4, 1fr);
    gap: ${props => props.theme.spacing.xl};
  }
  
  /* 🆕 Desktop: 2 colonne */
  @media (min-width: ${props => props.theme.breakpoints.desktop}) and (max-width: ${props => props.theme.breakpoints.large}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  /* 🆕 Tablet: 2 colonne con gap ridotto */
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${props => props.theme.spacing.md};
    margin-bottom: ${props => props.theme.spacing.lg};
  }
  
  /* 🆕 Mobile: 1 colonna */
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing.sm};
  }
`;

// 🆕 Action Card completamente responsive
const ActionCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.lg};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  min-height: 200px;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.large};
    border-color: ${props => props.theme.colors.primary};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => props.gradient || props.theme.colors.gradient};
  }
  
  /* 🆕 Tablet: padding ridotto */
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: ${props => props.theme.spacing.md};
    min-height: 180px;
    
    &:hover {
      transform: translateY(-1px); /* Hover meno pronunciato */
    }
  }
  
  /* 🆕 Mobile: layout ottimizzato */
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: ${props => props.theme.spacing.md};
    min-height: 160px;
    
    /* Su mobile, rimuovi l'hover transform per performance */
    &:hover {
      transform: none;
      box-shadow: ${props => props.theme.shadows.medium};
    }
    
    /* Area di tocco più grande */
    &:active {
      transform: scale(0.98);
    }
  }
`;

// 🆕 Icona responsive
const ActionIcon = styled.div`
  width: 50px;
  height: 50px;
  background: ${props => props.background || props.theme.colors.primary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${props => props.theme.spacing.md};
  box-shadow: ${props => props.theme.shadows.medium};
  flex-shrink: 0;
  
  /* 🆕 Tablet: leggermente più piccola */
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 45px;
    height: 45px;
    margin-bottom: ${props => props.theme.spacing.sm};
  }
  
  /* 🆕 Mobile: più piccola */
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 40px;
    height: 40px;
  }
`;

// 🆕 Titolo action responsive
const ActionTitle = styled.h3`
  color: ${props => props.theme.colors.text};
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: ${props => props.theme.spacing.sm};
  line-height: 1.3;
  
  /* 🆕 Mobile: font più piccolo */
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 1rem;
    margin-bottom: ${props => props.theme.spacing.xs};
  }
`;

// 🆕 Descrizione action responsive
const ActionDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: ${props => props.theme.spacing.md};
  flex: 1; /* Prende lo spazio rimanente */
  
  /* 🆕 Mobile: font più piccolo */
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 0.85rem;
    margin-bottom: ${props => props.theme.spacing.sm};
  }
`;

// 🆕 Action button responsive
const ActionButton = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.secondary};
  font-weight: 600;
  font-size: 0.9rem;
  transition: gap 0.2s ease;
  margin-top: auto; /* Si posiziona in fondo */

  ${ActionCard}:hover & {
    gap: ${props => props.theme.spacing.md};
  }
  
  /* 🆕 Mobile: font più piccolo */
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 0.85rem;
    
    /* Su mobile, gap fisso per performance */
    ${ActionCard}:hover & {
      gap: ${props => props.theme.spacing.sm};
    }
  }
`;

// 🆕 Stats grid responsive
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
  
  /* 🆕 Large desktop: 4 colonne fisse */
  @media (min-width: ${props => props.theme.breakpoints.large}) {
    grid-template-columns: repeat(4, 1fr);
  }
  
  /* 🆕 Tablet: 2 colonne */
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${props => props.theme.spacing.md};
    margin-bottom: ${props => props.theme.spacing.lg};
  }
  
  /* 🆕 Mobile: 2 colonne compatte */
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${props => props.theme.spacing.sm};
    margin-bottom: ${props => props.theme.spacing.md};
  }
`;

// 🆕 Stat card responsive
const StatCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.lg};
  text-align: center;
  
  /* 🆕 Tablet: padding ridotto */
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: ${props => props.theme.spacing.md};
  }
  
  /* 🆕 Mobile: padding minimo */
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: ${props => props.theme.spacing.sm};
  }
`;

// 🆕 Stat value responsive
const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  color: ${props => props.color || props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs};
  line-height: 1;
  
  /* 🆕 Tablet: più piccolo */
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 2.2rem;
  }
  
  /* 🆕 Mobile: molto più piccolo */
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 1.8rem;
  }
`;

// 🆕 Stat label responsive
const StatLabel = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
  font-weight: 500;
  line-height: 1.3;
  
  /* 🆕 Mobile: font più piccolo */
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 0.8rem;
  }
`;

// 🆕 Section title responsive
const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  
  /* 🆕 Tablet: font più piccolo */
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 1.3rem;
    margin-bottom: ${props => props.theme.spacing.md};
  }
  
  /* 🆕 Mobile: molto più piccolo */
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 1.2rem;
    margin-bottom: ${props => props.theme.spacing.sm};
  }
`;

// 🆕 Live section responsive
const LiveSection = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.xl};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xl};
  
  /* 🆕 Tablet: padding ridotto */
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: ${props => props.theme.spacing.lg};
    margin-bottom: ${props => props.theme.spacing.lg};
  }
  
  /* 🆕 Mobile: padding minimo */
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: ${props => props.theme.spacing.md};
    margin-bottom: ${props => props.theme.spacing.md};
  }
`;

// 🆕 Live indicator responsive
const LiveIndicator = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  background: rgba(244, 67, 54, 0.1);
  color: ${props => props.theme.colors.error};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: ${props => props.theme.spacing.md};
  
  /* 🆕 Mobile: più piccolo */
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 0.8rem;
    padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
    margin-bottom: ${props => props.theme.spacing.sm};
  }
`;

const LiveDot = styled.div`
  width: 8px;
  height: 8px;
  background: ${props => props.theme.colors.error};
  border-radius: 50%;
  animation: pulse 2s infinite;
  flex-shrink: 0;

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  /* 🆕 Mobile: dot più piccolo */
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 6px;
    height: 6px;
  }
`;

// 🆕 Live title responsive
const LiveTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.sm};
  
  /* 🆕 Mobile: più piccolo */
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 1.1rem;
    margin-bottom: ${props => props.theme.spacing.xs};
  }
`;

// 🆕 Live description responsive
const LiveDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: ${props => props.theme.spacing.lg};
  line-height: 1.5;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  
  /* 🆕 Mobile: margini ridotti */
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    margin-bottom: ${props => props.theme.spacing.md};
    font-size: 0.9rem;
    padding: 0 ${props => props.theme.spacing.sm};
  }
`;

// 🆕 Join auction button responsive
const JoinAuctionButton = styled(motion.button)`
  background: ${props => props.theme.colors.gradient};
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
  margin: 0 auto;
  transition: all 0.2s ease;
  min-height: 44px; /* Touch-friendly */

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${props => props.theme.shadows.medium};
  }
  
  /* 🆕 Mobile: ottimizzazioni touch */
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    min-height: 48px;
    padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
    font-size: 0.9rem;
    width: 100%;
    max-width: 280px;
    
    &:hover {
      transform: none; /* Rimuovi hover su mobile */
    }
    
    &:active {
      transform: scale(0.98);
    }
  }
`;

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats] = useState({
    totalPlayers: 538,
    availablePlayers: 520,
    activeAuctions: 0,
    totalUsers: 8
  });
  const [liveAuction] = useState(null);

  const creditiDisponibili = user ? (user.crediti_totali - user.crediti_spesi) : 0;

  // Simula caricamento dati (sostituire con API reali)
  useEffect(() => {
    // Qui farai le chiamate API reali
    // fetchStats();
    // fetchLiveAuction();
  }, []);

  const quickActions = [
    {
      title: 'Esplora Calciatori',
      description: 'Esplora tutte le pippe arrivate in Serie A',
      icon: <Users size={24} color="white" />,
      background: 'linear-gradient(135deg, #2D5A87 0%, #1A4066 100%)',
      action: () => navigate('/calciatori')
    },
    {
      title: 'Asta Live',
      description: 'Se vuoi qualcuno entra Porco Dio!',
      icon: <Gavel size={24} color="white" />,
      background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
      action: () => navigate('/asta-live')
    },
    {
      title: 'La Mia Rosa',
      description: 'Guarda che merda che stai facendo con la tua rosa',
      icon: <Star size={24} color="white" />,
      background: 'linear-gradient(135deg, #4CAF50 0%, #45A049 100%)',
      action: () => navigate('/mia-rosa')
    },
    {
      title: 'Crediti',
      description: 'Confronta i crediti rimasti con quelli degli altri ebrei',
      icon: <TrendingUp size={24} color="white" />,
      background: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)',
      action: () => navigate('/classifica')
    }
  ];

  return (
    <HomeContainer>
      <WelcomeSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <WelcomeTitle>
          Benvenuto {user?.username}, ricordati di pagare il Re del Fantacalcio! 🏆
        </WelcomeTitle>
        <WelcomeSubtitle>
          Cerca di fare meglio del Savo e il tuo Fantacalcio sarà salvo
        </WelcomeSubtitle>
      </WelcomeSection>

      {liveAuction && (
        <LiveSection>
          <LiveIndicator>
            <LiveDot />
            ASTA IN CORSO
          </LiveIndicator>
          <LiveTitle>Asta per {liveAuction.player}</LiveTitle>
          <LiveDescription>
            C'è un'asta attiva proprio ora! Non perdere l'occasione di aggiudicarti 
            un grande giocatore per la tua rosa.
          </LiveDescription>
          <JoinAuctionButton
            onClick={() => navigate('/asta-live')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Play size={18} />
            Partecipa all'Asta
          </JoinAuctionButton>
        </LiveSection>
      )}

      <SectionTitle>
        <Coins size={24} />
        Azioni Rapide
      </SectionTitle>

      <QuickActionsGrid>
        {quickActions.map((action, index) => (
          <ActionCard
            key={index}
            onClick={action.action}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ scale: 1.02 }}
            gradient={action.background}
          >
            <ActionIcon background={action.background}>
              {action.icon}
            </ActionIcon>
            <ActionTitle>{action.title}</ActionTitle>
            <ActionDescription>{action.description}</ActionDescription>
            <ActionButton>
              Vai <ArrowRight size={16} />
            </ActionButton>
          </ActionCard>
        ))}
      </QuickActionsGrid>
    </HomeContainer>
  );
};

export default Home;