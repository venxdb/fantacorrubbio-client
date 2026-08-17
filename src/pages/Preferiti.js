import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Plus, Trash2, Coins, CheckCircle2, Lock, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import API_URL from '../config/api';

const ROLE_COLORS = { P: '#F59E0B', D: '#22C55E', C: '#3B82F6', A: '#EF4444' };
const RUOLI = {
  P: { nome: 'Portieri', icon: '🥅' },
  D: { nome: 'Difensori', icon: '🛡️' },
  C: { nome: 'Centrocampisti', icon: '⚽' },
  A: { nome: 'Attaccanti', icon: '🎯' },
};

const Container = styled.div`
  padding: ${props => props.theme.spacing.sm} 0;
  max-width: 720px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const Title = styled.h1`
  font-size: 1.6rem;
  font-weight: 800;
  background: ${props => props.theme.colors.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.85rem;
  margin-top: 2px;
`;

const AddForm = styled.form`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.radius.md};
  padding: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.sm};

  @media (max-width: 560px) {
    flex-wrap: wrap;
  }
`;

const PlayerSelect = styled.select`
  flex: 1;
  min-width: 0;
  padding: ${props => props.theme.spacing.sm};
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.radius.sm};
  color: ${props => props.theme.colors.text};
  font-size: 0.85rem;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const PriceInput = styled.input`
  width: 90px;
  padding: ${props => props.theme.spacing.sm};
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.radius.sm};
  color: ${props => props.theme.colors.text};
  font-size: 0.85rem;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const AddButton = styled(motion.button)`
  background: ${props => props.theme.colors.gradient};
  border: none;
  border-radius: ${props => props.theme.radius.sm};
  padding: 0 ${props => props.theme.spacing.md};
  color: white;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const FilterButton = styled.button`
  background: ${props => props.$active ? props.theme.colors.gradient : props.theme.colors.surface};
  color: ${props => props.$active ? 'white' : props.theme.colors.text};
  border: 1px solid ${props => props.$active ? 'transparent' : props.theme.colors.border};
  border-radius: ${props => props.theme.radius.pill};
  padding: 4px ${props => props.theme.spacing.sm};
  font-weight: 600;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    transform: translateY(-1px);
  }
`;

const ToggleEyeButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 2px 4px;

  &:hover {
    color: ${props => props.theme.colors.text};
  }
`;

const ListWrapper = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.radius.md};
  overflow: hidden;
`;

const ListHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const List = styled.div`
  max-height: 520px;
  overflow-y: auto;
`;

const Row = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: 6px ${props => props.theme.spacing.md};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  opacity: ${props => props.$assegnato ? 0.5 : 1};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${props => props.theme.colors.surfaceHover};
  }
`;

const RoleDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.$color};
  flex-shrink: 0;
`;

const PlayerInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: baseline;
  gap: 6px;
  text-decoration: ${props => props.$assegnato ? 'line-through' : 'none'};
`;

const PlayerName = styled.span`
  color: ${props => props.theme.colors.text};
  font-weight: 600;
  font-size: 0.85rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PlayerSquadra = styled.span`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.75rem;
  flex-shrink: 0;
`;

const AssegnatoBadge = styled.span`
  display: flex;
  align-items: center;
  gap: 3px;
  color: ${props => props.theme.colors.success};
  font-size: 0.7rem;
  font-weight: 600;
  flex-shrink: 0;
`;

const RowPriceInput = styled.input`
  width: 64px;
  text-align: right;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.radius.sm};
  color: ${props => props.theme.colors.secondary};
  font-weight: 700;
  font-size: 0.8rem;
  padding: 3px 6px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }

  &:disabled {
    color: ${props => props.theme.colors.textSecondary};
    cursor: not-allowed;
  }
`;

