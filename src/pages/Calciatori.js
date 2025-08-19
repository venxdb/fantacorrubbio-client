import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Search, Filter, Users, X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import API_URL from '../config/api';

const CalciatoriContainer = styled.div`
  padding: ${props => props.theme.spacing.lg} 0;
  
  @media (max-width: 768px) {
    padding: ${props => props.theme.spacing.md} 0;
  }
  
  @media (max-width: 480px) {
    padding: ${props => props.theme.spacing.sm} 0;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${props => props.theme.spacing.xl};
  gap: ${props => props.theme.spacing.lg};
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${props => props.theme.spacing.md};
    margin-bottom: ${props => props.theme.spacing.lg};
  }
  
  @media (max-width: 480px) {
    gap: ${props => props.theme.spacing.sm};
    margin-bottom: ${props => props.theme.spacing.md};
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
    text-align: center;
    width: 100%;
    justify-content: center;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
    gap: ${props => props.theme.spacing.xs};
  }
`;

const SearchContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  flex: 1;
  max-width: 600px;
  min-width: 300px;
  
  @media (max-width: 768px) {
    width: 100%;
    max-width: none;
    min-width: auto;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: ${props => props.theme.spacing.sm};
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  color: ${props => props.theme.colors.text};
  font-size: 0.95rem;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(45, 90, 135, 0.1);
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
  
  @media (max-width: 480px) {
    padding: ${props => props.theme.spacing.sm};
    font-size: 1rem; /* Maggiore per mobile */
  }
`;

const FilterButton = styled.button`
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  transition: all 0.2s ease;
  white-space: nowrap;
  min-height: 44px; /* Touch-friendly */

  &:hover {
    background: ${props => props.theme.colors.surfaceHover};
    border-color: ${props => props.theme.colors.primary};
  }
  
  @media (max-width: 480px) {
    padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
    width: 100%;
    justify-content: center;
    min-height: 48px;
  }
`;

const FiltersRow = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: ${props => props.theme.spacing.sm};
    margin-bottom: ${props => props.theme.spacing.md};
  }
  
  @media (max-width: 480px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: ${props => props.theme.spacing.xs};
    margin-bottom: ${props => props.theme.spacing.sm};
  }
`;

const FilterChip = styled.button`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.surface};
  border: 1px solid ${props => props.$active ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 20px;
  color: ${props => props.$active ? 'white' : props.theme.colors.text};
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;
  min-height: 36px;

  &:hover {
    background: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.surfaceHover};
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
    border-radius: 16px;
    min-height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
`;

const PlayersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.lg};
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: ${props => props.theme.spacing.md};
    margin-bottom: ${props => props.theme.spacing.md};
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing.sm};
    margin-bottom: ${props => props.theme.spacing.sm};
  }
`;

const PlayerCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.lg};
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.large};
    border-color: ${props => props.theme.colors.primary};
  }
  
  @media (max-width: 768px) {
    padding: ${props => props.theme.spacing.md};
    
    &:hover {
      transform: translateY(-1px); /* Meno pronunciato su tablet */
    }
  }
  
  @media (max-width: 480px) {
    padding: ${props => props.theme.spacing.sm};
    
    &:hover {
      transform: none; /* Rimuovi hover su mobile */
    }
    
    &:active {
      transform: scale(0.98);
      background: ${props => props.theme.colors.surfaceHover};
    }
  }
`;

const PlayerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${props => props.theme.spacing.md};
  
  @media (max-width: 480px) {
    margin-bottom: ${props => props.theme.spacing.sm};
    align-items: center;
  }
`;

const PlayerInfo = styled.div`
  flex: 1;
  min-width: 0; /* Permette il text-overflow */
`;

const PlayerName = styled.h3`
  color: ${props => props.theme.colors.text};
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: ${props => props.theme.spacing.xs};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.95rem;
    margin-bottom: 2px;
  }
`;

const PlayerTeam = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  
  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

const PlayerQuote = styled.div`
  background: ${props => props.theme.colors.gradient};
  color: white;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  white-space: nowrap;
  flex-shrink: 0;
  margin-left: ${props => props.theme.spacing.sm};
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
    border-radius: 16px;
  }
`;

const PlayerRole = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  background: ${props => {
    switch(props.role) {
      case 'P': return 'rgba(255, 193, 7, 0.1)';
      case 'D': return 'rgba(76, 175, 80, 0.1)';
      case 'C': return 'rgba(33, 150, 243, 0.1)';
      case 'A': return 'rgba(244, 67, 54, 0.1)';
      default: return 'rgba(158, 158, 158, 0.1)';
    }
  }};
  color: ${props => {
    switch(props.role) {
      case 'P': return '#FF8F00';
      case 'D': return '#4CAF50';
      case 'C': return '#2196F3';
      case 'A': return '#F44336';
      default: return '#9E9E9E';
    }
  }};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: ${props => props.theme.spacing.md};
  
  @media (max-width: 480px) {
    font-size: 0.75rem;
    padding: 4px ${props => props.theme.spacing.xs};
    border-radius: 10px;
    margin-bottom: ${props => props.theme.spacing.sm};
  }
`;

