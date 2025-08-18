import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Trophy, Users, Coins, Star, Eye, ChevronRight, User } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import API_URL from '../config/api';

// Configurazione rose - requisiti per ruolo
const REQUISITI_ROSA = {
  'P': { nome: 'Portieri', min: 3, max: 3, icon: '🥅' },
  'D': { nome: 'Difensori', min: 8, max: 8, icon: '🛡️' },
  'C': { nome: 'Centrocampisti', min: 8, max: 8, icon: '⚽' },
  'A': { nome: 'Attaccanti', min: 6, max: 6, icon: '🎯' }
};


const RoseContainer = styled.div`
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

const Subtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.1rem;
`;

const ContentContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.lg};
  
  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
    max-width: 600px;
  }
`;

const UserCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.md};
  height: fit-content;
`;

const UserHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.sm};
  padding-bottom: ${props => props.theme.spacing.sm};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const UserName = styled.h3`
  color: ${props => props.theme.colors.text};
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const UserStats = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  text-align: center;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

const StatLabel = styled.span`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.75rem;
`;

const StatValue = styled.span`
  color: ${props => props.theme.colors.text};
  font-weight: 600;
  font-size: 1rem;
`;

const RoleSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.md};
`;

const RoleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const RoleTitle = styled.h4`
  color: ${props => props.theme.colors.text};
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
`;

const RoleCounter = styled.span`
  background: ${props => props.$complete ? props.theme.colors.success : props.theme.colors.warning};
  color: white;
  padding: 2px ${props => props.theme.spacing.xs};
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
`;

const PlayersContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: ${props => props.theme.spacing.xs};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const PlayerChip = styled.div`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.xs};
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 40px;
  width: 100%;
  box-sizing: border-box;
`;

const PlayerName = styled.span`
  color: ${props => props.theme.colors.text};
  font-weight: 500;
  font-size: 0.8rem;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: ${props => props.theme.spacing.xs};
`;

const PlayerPrice = styled.span`
  color: ${props => props.theme.colors.secondary};
  font-weight: 600;
  font-size: 0.75rem;
  flex-shrink: 0;
`;

const EmptySlot = styled.div`
  background: ${props => props.theme.colors.border};
  border: 2px dashed ${props => props.theme.colors.textSecondary};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.xs};
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.7rem;
  text-align: center;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  box-sizing: border-box;
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.textSecondary};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius};
`;
const FilterContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.xl};
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  background: ${props => props.$active ? props.theme.colors.gradient : props.theme.colors.surface};
  color: ${props => props.$active ? 'white' : props.theme.colors.text};
  border: 2px solid ${props => props.$active ? 'transparent' : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${props => props.theme.shadows.medium};
  }
