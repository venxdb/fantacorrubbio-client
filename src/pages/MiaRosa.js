import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Star, Trophy, Coins, Users, TrendingUp, Calendar } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import API_URL from '../config/api';

const RosaContainer = styled.div`
  padding: ${props => props.theme.spacing.lg} 0;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  background: ${props => props.theme.colors.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${props => props.theme.spacing.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.md};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const StatCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.lg};
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: ${props => props.color || props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const StatLabel = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
  font-weight: 500;
`;

const RoleSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const RoleHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const RoleTitle = styled.h2`
  color: ${props => props.theme.colors.text};
  font-size: 1.5rem;
  font-weight: 700;
`;

const RoleStats = styled.div`
  background: ${props => props.background};
  color: ${props => props.color};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
`;

const PlayersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const PlayerCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.lg};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.large};
  }
`;

const PlayerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const PlayerInfo = styled.div``;

const PlayerName = styled.h3`
  color: ${props => props.theme.colors.text};
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const PlayerTeam = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
`;

const PurchaseInfo = styled.div`
  text-align: right;
`;

const PurchasePrice = styled.div`
  background: ${props => props.theme.colors.gradient};
  color: white;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const PurchaseDate = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
`;

const PlayerQuote = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${props => props.theme.spacing.md};
  padding-top: ${props => props.theme.spacing.md};
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const QuoteLabel = styled.span`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.85rem;
`;

const QuoteValue = styled.span`
  color: ${props => props.theme.colors.text};
  font-weight: 600;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const EmptyIcon = styled.div`
  width: 80px;
  height: 80px;
  background: ${props => props.theme.colors.gradient};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${props => props.theme.spacing.lg};
`;

const EmptyTitle = styled.h3`
  color: ${props => props.theme.colors.text};
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const EmptyText = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.95rem;
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.textSecondary};
`;

const MiaRosa = () => {
  const { user } = useAuth();
  const [rosa, setRosa] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyRosa();
  }, []);

  const fetchMyRosa = async () => {
    try {
      setLoading(true);
      
     
      const response = await axios.get(`${API_URL}/api/utenti/me/rosa`);
      setRosa(response.data.rosa);
      setStats(response.data.statistiche);
    } catch (error) {
      console.error('❌ Errore caricamento rosa:', error.response?.data || error.message);
      toast.error('Errore nel caricamento della tua rosa');
    } finally {
      setLoading(false);
    }
  };

  const getRoleInfo = (role) => {
    switch(role) {
      case 'P':
        return {
          title: '🥅 Portieri',
          background: 'rgba(255, 193, 7, 0.1)',
          color: '#FF8F00'
        };
      case 'D':
        return {
          title: '🛡️ Difensori',
          background: 'rgba(76, 175, 80, 0.1)',
          color: '#4CAF50'
        };
      case 'C':
        return {
          title: '⚽ Centrocampisti',
          background: 'rgba(33, 150, 243, 0.1)',
          color: '#2196F3'
        };
      case 'A':
        return {
          title: '🎯 Attaccanti',
          background: 'rgba(244, 67, 54, 0.1)',
          color: '#F44336'
        };
      default:
        return {
          title: role,
          background: 'rgba(158, 158, 158, 0.1)',
          color: '#9E9E9E'
        };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('it-IT');
  };

  const groupedPlayers = rosa.reduce((acc, player) => {
    if (!acc[player.ruolo]) {
      acc[player.ruolo] = [];
    }
    acc[player.ruolo].push(player);
    return acc;
  }, {});

  const creditiDisponibili = user ? (user.crediti_totali - user.crediti_spesi) : 0;

  if (loading) {
    return (
      <RosaContainer>
        <LoadingContainer>
          Caricamento della tua rosa...
        </LoadingContainer>
      </RosaContainer>
    );
  }

  return (
    <RosaContainer>
      <Header>
        <Title>
          <Star size={32} />
          La Mia Rosa
        </Title>
      </Header>

      <StatsGrid>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatValue color="#4CAF50">{rosa.length}</StatValue>
          <StatLabel>Calciatori Acquistati</StatLabel>
        </StatCard>
        
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatValue color="#F44336">{user?.crediti_spesi || 0}</StatValue>
          <StatLabel>Crediti Spesi</StatLabel>
        </StatCard>
        
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatValue color="#FFA726">{creditiDisponibili}</StatValue>
          <StatLabel>Crediti Disponibili</StatLabel>
        </StatCard>
        
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatValue color="#2196F3">
            {stats ? Math.round(stats.costo_totale / Math.max(stats.totale_calciatori, 1)) : 0}
          </StatValue>
          <StatLabel>Costo Medio</StatLabel>
        </StatCard>
      </StatsGrid>

      {rosa.length === 0 ? (
        <EmptyState>
          <EmptyIcon>
            <Users size={40} color="white" />
          </EmptyIcon>
          <EmptyTitle>Rosa Vuota</EmptyTitle>
          <EmptyText>
            Non hai ancora acquistato nessun calciatore. Partecipa alle aste per iniziare a costruire la tua rosa!
          </EmptyText>
        </EmptyState>
      ) : (
        ['P', 'D', 'C', 'A'].map(role => {
          const playersInRole = groupedPlayers[role] || [];
          const roleInfo = getRoleInfo(role);
          
          if (playersInRole.length === 0) return null;

          return (
            <RoleSection key={role}>
              <RoleHeader>
                <RoleTitle>{roleInfo.title}</RoleTitle>
                <RoleStats background={roleInfo.background} color={roleInfo.color}>
                  {playersInRole.length} giocatori
                </RoleStats>
              </RoleHeader>

              <PlayersGrid>
                {playersInRole.map((player, index) => (
                  <PlayerCard
                    key={player.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <PlayerHeader>
                      <PlayerInfo>
                        <PlayerName>{player.nome}</PlayerName>
                        <PlayerTeam>{player.squadra}</PlayerTeam>
                      </PlayerInfo>
                      <PurchaseInfo>
                        <PurchasePrice>{player.prezzo_acquisto}</PurchasePrice>
                        <PurchaseDate>
                          <Calendar size={12} />
                          {formatDate(player.data_acquisto)}
                        </PurchaseDate>
                      </PurchaseInfo>
                    </PlayerHeader>

                    <PlayerQuote>
                      <QuoteLabel>Quotazione attuale:</QuoteLabel>
                      <QuoteValue>{player.quotazione}</QuoteValue>
                    </PlayerQuote>
                  </PlayerCard>
                ))}
              </PlayersGrid>
            </RoleSection>
          );
        })
      )}
    </RosaContainer>
  );
};

export default MiaRosa;