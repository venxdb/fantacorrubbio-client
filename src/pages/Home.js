import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  Users,
  Gavel,
  History,
  TrendingUp,
  Coins,
  ArrowRight,
  Play
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

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
  text-align: left;
  margin-bottom: ${props => props.theme.spacing.xl};
  position: relative;
  overflow: hidden;
  padding: ${props => props.theme.spacing.xl} ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.radius.lg};
  background:
    radial-gradient(ellipse 500px 300px at 100% 0%, rgba(5, 150, 105, 0.25) 0%, transparent 70%),
    linear-gradient(135deg, rgba(20, 27, 38, 0.9) 0%, rgba(10, 14, 20, 0.9) 100%);
  border: 1px solid ${props => props.theme.colors.border};

  &::after {
    content: '🏆';
    position: absolute;
    right: -10px;
    bottom: -30px;
    font-size: 9rem;
    opacity: 0.06;
    line-height: 1;
    pointer-events: none;
  }

  /* 🆕 Mobile: margini ridotti */
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    margin-bottom: ${props => props.theme.spacing.lg};
    padding: ${props => props.theme.spacing.lg};
  }
`;

const WelcomeTitle = styled.h1`
  font-size: 2.4rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.sm};
  line-height: 1.2;
  position: relative;

  /* 🆕 Large desktop: titolo più grande */
  @media (min-width: ${props => props.theme.breakpoints.large}) {
    font-size: 2.6rem;
  }

  /* 🎯 TABLET: Titolo proporzionato */
  @media (min-width: 600px) and (max-width: ${props => props.theme.breakpoints.large}) {
    font-size: 1.8rem;
    line-height: 1.1;
  }

  /* 🆕 Mobile: più piccolo */
  @media (max-width: 600px) {
    font-size: 1.5rem;
    margin-bottom: ${props => props.theme.spacing.xs};
  }

  /* 🆕 Mobile molto piccolo */
  @media (max-width: 360px) {
    font-size: 1.3rem;
  }
`;

const UsernameHighlight = styled.span`
  font-family: 'Playfair Display', 'Sora', serif;
  font-weight: 800;
  color: #FBBF24;
  text-shadow: 0 0 12px rgba(251, 191, 36, 0.35);
`;

const WelcomeSubtitle = styled.p`
  font-size: 1.05rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 0;
  line-height: 1.5;
  max-width: 600px;
  position: relative;

  /* 🎯 TABLET: Sottotitolo proporzionato */
  @media (min-width: 600px) and (max-width: ${props => props.theme.breakpoints.large}) {
    font-size: 1rem;
    max-width: 500px;
    line-height: 1.4;
  }
  
  /* 🆕 Mobile: molto più piccolo */
  @media (max-width: 600px) {
    font-size: 0.9rem;
    margin-bottom: ${props => props.theme.spacing.md};
    padding: 0 ${props => props.theme.spacing.sm};
  }
`;

const QuickActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
  
  /* 🆕 Large desktop: 4 colonne spaziose */
  @media (min-width: ${props => props.theme.breakpoints.large}) {
    grid-template-columns: repeat(4, 1fr);
    gap: ${props => props.theme.spacing.xl};
  }
  
  /* 🎯 TABLET ELEGANTE: 4 colonne compatte sulla stessa riga */
  @media (min-width: 600px) and (max-width: ${props => props.theme.breakpoints.large}) {
    grid-template-columns: repeat(4, 1fr);
    gap: ${props => props.theme.spacing.sm}; /* Gap ridotto per essere più compatti */
    max-width: 100%;
  }
  
  /* 🆕 Mobile: 1 colonna */
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing.sm};
  }
`;

const ActionCard = styled(motion.div)`
  background: ${props => props.gradient || props.theme.colors.gradient};
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: ${props => props.theme.radius.lg};
  padding: ${props => props.theme.spacing.lg};
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
  position: relative;
  overflow: hidden;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  isolation: isolate;

  &::after {
    content: '';
    position: absolute;
    width: 160px;
    height: 160px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.12);
    top: -70px;
    right: -60px;
    z-index: -1;
    transition: transform 0.5s ease;
  }

  &:hover {
    transform: translateY(-6px) scale(1.015);
    box-shadow: ${props => props.theme.shadows.large};
    border-color: rgba(255, 255, 255, 0.3);
  }

  &:hover::after {
    transform: scale(1.3);
  }

  /* 🎯 TABLET ELEGANTE: Layout compatto ma proporzionato */
  @media (min-width: 600px) and (max-width: ${props => props.theme.breakpoints.large}) {
    padding: ${props => props.theme.spacing.md}; /* Padding ridotto */
    min-height: 160px; /* Altezza ridotta ma elegante */

    &:hover {
      transform: translateY(-1px); /* Hover più sottile */
      box-shadow: ${props => props.theme.shadows.medium};
    }
  }

  /* 🆕 Mobile: layout ottimizzato */
  @media (max-width: 600px) {
    padding: ${props => props.theme.spacing.md};
    min-height: 140px;

    &:hover {
      transform: none;
      box-shadow: ${props => props.theme.shadows.medium};
    }

    &:active {
      transform: scale(0.98);
    }
  }
`;