const PlayerStatus = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  color: ${props => props.$disponibile ? props.theme.colors.success : props.theme.colors.error};
  font-size: 0.85rem;
  font-weight: 500;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    gap: ${props => props.theme.spacing.xs};
  }
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.$disponibile ? props.theme.colors.success : props.theme.colors.error};
  flex-shrink: 0;
  
  @media (max-width: 480px) {
    width: 6px;
    height: 6px;
  }
`;

const StatusText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.textSecondary};
  gap: ${props => props.theme.spacing.md};
  
  @media (max-width: 480px) {
    padding: ${props => props.theme.spacing.lg};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.textSecondary};
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius};
  
  @media (max-width: 480px) {
    padding: ${props => props.theme.spacing.lg};
    font-size: 0.9rem;
  }
`;

// Nuovo componente per contatore filtri attivi
const ActiveFiltersCount = styled.div`
  display: none;
  
  @media (max-width: 480px) {
    display: block;
    background: ${props => props.theme.colors.primary};
    color: white;
    padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
    border-radius: 16px;
    font-size: 0.8rem;
    font-weight: 600;
    text-align: center;
    margin-bottom: ${props => props.theme.spacing.sm};
  }
`;

const Calciatori = () => {
  const [calciatori, setCalciatori] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [disponibileFilter, setDisponibileFilter] = useState('');

  const roles = [
    { key: 'P', label: 'Portieri', icon: '🥅' },
    { key: 'D', label: 'Difensori', icon: '🛡️' },
    { key: 'C', label: 'Centrocampisti', icon: '⚽' },
    { key: 'A', label: 'Attaccanti', icon: '🎯' }
  ];

  useEffect(() => {
    fetchCalciatori();
  }, [searchTerm, selectedRole, selectedTeam, disponibileFilter]);

  const fetchCalciatori = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (searchTerm) params.append('cerca', searchTerm);
      if (selectedRole) params.append('ruolo', selectedRole);
      if (selectedTeam) params.append('squadra', selectedTeam);
      if (disponibileFilter) params.append('disponibile', disponibileFilter);
      
      const response = await axios.get(`${API_URL}/api/calciatori?${params.toString()}`);
      setCalciatori(response.data.calciatori);
    } catch (error) {
      console.error('Errore caricamento calciatori:', error);
      toast.error('Errore nel caricamento dei calciatori');
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = (role) => {
    const roleObj = roles.find(r => r.key === role);
    return roleObj ? roleObj.label : role;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedRole('');
    setSelectedTeam('');
    setDisponibileFilter('');
  };

  // Conta filtri attivi
  const activeFiltersCount = [searchTerm, selectedRole, selectedTeam, disponibileFilter]
    .filter(Boolean).length;

  return (
    <CalciatoriContainer>
      <Header>
        <Title>
          <Users size={28} />
          Calciatori Serie A
        </Title>
        
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Cerca calciatore..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FilterButton onClick={clearFilters}>
            <Filter size={18} />
            <span>Pulisci</span>
          </FilterButton>
        </SearchContainer>
      </Header>

      {activeFiltersCount > 0 && (
        <ActiveFiltersCount>
          {activeFiltersCount} filtro{activeFiltersCount !== 1 ? 'i' : ''} attivo{activeFiltersCount !== 1 ? 'i' : ''}
        </ActiveFiltersCount>
      )}

      <FiltersRow>
        <FilterChip
          $active={disponibileFilter === 'true'}
          onClick={() => setDisponibileFilter(disponibileFilter === 'true' ? '' : 'true')}
        >
          Disponibili
        </FilterChip>
        
        <FilterChip
          $active={disponibileFilter === 'false'}
          onClick={() => setDisponibileFilter(disponibileFilter === 'false' ? '' : 'false')}
        >
          Acquistati
        </FilterChip>

        {roles.map(role => (
          <FilterChip
            key={role.key}
            $active={selectedRole === role.key}
            onClick={() => setSelectedRole(selectedRole === role.key ? '' : role.key)}
          >
            {role.icon} {role.label}
          </FilterChip>
        ))}
      </FiltersRow>

      {loading ? (
        <LoadingContainer>
          <Users size={48} color="#B0BEC5" />
          <span>Caricamento calciatori...</span>
        </LoadingContainer>
      ) : calciatori.length === 0 ? (
        <EmptyState>
          <Users size={48} color="#B0BEC5" style={{ marginBottom: '1rem' }} />
          <div>Nessun calciatore trovato con i filtri selezionati</div>
        </EmptyState>
      ) : (
        <PlayersGrid>
          {calciatori.map((player, index) => (
            <PlayerCard
              key={player.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }} // Animazione più veloce per mobile
            >
              <PlayerHeader>
                <PlayerInfo>
                  <PlayerName>{player.nome}</PlayerName>
                  <PlayerTeam>{player.squadra}</PlayerTeam>
                </PlayerInfo>
                <PlayerQuote>{player.quotazione}</PlayerQuote>
              </PlayerHeader>

              <PlayerRole role={player.ruolo}>
                {getRoleLabel(player.ruolo)}
              </PlayerRole>

              <PlayerStatus $disponibile={player.disponibile}>
                <StatusDot $disponibile={player.disponibile} />
                <StatusText>
                  {player.disponibile ? 'Disponibile' : `Proprietario: ${player.proprietario}`}
                </StatusText>
              </PlayerStatus>
            </PlayerCard>
          ))}
        </PlayersGrid>
      )}
    </CalciatoriContainer>
  );
};

export default Calciatori;