`;





const TutteLeRose = () => {
  const [utenti, setUtenti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtriRuoli, setFiltriRuoli] = useState(['P', 'D', 'C', 'A']);


  useEffect(() => {
    fetchAllRose();
  }, []);

  const fetchAllRose = async () => {
    try {
      setLoading(true);
      
      // Prima ottieni la lista degli utenti
      const response = await axios.get(`${API_URL}/api/utenti/rose/all`);
      const utenti = response.data.rose || []; // Assicurati che sia sempre un array
      
      if (!Array.isArray(utenti)) {
        console.error('❌ Risposta non è un array:', utenti);
        setUtenti([]);
        return;
      }

      // Poi per ogni utente ottieni la rosa completa
      const utentiConRoseComplete = await Promise.all(
        utenti.map(async (utente) => {
          try {
            const rosaResponse = await axios.get(`${API_URL}/api/utenti/${utente.id}/rosa`);
            
            return {
              ...utente,
              rosa: rosaResponse.data.rosa || []
            };
          } catch (error) {
            console.error(`❌ Errore caricamento rosa per ${utente.username}:`, error.response?.data || error.message);
            
            // Anche se non puoi vedere la rosa, mostra i dati base
            return {
              ...utente,
              rosa: [],
              error: `Non autorizzato a vedere la rosa di ${utente.username}`
            };
          }
        })
      );

      setUtenti(utentiConRoseComplete || []); // Assicurati che sia sempre un array
      
    } catch (error) {
      console.error('❌ Errore caricamento rose:', error);
      toast.error('Errore nel caricamento delle rose');
      setUtenti([]); // Imposta array vuoto in caso di errore
    } finally {
      setLoading(false);
    }
  };
  const toggleFiltroRuolo = (ruolo) => {
  setFiltriRuoli(prev => {
    if (prev.includes(ruolo)) {
      return prev.filter(r => r !== ruolo);
    } else {
      return [...prev, ruolo];
    }
  });
};
const resetFiltri = () => {
  setFiltriRuoli(['P', 'D', 'C', 'A']);
};

  // Funzione per raggruppare giocatori per ruolo
  const getRoleStats = (rosa = []) => {
    const stats = {};
    
    // Inizializza tutti i ruoli
    Object.keys(REQUISITI_ROSA).forEach(ruolo => {
      stats[ruolo] = {
        giocatori: [],
        count: 0,
        required: REQUISITI_ROSA[ruolo].max,
        complete: false
      };
    });

    // Raggruppa giocatori esistenti (solo se rosa è un array)
    if (Array.isArray(rosa)) {
      rosa.forEach(giocatore => {
        const ruolo = giocatore?.ruolo;
        if (ruolo && stats[ruolo]) {
          stats[ruolo].giocatori.push(giocatore);
          stats[ruolo].count++;
        }
      });
    }

    // Verifica completezza
    Object.keys(stats).forEach(ruolo => {
      stats[ruolo].complete = stats[ruolo].count >= stats[ruolo].required;
    });

    return stats;
  };

  const renderUserRosa = (utente) => {
    // Controlli di sicurezza per evitare errori
    const rosa = utente?.rosa || [];
    const creditiTotali = utente?.crediti_totali || 0;
    const creditiSpesi = rosa.reduce((sum, p) => sum + (p?.prezzo_acquisto || 0), 0);
    const creditiRimanenti = creditiTotali - creditiSpesi;
    const roleStats = getRoleStats(rosa);

    return (
      <UserCard key={utente.id}>
        <UserHeader>
          <UserName>
            <User size={20} />
            {utente?.username || 'Utente sconosciuto'}
            {utente?.is_admin && <span style={{ color: '#FFA726', fontSize: '0.8rem' }}>👑 ADMIN</span>}
          </UserName>
          
          <UserStats>
            <StatItem>
              <StatValue>{rosa.length}/25</StatValue>
              <StatLabel>Giocatori</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{creditiSpesi}</StatValue>
              <StatLabel>Spesi</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue style={{ color: creditiRimanenti > 0 ? '#4CAF50' : '#F44336' }}>
                {creditiRimanenti}
              </StatValue>
              <StatLabel>Rimanenti</StatLabel>
            </StatItem>
          </UserStats>
        </UserHeader>

        {Object.entries(REQUISITI_ROSA).filter(([ruolo]) => filtriRuoli.includes(ruolo)).map(([ruolo, config]) => {
          const stats = roleStats[ruolo];
          const postiLiberi = config.max - stats.count;
          
          // Crea un array unificato con giocatori e slot vuoti
          const allSlots = [];
          
          // Aggiungi i giocatori esistenti
          stats.giocatori.forEach((giocatore, index) => {
            allSlots.push({
              type: 'player',
              data: giocatore,
              key: giocatore?.calciatore_id || giocatore?.id || `player-${index}`
            });
          });
          
          // Aggiungi gli slot vuoti
          for (let i = 0; i < postiLiberi; i++) {
            allSlots.push({
              type: 'empty',
              key: `empty-${ruolo}-${i}`
            });
          }

          return (
            
            <RoleSection key={ruolo}>
              <RoleHeader>
                <RoleTitle>
                  <span>{config.icon}</span>
                  {config.nome}
                </RoleTitle>
                <RoleCounter $complete={stats.complete}>
                  {stats.count}/{config.max}
                </RoleCounter>
              </RoleHeader>

              <PlayersContainer>
                {allSlots.map((slot) => {
                  if (slot.type === 'player') {
                    const giocatore = slot.data;
                    return (
                      <PlayerChip key={slot.key}>
                      <PlayerName>
                        {giocatore?.nome || 'N/A'}
                        {giocatore?.squadra && (
                          <span style={{ color: '#B0BEC5', fontSize: '0.7rem', marginLeft: '4px' }}>
                            ({giocatore.squadra.substring(0, 3).toUpperCase()})
                          </span>
                        )}
                      </PlayerName>
                      <PlayerPrice>{giocatore?.prezzo_acquisto || 0}</PlayerPrice>
                    </PlayerChip>
                    );
                  } else {
                    return (
                      <EmptySlot key={slot.key}>
                        Posto libero
                      </EmptySlot>
                    );
                  }
                })}
              </PlayersContainer>
            </RoleSection>
          );
        })}

       
      </UserCard>
    );
  };

  if (loading) {
    return (
      <RoseContainer>
        <LoadingContainer>
          Caricamento delle rose...
        </LoadingContainer>
      </RoseContainer>
    );
  }

  return (
    <RoseContainer>
      <Header>
        <Title>
          <Trophy size={32} />
          Tutte le Rose
        </Title>
        <Subtitle>
          Esplora le rose di tutti gli allenatori e i loro progressi
        </Subtitle>
      </Header>
        <FilterContainer>
      <FilterButton onClick={resetFiltri} $active={filtriRuoli.length === 4}>
        Tutti i Ruoli
      </FilterButton>
      {Object.entries(REQUISITI_ROSA).map(([ruolo, config]) => (
        <FilterButton
          key={ruolo}
          onClick={() => toggleFiltroRuolo(ruolo)}
          $active={filtriRuoli.includes(ruolo)}
        >
          {config.icon} {config.nome}
        </FilterButton>
      ))}
    </FilterContainer>
      <ContentContainer>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p>Caricamento rose...</p>
          </div>
        ) : !Array.isArray(utenti) || utenti.length === 0 ? (
          <EmptyState>
            <div style={{ textAlign: 'center' }}>
              <Users size={48} color="#B0BEC5" />
              <h3 style={{ color: '#666', marginTop: '1rem' }}>Nessuna rosa trovata</h3>
              <p style={{ fontSize: '0.9rem', color: '#B0BEC5', marginTop: '0.5rem' }}>
                Controlla la console per dettagli di debug
              </p>
            </div>
          </EmptyState>
        ) : (
          utenti.map((utente, index) => {
            if (!utente || !utente.id) {
              console.warn('⚠️ Utente invalido:', utente);
              return null;
            }
            return renderUserRosa(utente);
          }).filter(Boolean) // Rimuovi elementi null
        )}
      </ContentContainer>
    </RoseContainer>
  );
};

export default TutteLeRose;