const ActionIcon = styled.div`
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${props => props.theme.spacing.md};
  flex-shrink: 0;
  color: white;

  /* 🎯 TABLET: Icona leggermente più piccola ma proporzionata */
  @media (min-width: 600px) and (max-width: ${props => props.theme.breakpoints.large}) {
    width: 42px;
    height: 42px;
    margin-bottom: ${props => props.theme.spacing.sm};

    /* Icona più piccola dentro */
    svg {
      width: 20px;
      height: 20px;
    }
  }

  /* 🆕 Mobile: ancora più piccola */
  @media (max-width: 600px) {
    width: 38px;
    height: 38px;
    margin-bottom: ${props => props.theme.spacing.sm};

    svg {
      width: 18px;
      height: 18px;
    }
  }
`;
const ActionTitle = styled.h3`
  color: white;
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: ${props => props.theme.spacing.sm};
  line-height: 1.3;

  /* 🎯 TABLET: Font leggermente ridotto */
  @media (min-width: 600px) and (max-width: ${props => props.theme.breakpoints.large}) {
    font-size: 0.95rem;
    margin-bottom: ${props => props.theme.spacing.xs};
    line-height: 1.2;
  }

  /* 🆕 Mobile: font più piccolo */
  @media (max-width: 600px) {
    font-size: 0.9rem;
    margin-bottom: ${props => props.theme.spacing.xs};
  }
`;
const ActionDescription = styled.p`
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: ${props => props.theme.spacing.md};
  flex: 1;

  /* 🎯 TABLET: Testo più compatto */
  @media (min-width: 600px) and (max-width: ${props => props.theme.breakpoints.large}) {
    font-size: 0.8rem;
    line-height: 1.4;
    margin-bottom: ${props => props.theme.spacing.sm};
  }

  /* 🆕 Mobile: ancora più piccolo */
  @media (max-width: 600px) {
    font-size: 0.75rem;
    margin-bottom: ${props => props.theme.spacing.sm};
  }
`;
const ActionButton = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
  transition: gap 0.2s ease;
  margin-top: auto;

  ${ActionCard}:hover & {
    gap: ${props => props.theme.spacing.md};
  }
  
  /* 🎯 TABLET: Button più piccolo */
  @media (min-width: 600px) and (max-width: ${props => props.theme.breakpoints.large}) {
    font-size: 0.8rem;
    
    svg {
      width: 14px;
      height: 14px;
    }
    
    ${ActionCard}:hover & {
      gap: ${props => props.theme.spacing.sm}; /* Gap hover ridotto */
    }
  }
  
  /* 🆕 Mobile: gap fisso per performance */
  @media (max-width: 600px) {
    font-size: 0.75rem;
    
    svg {
      width: 12px;
      height: 12px;
    }
    
    ${ActionCard}:hover & {
      gap: ${props => props.theme.spacing.sm};
    }
  }
`;


// 🆕 Stats grid responsive
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
  background: rgba(239, 68, 68, 0.1);
  color: ${props => props.theme.colors.error};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.radius.pill};
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
  const [liveAuction] = useState(null);

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
      background: 'linear-gradient(135deg, #047857 0%, #10B981 100%)',
      action: () => navigate('/calciatori')
    },
    {
      title: 'Asta Live',
      description: 'Se vuoi qualcuno entra Porco Dio!',
      icon: <Gavel size={24} color="white" />,
      background: 'linear-gradient(135deg, #FBBF24 0%, #D97706 100%)',
      action: () => navigate('/asta-live')
    },
    {
      title: 'Rosa Passata',
      description: 'Rivivi gli errori della scorsa stagione',
      icon: <History size={24} color="white" />,
      background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
      action: () => navigate('/rosa-passata')
    },
    {
      title: 'Crediti',
      description: 'Confronta i crediti rimasti con quelli degli altri ebrei',
      icon: <TrendingUp size={24} color="white" />,
      background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
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
          Benvenuto{' '}
          <UsernameHighlight>
            {user?.username ? user.username[0].toUpperCase() + user.username.slice(1) : ''}
          </UsernameHighlight>
          , ricordo che Venxdb è a quota 4🏆 Edo a quota 3🥈 e il resto è fuffa
        </WelcomeTitle>
        <WelcomeSubtitle>
          Non preoccuparti, il savo cercherà sempre di darti una mano!<br />
          Magari non mettendo la formazione contro di te
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
            <ActionIcon>
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