const MaskedPrice = styled.button`
  width: 64px;
  text-align: right;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.radius.sm};
  color: ${props => props.theme.colors.secondary};
  font-weight: 700;
  font-size: 0.8rem;
  padding: 3px 6px;
  cursor: pointer;
  letter-spacing: 2px;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }

  &:disabled {
    color: ${props => props.theme.colors.textSecondary};
    cursor: not-allowed;
  }
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 4px;
  border-radius: ${props => props.theme.radius.sm};
  flex-shrink: 0;

  &:hover {
    color: ${props => props.theme.colors.error};
    background: rgba(239, 68, 68, 0.1);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2.5rem 1rem;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
`;

const SecretNote = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.75rem;
  margin-top: ${props => props.theme.spacing.sm};
`;

const Preferiti = () => {
  const [preferiti, setPreferiti] = useState([]);
  const [calciatori, setCalciatori] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCalciatore, setSelectedCalciatore] = useState('');
  const [newPrezzo, setNewPrezzo] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPrices, setShowPrices] = useState(false);
  const [filtriRuoli, setFiltriRuoli] = useState(() => {
    const saved = localStorage.getItem('filtriRuoliPreferiti');
    return saved ? JSON.parse(saved) : ['P', 'D', 'C', 'A'];
  });

  const toggleFiltroRuolo = (ruolo) => {
    setFiltriRuoli(prev => {
      const newFiltri = prev.includes(ruolo) ? prev.filter(r => r !== ruolo) : [...prev, ruolo];
      localStorage.setItem('filtriRuoliPreferiti', JSON.stringify(newFiltri));
      return newFiltri;
    });
  };

  const toggleTuttiRuoli = () => {
    const allRoles = ['P', 'D', 'C', 'A'];
    const newFiltri = filtriRuoli.length === allRoles.length ? [] : allRoles;
    setFiltriRuoli(newFiltri);
    localStorage.setItem('filtriRuoliPreferiti', JSON.stringify(newFiltri));
  };

  useEffect(() => {
    fetchPreferiti();
    fetchCalciatori();
  }, []);

  const fetchPreferiti = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/preferiti`);
      setPreferiti(response.data.preferiti || []);
    } catch (error) {
      console.error('Errore caricamento preferiti:', error);
      toast.error('Errore nel caricamento dei preferiti');
    } finally {
      setLoading(false);
    }
  };

  const fetchCalciatori = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/calciatori?disponibile=true&limit=1000`);
      const ordinati = (response.data.calciatori || []).sort((a, b) =>
        a.nome.localeCompare(b.nome, 'it', { sensitivity: 'base' })
      );
      setCalciatori(ordinati);
    } catch (error) {
      console.error('Errore caricamento calciatori:', error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!selectedCalciatore || newPrezzo === '') {
      toast.error('Seleziona un calciatore e un prezzo');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`${API_URL}/api/preferiti`, {
        calciatore_id: selectedCalciatore,
        prezzo_target: parseInt(newPrezzo)
      });
      toast.success('Aggiunto ai preferiti!');
      setSelectedCalciatore('');
      setNewPrezzo('');
      fetchPreferiti();
    } catch (error) {
      const message = error.response?.data?.error || 'Errore nell\'aggiunta del preferito';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePriceUpdate = async (id, prezzo) => {
    if (prezzo === '' || isNaN(parseInt(prezzo)) || parseInt(prezzo) < 0) return;
    try {
      await axios.put(`${API_URL}/api/preferiti/${id}`, { prezzo_target: parseInt(prezzo) });
      setPreferiti(prev => prev.map(p => p.id === id ? { ...p, prezzo_target: parseInt(prezzo) } : p));
    } catch (error) {
      toast.error('Errore nell\'aggiornamento del prezzo');
      fetchPreferiti();
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/preferiti/${id}`);
      setPreferiti(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      toast.error('Errore nella rimozione del preferito');
    }
  };

  const calciatoriDisponibiliPerAggiunta = calciatori.filter(
    c => !preferiti.some(p => p.calciatore_id === c.id)
  );

  const preferitiFiltrati = preferiti.filter(p => filtriRuoli.includes(p.ruolo));

  return (
    <Container>
      <Header>
        <Title>
          <Heart size={20} />
          Preferiti
        </Title>
        <Subtitle>La tua lista personale di giocatori da tenere d'occhio</Subtitle>
      </Header>

      <AddForm onSubmit={handleAdd}>
        <PlayerSelect
          value={selectedCalciatore}
          onChange={(e) => setSelectedCalciatore(e.target.value)}
        >
          <option value="">Seleziona calciatore...</option>
          {calciatoriDisponibiliPerAggiunta.map(c => (
            <option key={c.id} value={c.id}>
              {c.nome} ({c.squadra}) - {c.ruolo}
            </option>
          ))}
        </PlayerSelect>
        <PriceInput
          type={showPrices ? 'number' : 'password'}
          min="0"
          placeholder="Crediti"
          value={newPrezzo}
          onChange={(e) => setNewPrezzo(e.target.value)}
        />
        <AddButton type="submit" disabled={submitting} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Plus size={16} />
          Aggiungi
        </AddButton>
      </AddForm>

      <FilterContainer>
        <FilterButton onClick={toggleTuttiRuoli} $active={filtriRuoli.length === 4}>
          Tutti i Ruoli
        </FilterButton>
        {Object.entries(RUOLI).map(([ruolo, config]) => (
          <FilterButton
            key={ruolo}
            onClick={() => toggleFiltroRuolo(ruolo)}
            $active={filtriRuoli.includes(ruolo)}
          >
            {config.icon} {config.nome}
          </FilterButton>
        ))}
      </FilterContainer>

      <ListWrapper>
        <ListHeader>
          <span>{preferitiFiltrati.length} giocatori in lista</span>
          <ToggleEyeButton onClick={() => setShowPrices(v => !v)}>
            {showPrices ? <EyeOff size={13} /> : <Eye size={13} />}
            {showPrices ? 'Nascondi prezzi' : 'Mostra prezzi'}
          </ToggleEyeButton>
          <span>{preferitiFiltrati.filter(p => p.assegnato).length} già assegnati</span>
        </ListHeader>

        {loading ? (
          <EmptyState>Caricamento...</EmptyState>
        ) : preferitiFiltrati.length === 0 ? (
          <EmptyState>
            {preferiti.length === 0
              ? "Nessun preferito ancora. Aggiungi un calciatore con il form qui sopra!"
              : "Nessun giocatore per i ruoli selezionati."}
          </EmptyState>
        ) : (
          <List>
            <AnimatePresence initial={false}>
              {preferitiFiltrati.map(p => (
                <Row
                  key={p.id}
                  $assegnato={p.assegnato}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <RoleDot $color={ROLE_COLORS[p.ruolo] || '#94A3B8'} />
                  <PlayerInfo $assegnato={p.assegnato}>
                    <PlayerName title={p.nome}>{p.nome}</PlayerName>
                    <PlayerSquadra>{p.squadra}</PlayerSquadra>
                  </PlayerInfo>
                  {p.assegnato && (
                    <AssegnatoBadge>
                      <CheckCircle2 size={12} />
                      Assegnato
                    </AssegnatoBadge>
                  )}
                  {showPrices ? (
                    <RowPriceInput
                      type="number"
                      min="0"
                      disabled={p.assegnato}
                      defaultValue={p.prezzo_target}
                      onBlur={(e) => handlePriceUpdate(p.id, e.target.value)}
                    />
                  ) : (
                    <MaskedPrice
                      type="button"
                      disabled={p.assegnato}
                      onClick={() => setShowPrices(true)}
                      title="Mostra prezzi"
                    >
                      ••
                    </MaskedPrice>
                  )}
                  <Coins size={12} color="#94A3B8" />
                  <DeleteButton onClick={() => handleDelete(p.id)} title="Rimuovi">
                    <Trash2 size={14} />
                  </DeleteButton>
                </Row>
              ))}
            </AnimatePresence>
          </List>
        )}
      </ListWrapper>

      <SecretNote>
        <Lock size={12} />
        I prezzi indicativi sono cifrati e visibili solo a te
      </SecretNote>
    </Container>
  );
};

export default Preferiti;
