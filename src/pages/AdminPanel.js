import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Users, 
  UserPlus, 
  Trash2, 
  Edit, 
  Shield, 
  ShieldOff,
  Eye,
  EyeOff,
  Save,
  X,
  Plus,
  AlertTriangle,
  Gavel,
  Play,
  Pause,
  ArrowLeftRight,
  Upload // ✅ AGGIUNTO
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import API_URL from '../config/api';

const AdminContainer = styled.div`
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

const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${props => props.theme.spacing.xl};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const Tab = styled.button`
  background: none;
  border: none;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  color: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.textSecondary};
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  border-bottom: 2px solid ${props => props.$active ? props.theme.colors.primary : 'transparent'};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const TabContent = styled.div`
  display: ${props => props.$active ? 'block' : 'none'};
`;

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: ${props => props.theme.spacing.xl};
`;

const Section = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.lg};
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const SectionTitle = styled.h2`
  color: ${props => props.theme.colors.text};
  font-size: 1.3rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

// ✅ AGGIUNTO: Nuovo styled component per upload
const UploadArea = styled.div`
  border: 2px dashed ${props => props.$isDragOver ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  padding: 2rem;
  text-align: center;
  background: ${props => props.$isDragOver ? 'rgba(45, 90, 135, 0.1)' : props.theme.colors.background};
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: rgba(45, 90, 135, 0.05);
  }
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const UploadText = styled.div`
  color: ${props => props.theme.colors.text};
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const UploadSubtext = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
`;

const PreviewTable = styled.div`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  overflow: hidden;
  margin-top: 1rem;
`;

const PreviewHeader = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr 150px 80px 100px;
  background: ${props => props.theme.colors.primary};
  color: white;
  padding: 1rem;
  font-weight: bold;
  font-size: 0.9rem;
  gap: 1rem;
`;

const PreviewRow = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr 150px 80px 100px;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  gap: 1rem;
  font-size: 0.9rem;

  &:hover {
    background: ${props => props.theme.colors.surfaceHover};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const Select = styled.select`
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  color: ${props => props.theme.colors.text};
  font-size: 0.95rem;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const AuctionCard = styled.div`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const AuctionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const AuctionTitle = styled.h3`
  color: ${props => props.theme.colors.text};
  font-weight: 600;
`;

const AuctionStatus = styled.span`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${props => {
    switch(props.status) {
      case 'attiva': return 'rgba(244, 67, 54, 0.1)';
      case 'chiusa': return 'rgba(76, 175, 80, 0.1)';
      default: return 'rgba(158, 158, 158, 0.1)';
    }
  }};
  color: ${props => {
    switch(props.status) {
      case 'attiva': return '#F44336';
      case 'chiusa': return '#4CAF50';
      default: return '#9E9E9E';
    }
  }};
`;

const AuctionInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
`;

const InfoLabel = styled.span`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.8rem;
`;

const InfoValue = styled.span`
  color: ${props => props.theme.colors.text};
  font-weight: 600;
`;

const AuctionActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
`;

const Button = styled(motion.button)`
  background: ${props => props.variant === 'danger' ? props.theme.colors.error : 
                      props.variant === 'success' ? props.theme.colors.success :
                      props.theme.colors.gradient};
  border: none;
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${props => props.theme.shadows.medium};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xl};
  gap: ${props => props.theme.spacing.md};
`;

const SearchBox = styled.input`
  background: ${props => props.theme.colors.surface};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  min-width: 300px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const AddButton = styled(motion.button)`
  background: ${props => props.theme.colors.gradient};
  border: none;
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  color: white;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};

  &:hover {
    transform: translateY(-2px);
  }
`;

const UsersTable = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 50px 1fr 200px 100px 100px 80px 80px 150px;
  background: ${props => props.theme.colors.primary};
  color: white;
  padding: ${props => props.theme.spacing.md};
  font-weight: 600;
  font-size: 0.9rem;
  gap: ${props => props.theme.spacing.sm};
`;

const TableRow = styled.div`
  display: grid;  
  grid-template-columns: 50px 1fr 200px 100px 100px 80px 80px 150px;
  padding: ${props => props.theme.spacing.md};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  
  &:hover {
    background: ${props => props.theme.colors.surfaceHover};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const Avatar = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
`;

const Username = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
`;

const AdminBadge = styled.span`
  background: ${props => props.theme.colors.warning};
  color: white;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 600;
`;

const StatCell = styled.div`
  text-align: center;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.xs};
`;

const ActionButton = styled(motion.button)`
  background: ${props => props.$danger ? props.theme.colors.error : props.$secondary ? props.theme.colors.warning : props.theme.colors.primary};
  border: none;
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.xs};
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;

  &:hover {
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${props => props.theme.spacing.lg};
`;

const ModalContent = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.xl};
  max-width: 500px;
  width: 100%;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ModalTitle = styled.h2`
  color: ${props => props.theme.colors.text};
  font-size: 1.5rem;
  font-weight: 700;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  font-size: 1.5rem;
  
  &:hover {
    color: ${props => props.theme.colors.text};
  }
`;

const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.md};
`;

const Label = styled.label`
  display: block;
  color: ${props => props.theme.colors.text};
  font-weight: 600;
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const Input = styled.input`
  width: 100%;
  background: ${props => props.theme.colors.background};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
`;

const ModalActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  justify-content: flex-end;
  margin-top: ${props => props.theme.spacing.lg};
`;

const ModalButton = styled(motion.button)`
  background: ${props => props.$primary ? props.theme.colors.gradient : 'transparent'};
  border: 2px solid ${props => props.$primary ? 'transparent' : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  color: ${props => props.$primary ? 'white' : props.theme.colors.text};
  font-weight: 600;
  cursor: pointer;

  &:hover {
    transform: translateY(-1px);
  }
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.textSecondary};
`;

const AdminPanel = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [aste, setAste] = useState([]);
  const [calciatori, setCalciatori] = useState([]);
  const [calciatoriAssegnati, setCalciatoriAssegnati] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState('auctions');
  
  // ✅ AGGIUNTO: Stati per upload
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState([]);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [showUploadPreview, setShowUploadPreview] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadTotal, setUploadTotal] = useState(0);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    crediti_totali: 350,
    is_admin: false
  });
  const [newAuction, setNewAuction] = useState({
    calciatore_id: '',
    durata_minuti: 1
  });
  const [manualAssignment, setManualAssignment] = useState({
    calciatore_id: '',
    utente_id: '',
    prezzo: ''
  });
  const [transferData, setTransferData] = useState({
    calciatore_id: '',
    nuovo_utente_id: '',
    nuovo_prezzo: ''
  });

  useEffect(() => {
    if (user?.is_admin) {
      fetchAllData();
    } else {
      setLoading(false);
    }
  }, [user]);

  // ✅ AGGIUNTO: Funzioni per upload
  const handleFileUpload = (file) => {
    if (!file) return;
    
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast.error('Formato file non valido. Usa solo file Excel (.xlsx, .xls)');
      return;
    }
    
    setUploadFile(file);
    processExcelFile(file);
  };

const processExcelFile = async (file) => {
  setUploadLoading(true);
  try {
    const formData = new FormData();
    formData.append('excel', file);
    
    const response = await axios.post(`${API_URL}/api/admin/process-excel`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    // Gestisci correttamente la preview
    const preview = response.data.preview || [];
    const total = response.data.total || preview.length;
    const errori = response.data.errori || [];
    
    // IMPORTANTE: Salva il totale reale in uno stato separato
    setUploadTotal(total); // Dovrai aggiungere questo stato
    
    // Mostra solo i primi 50 nella preview per performance
    setUploadPreview(preview.slice(0, 50));
    setShowUploadPreview(true);
    
    // Mostra info dettagliate
    if (errori.length > 0) {
      toast((t) => (
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
            ⚠️ File processato con avvisi
          </div>
          <div style={{ fontSize: '14px' }}>
            • {total} calciatori validi trovati<br/>
            • {errori.length} righe con errori (saranno ignorate)<br/>
            • {response.data.file_info?.righe_processate || total} righe totali processate
          </div>
        </div>
      ), {
        duration: 5000,
        style: {
          background: '#FFC107',
          color: '#333'
        }
      });
    } else {
      toast.success(`✅ File processato correttamente!\n📊 ${total} calciatori pronti per l'import`, {
        duration: 3000,
        style: {
          whiteSpace: 'pre-line'
        }
      });
    }
  } catch (error) {
    console.error('Errore processing file:', error);
    const message = error.response?.data?.error || 'Errore nel processamento del file';
    toast.error(message);
    setUploadFile(null);
    setUploadPreview([]);
  } finally {
    setUploadLoading(false);
  }
};


 const confirmUpload = async () => {
  if (!uploadFile) return;
  
  const totalDaProcessare = uploadTotal || uploadPreview.length;
  
  toast((t) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '20px' }}>📊</span>
        <strong>Conferma Aggiornamento Database</strong>
      </div>
      <div style={{ fontSize: '14px', color: '#666' }}>
        <strong>File:</strong> {uploadFile.name}<br/>
        <strong>Calciatori totali nel file:</strong> {totalDaProcessare}<br/>
        {uploadPreview.length < totalDaProcessare && (
          <small style={{ color: '#999' }}>
            (Preview mostra solo i primi {uploadPreview.length} per performance)
          </small>
        )}
        <br/><br/>
        
        L'operazione eseguirà:
        <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
          <li>Aggiornamento di TUTTI i {totalDaProcessare} calciatori esistenti</li>
          <li>Aggiunta di eventuali nuovi calciatori</li>
          <li>Rimozione calciatori non più presenti (solo se non assegnati)</li>
        </ul>
        
        <strong>Nota:</strong> I calciatori già assegnati agli utenti NON verranno toccati.
      </div>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '12px' }}>
        <button 
          onClick={() => toast.dismiss(t.id)}
          style={{
            background: 'transparent',
            border: '2px solid #ccc',
            borderRadius: '8px',
            padding: '8px 16px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Annulla
        </button>
        <button 
          onClick={async () => {
            toast.dismiss(t.id);
            await executeUpload();
          }}
          style={{
            background: '#2196F3',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            padding: '8px 16px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          ✅ Procedi con l'Aggiornamento
        </button>
      </div>
    </div>
  ), {
    duration: Infinity,
    position: 'top-center',
    style: {
      background: 'white',
      color: '#333',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
      border: '1px solid #eee',
      maxWidth: '520px'
    }
  });
};

  const executeUpload = async () => {
  try {
    const loadingToast = toast.loading('Aggiornamento database in corso...', {
      position: 'top-center'
    });
    
    const formData = new FormData();
    formData.append('excel', uploadFile);
    
    const response = await axios.post(`${API_URL}/api/admin/update-calciatori`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    toast.dismiss(loadingToast);
    
    // Estrai i dati dalla struttura corretta della risposta
    const risultato = response.data.risultato || response.data;
    const aggiornati = risultato.aggiornati || 0;
    const aggiunti = risultato.aggiunti || 0;
    const eliminati = risultato.eliminati || 0;
    const totaleProcessati = risultato.totale_processati || 0;
    
    // Costruisci il messaggio in base ai risultati effettivi
    let messaggio = '✅ Database aggiornato con successo!\n';
    
    if (aggiornati > 0) {
      messaggio += `\n📊 ${aggiornati} calciatori aggiornati`;
    }
    if (aggiunti > 0) {
      messaggio += `\n➕ ${aggiunti} nuovi calciatori aggiunti`;
    }
    if (eliminati > 0) {
      messaggio += `\n🗑️ ${eliminati} calciatori rimossi`;
    }
    if (aggiornati === 0 && aggiunti === 0 && eliminati === 0) {
      messaggio = '✅ Nessun aggiornamento necessario - i dati sono già aggiornati';
    }
    
    messaggio += `\n\n📁 Totale processati: ${totaleProcessati}`;
    
    toast.success(messaggio, {
      duration: 5000,
      position: 'top-center',
      style: {
        background: '#4CAF50',
        color: 'white',
        padding: '16px',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '600',
        whiteSpace: 'pre-line' // Per mantenere gli a capo
      }
    });
    
    // Reset dello stato
    setUploadFile(null);
    setUploadPreview([]);
    setUploadTotal(0); // Reset anche il totale
    setShowUploadPreview(false);
    
    // Ricarica i dati
    fetchAllData();
    
  } catch (error) {
    console.error('Errore upload:', error);
    const message = error.response?.data?.error || 'Errore nell\'aggiornamento del database';
    
    // Se ci sono dettagli sugli errori, mostrali
    if (error.response?.data?.errori && error.response.data.errori.length > 0) {
      const primiErrori = error.response.data.errori.slice(0, 3);
      toast.error(`❌ ${message}\n\nPrimi errori:\n${primiErrori.map(e => `• ${e.nome}: ${e.errore}`).join('\n')}`, {
        duration: 7000,
        position: 'top-center',
        style: {
          whiteSpace: 'pre-line'
        }
      });
    } else {
      toast.error(`❌ ${message}`, {
        duration: 5000,
        position: 'top-center'
      });
    }
  }
};

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  // Redirect se non admin
  if (!user?.is_admin) {
    return (
      <AdminContainer>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <AlertTriangle size={48} color="#F44336" />
          <h2>Accesso Negato</h2>
          <p>Non hai i permessi per accedere a questa sezione.</p>
        </div>
      </AdminContainer>
    );
  }

  const fetchCalciatoriAssegnati = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/calciatori?disponibile=false&limit=1000`);
     const calciatoriAssegnatiOrdinati = (response.data.calciatori || []).sort((a, b) => 
  a.nome.localeCompare(b.nome, 'it', { sensitivity: 'base' })
);
setCalciatoriAssegnati(calciatoriAssegnatiOrdinati);
    } catch (error) {
      console.error('Errore caricamento calciatori assegnati:', error);
    }
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [usersRes, asteRes, calciatoriRes] = await Promise.all([
        axios.get(`${API_URL}/api/utenti`),
        axios.get(`${API_URL}/api/aste`),
        axios.get(`${API_URL}/api/calciatori?disponibile=true&limit=1000`)
      ]);
      
      setUsers(usersRes.data.utenti || []);
      setAste(asteRes.data.aste || []);
      
      const calciatoriOrdinati = (calciatoriRes.data.calciatori || []).sort((a, b) => 
      a.nome.localeCompare(b.nome, 'it', { sensitivity: 'base' })
    );
    setCalciatori(calciatoriOrdinati);
    
    await fetchCalciatoriAssegnati();
  } catch (error) {
    console.error('Errore caricamento dati admin:', error);
    toast.error('Errore nel caricamento dei dati');
  } finally {
    setLoading(false);
  }
};

  const handleCreateAuction = async (e) => {
    e.preventDefault();
    
    if (!newAuction.calciatore_id) {
      toast.error('Seleziona un calciatore');
      return;
    }

    try {
      await axios.post(`${API_URL}/api/aste`, newAuction);
      toast.success('Asta creata con successo!');
      setNewAuction({ calciatore_id: '', durata_minuti: 1 });
      fetchAllData();
    } catch (error) {
      const message = error.response?.data?.error || 'Errore nella creazione dell\'asta';
      toast.error(message);
    }
  };

  const handleCloseAuction = (auctionId) => {
    toast((t) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Gavel size={20} color="#F44336" />
          <strong>Chiudere questa asta?</strong>
        </div>
        <div style={{ fontSize: '14px', color: '#666' }}>
          L'asta verrà chiusa immediatamente. Vuoi procedere?
        </div>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button 
            onClick={() => toast.dismiss(t.id)}
            style={{
              background: 'transparent',
              border: '2px solid #ccc',
              borderRadius: '8px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Annulla
          </button>
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              const loading = toast.loading('Chiusura asta...');
              try {
                await axios.post(`${API_URL}/api/aste/${auctionId}/chiudi`);
                toast.dismiss(loading);
                
                toast.success('🔒 Asta chiusa con successo! Vai ai risultati per vedere l\'esito.', {
                  duration: 3000,
                  position: 'top-center',
                  style: {
                    background: '#4CAF50',
                    color: 'white',
                    padding: '16px',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '600',
                  },
                });
                
                fetchAllData();
                
                setTimeout(() => {
                  window.location.href = `/risultati-asta/${auctionId}`;
                }, 2000);
                
              } catch (error) {
                toast.dismiss(loading);
                const message = error.response?.data?.error || 'Errore nella chiusura dell\'asta';
                
                if (message.includes('già chiusa') || message.includes('non trovata')) {
                  toast.success('🔒 Asta già chiusa! Reindirizzo ai risultati...', {
                    duration: 2000,
                    position: 'top-center',
                    style: {
                      background: '#2196F3',
                      color: 'white',
                      padding: '16px',
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: '600',
                    },
                  });
                  
                  setTimeout(() => {
                    window.location.href = `/risultati-asta/${auctionId}`;
                  }, 1500);
                } else {
                  toast.error(`❌ ${message}`, {
                    duration: 5000,
                    position: 'top-center',
                    style: {
                      background: '#F44336',
                      color: 'white',
                      padding: '16px',
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: '600',
                    },
                  });
                }
              }
            }}
            style={{
              background: '#F44336',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            Chiudi Asta
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
      position: 'top-center',
      style: {
        background: 'white',
        color: '#333',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
        border: '1px solid #eee',
        maxWidth: '400px'
      }
    });
  };

  const handleDeleteAllAuctions = () => {
  toast((t) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '20px' }}>⚠️</span>
        <strong>ATTENZIONE: Eliminazione Totale</strong>
      </div>
      <div style={{ fontSize: '14px', color: '#666' }}>
        Stai per eliminare <strong>TUTTE le aste</strong> (attive e chiuse) dal database. 
        Questa operazione è <strong>IRREVERSIBILE</strong> e cancellerà tutto lo storico. 
        Sei assolutamente sicuro?
      </div>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        <button 
          onClick={() => toast.dismiss(t.id)}
          style={{
            background: 'transparent',
            border: '2px solid #ccc',
            borderRadius: '8px',
            padding: '8px 16px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Annulla
        </button>
        <button 
          onClick={async () => {
            toast.dismiss(t.id);
            const loading = toast.loading('Eliminazione di tutte le aste...', {
              position: 'top-center'
            });
            try {
              await axios.delete(`${API_URL}/api/aste/delete-all`);
              toast.dismiss(loading);
              
              toast.success('🗑️ Tutte le aste sono state eliminate con successo!', {
                duration: 4000,
                position: 'top-center',
                style: {
                  background: '#4CAF50',
                  color: 'white',
                  padding: '16px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                },
              });
              
              fetchAllData(); // Ricarica i dati
              
            } catch (error) {
              toast.dismiss(loading);
              const message = error.response?.data?.error || 'Errore nell\'eliminazione delle aste';
              toast.error(`❌ ${message}`, {
                duration: 5000,
                position: 'top-center'
              });
            }
          }}
          style={{
            background: '#F44336',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            padding: '8px 16px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          SÌ, ELIMINA TUTTO
        </button>
      </div>
    </div>
  ), {
    duration: Infinity,
    position: 'top-center',
    style: {
      background: 'white',
      color: '#333',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
      border: '2px solid #F44336',
      maxWidth: '500px'
    }
  });
};

  const handleManualAssignment = async (e) => {
    e.preventDefault();
    
    if (!manualAssignment.calciatore_id || !manualAssignment.utente_id || !manualAssignment.prezzo) {
      toast.error('Compila tutti i campi per l\'assegnazione manuale');
      return;
    }

    if (parseInt(manualAssignment.prezzo) <= 0) {
      toast.error('Il prezzo deve essere maggiore di 0');
      return;
    }

    try {
      await axios.post(`${API_URL}/api/admin/assegna-giocatore`, {
        calciatore_id: manualAssignment.calciatore_id,
        utente_id: manualAssignment.utente_id,
        prezzo_acquisto: parseInt(manualAssignment.prezzo)
      });
      
      toast.success('Giocatore assegnato manualmente con successo!');
      setManualAssignment({ calciatore_id: '', utente_id: '', prezzo: '' });
      fetchAllData();
    } catch (error) {
      const message = error.response?.data?.error || 'Errore nell\'assegnazione manuale';
      toast.error(message);
    }
  };

  const handleTransferPlayer = async (e) => {
    e.preventDefault();
    
    if (!transferData.calciatore_id || !transferData.nuovo_utente_id || !transferData.nuovo_prezzo) {
      toast.error('Compila tutti i campi per il trasferimento');
      return;
    }

    if (parseInt(transferData.nuovo_prezzo) <= 0) {
      toast.error('Il prezzo deve essere maggiore di 0');
      return;
    }

    try {
      await axios.post(`${API_URL}/api/admin/trasferisci-giocatore`, {
        calciatore_id: transferData.calciatore_id,
        nuovo_utente_id: transferData.nuovo_utente_id,
        nuovo_prezzo: parseInt(transferData.nuovo_prezzo)
      });
      
      toast.success('Giocatore trasferito con successo!');
      setTransferData({ calciatore_id: '', nuovo_utente_id: '', nuovo_prezzo: '' });
      fetchAllData();
    } catch (error) {
      const message = error.response?.data?.error || 'Errore nel trasferimento';
      toast.error(message);
    }
  };

  const handleReleasePlayer = (calciatore_id, nome_calciatore) => {
    toast((t) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>⚠️</span>
          <strong>Conferma Liberazione</strong>
        </div>
        <div style={{ fontSize: '14px', color: '#666' }}>
          Vuoi davvero liberare <strong>{nome_calciatore}</strong>? Il calciatore tornerà disponibile per le aste.
        </div>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button 
            onClick={() => toast.dismiss(t.id)}
            style={{
              background: 'transparent',
              border: '2px solid #ccc',
              borderRadius: '8px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Annulla
          </button>
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const loading = toast.loading('Liberazione in corso...');
                await axios.post(`${API_URL}/api/admin/libera-giocatore`, {
                  calciatore_id: calciatore_id
                });
                toast.dismiss(loading);
                toast.success(`${nome_calciatore} è stato liberato con successo!`);
                fetchAllData();
              } catch (error) {
                toast.error('Errore nella liberazione del giocatore');
              }
            }}
            style={{
              background: '#F44336',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            Libera
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
      position: 'top-center',
      style: {
        background: 'white',
        color: '#333',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
        border: '1px solid #eee',
        maxWidth: '400px'
      }
    });
  };

  const openModal = (mode, user = null) => {
    setModalMode(mode);
    setSelectedUser(user);
    
    if (mode === 'add') {
      setFormData({
        username: '',
        email: '',
        password: '',
        crediti_totali: 350,
        is_admin: false
      });
    } else if (mode === 'edit' && user) {
      setFormData({
        username: user.username,
        email: user.email,
        password: '',
        crediti_totali: user.crediti_totali,
        is_admin: user.is_admin
      });
    }
    
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      crediti_totali: 350,
      is_admin: false
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (modalMode === 'add') {
        await axios.post(`${API_URL}/api/auth/register`, formData);
        toast.success('Utente creato con successo!');
      } else if (modalMode === 'edit') {
        const updateData = { ...formData };
        if (!updateData.password) {
          delete updateData.password;
        }
        
        await axios.put(`${API_URL}/api/admin/utenti/${selectedUser.id}`, updateData);
        toast.success('Utente aggiornato con successo!');
      }
      
      closeModal();
      fetchAllData();
    } catch (error) {
      const message = error.response?.data?.error || 'Errore nell\'operazione';
      toast.error(message);
    }
  };

  const handleDelete = async (user) => {
    if (!user || !user.id) {
      toast.error('Errore: utente non valido o senza ID');
      return;
    }

    toast((t) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>⚠️</span>
          <strong>Conferma Eliminazione</strong>
        </div>
        <div style={{ fontSize: '14px', color: '#666' }}>
          Sei sicuro di voler eliminare {user.username}? Questa azione non può essere annullata.
        </div>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button 
            onClick={() => toast.dismiss(t.id)}
            style={{
              background: 'transparent',
              border: '2px solid #ccc',
              borderRadius: '8px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Annulla
          </button>
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const loadingToast = toast.loading('Eliminazione in corso...');
                await axios.delete(`${API_URL}/api/admin/utenti/${user.id}`);
                toast.dismiss(loadingToast);
                toast.success(`✅ ${user.username} eliminato con successo!`);
                fetchAllData();
              } catch (error) {
                const message = error.response?.data?.error || 'Errore nell\'eliminazione';
                toast.error(`❌ ${message}`);
              }
            }}
            style={{
              background: '#F44336',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            Elimina
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
      position: 'top-center'
    });
  };

  const toggleAdmin = async (user) => {
    try {
      await axios.put(`${API_URL}/api/admin/utenti/${user.id}`, {
        is_admin: !user.is_admin
      });
      toast.success(`${user.username} ${!user.is_admin ? 'promosso ad' : 'retrocesso da'} amministratore`);
      fetchAllData();
    } catch (error) {
      const message = error.response?.data?.error || 'Errore nell\'aggiornamento';
      toast.error(message);
    }
  };

  // Filtra utenti in base alla ricerca
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeAuctions = aste.filter(a => a.stato === 'attiva');

  if (loading) {
    return (
      <AdminContainer>
        <LoadingContainer>
          Caricamento pannello amministratore...
        </LoadingContainer>
      </AdminContainer>
    );
  }

  return (
    <AdminContainer>
      <Header>
        <Title>
          <Settings size={32} />
          Pannello Admin
        </Title>
        <Subtitle>
          Gestisci utenti, aste, calciatori e configurazioni del sistema
        </Subtitle>
      </Header>

      <TabsContainer>
        <Tab 
          $active={activeTab === 'users'} 
          onClick={() => setActiveTab('users')}
        >
          <Users size={18} />
          Gestione Utenti
        </Tab>
        <Tab 
          $active={activeTab === 'auctions'} 
          onClick={() => setActiveTab('auctions')}
        >
          <Gavel size={18} />
          Gestione Aste
        </Tab>
        <Tab 
          $active={activeTab === 'manual'} 
          onClick={() => setActiveTab('manual')}
        >
          <Edit size={18} />
          Assegnazione Manuale
        </Tab>
        <Tab 
          $active={activeTab === 'transfers'} 
          onClick={() => setActiveTab('transfers')}
        >
          <ArrowLeftRight size={18} />
          Gestione Trasferimenti
        </Tab>
        {/* ✅ AGGIUNTO: Nuovo tab */}
        <Tab 
          $active={activeTab === 'upload'} 
          onClick={() => setActiveTab('upload')}
        >
          <Upload size={18} />
          Aggiorna Calciatori
        </Tab>
      </TabsContainer>

      {/* ✅ AGGIUNTO: Nuovo TabContent per upload */}
      <TabContent $active={activeTab === 'upload'}>
        <SectionGrid>
          {/* Upload File */}
          <Section>
            <SectionHeader>
              <SectionTitle>
                <Upload size={20} />
                Carica File Excel
              </SectionTitle>
            </SectionHeader>

            <div style={{ marginBottom: '2rem' }}>
              <Label>Seleziona file Excel con i calciatori aggiornati</Label>
              
              <UploadArea
                $isDragOver={isDragOver}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('fileInput').click()}
              >
                <UploadIcon>📁</UploadIcon>
                <UploadText>
                  {uploadFile ? `File: ${uploadFile.name}` : 'Trascina qui il file Excel o clicca per selezionare'}
                </UploadText>
                <UploadSubtext>
                  Formati supportati: .xlsx, .xls • Max 10MB
                </UploadSubtext>
              </UploadArea>

              <input
                id="fileInput"
                type="file"
                accept=".xlsx,.xls"
                style={{ display: 'none' }}
                onChange={(e) => handleFileUpload(e.target.files[0])}
              />
            </div>

            {uploadFile && (
              <div style={{
                background: 'rgba(33, 150, 243, 0.1)',
                border: '1px solid rgba(33, 150, 243, 0.3)',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1rem'
              }}>
                <div style={{ color: '#2196F3', fontWeight: 'bold' }}>
                  📁 File selezionato: {uploadFile.name}
                </div>
                <div style={{ color: '#B0BEC5', fontSize: '0.9rem' }}>
                  Dimensione: {(uploadFile.size / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
            )}

            {uploadLoading && (
              <div style={{ 
                textAlign: 'center', 
                color: '#2196F3',
                padding: '2rem' 
              }}>
                <div>⏳ Processamento file in corso...</div>
              </div>
            )}
          </Section>

          {/* Informazioni Upload */}
          <Section>
            <SectionHeader>
              <SectionTitle>
                ℹ️ Informazioni Upload
              </SectionTitle>
            </SectionHeader>

            <div style={{ color: '#B0BEC5', fontSize: '0.9rem', lineHeight: '1.6' }}>
              <h4 style={{ color: '#FFFFFF', marginBottom: '1rem' }}>
                Formato file richiesto:
              </h4>
              
              <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                <li>📊 <strong>Colonna A:</strong> ID calciatore</li>
                <li>📝 <strong>Colonna B:</strong> Ruolo (P, D, C, A)</li>
                <li>👤 <strong>Colonna D:</strong> Nome calciatore</li>
                <li>🏟️ <strong>Colonna E:</strong> Squadra</li>
                <li>💰 <strong>Colonna F:</strong> Quotazione</li>
              </ul>

              <div style={{ 
                background: 'rgba(255, 193, 7, 0.1)', 
                border: '1px solid rgba(255, 193, 7, 0.3)',
                borderRadius: '8px',
                padding: '1rem',
                marginTop: '1rem'
              }}>
                <strong style={{ color: '#FFC107' }}>⚠️ Importante:</strong>
                <br />
                - L'upload aggiornerà tutti i calciatori esistenti
                <br />
                - I calciatori già assegnati mantengono il loro proprietario
                <br />
                - Solo quotazioni e dati base vengono aggiornati
              </div>
            </div>
          </Section>
        </SectionGrid>

        {/* Preview Upload */}
        {showUploadPreview && uploadPreview.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '1rem' 
            }}>
              <h3 style={{ color: '#FFFFFF' }}>
                📋 Preview Aggiornamento ({uploadPreview.length} calciatori)
              </h3>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Button
                  onClick={() => setShowUploadPreview(false)}
                  style={{ background: '#666' }}
                >
                  <X size={16} />
                  Annulla
                </Button>
                <Button
                  onClick={confirmUpload}
                  variant="success"
                >
                  <Save size={16} />
                  Conferma Aggiornamento
                </Button>
              </div>
            </div>

            <PreviewTable>
              <PreviewHeader>
                <div>ID</div>
                <div>Nome</div>
                <div>Squadra</div>
                <div>Ruolo</div>
                <div>Quotazione</div>
              </PreviewHeader>

              {uploadPreview.map((player, index) => (
                <PreviewRow key={index}>
                  <div style={{ color: '#B0BEC5' }}>{player.id}</div>
                  <div style={{ color: '#FFFFFF' }}>{player.nome}</div>
                  <div style={{ color: '#B0BEC5' }}>{player.squadra}</div>
                  <div style={{ 
                    color: player.ruolo === 'P' ? '#4CAF50' : 
                          player.ruolo === 'D' ? '#2196F3' :
                          player.ruolo === 'C' ? '#FFC107' : '#F44336'
                  }}>
                    {player.ruolo}
                  </div>
                  <div style={{ color: '#FFA726', fontWeight: 'bold' }}>
                    {player.quotazione}
                  </div>
                </PreviewRow>
              ))}

              {uploadPreview.length > 50 && (
                <div style={{
                  textAlign: 'center',
                  padding: '1rem',
                  color: '#B0BEC5',
                  borderTop: '1px solid #333'
                }}>
                  ... e altri {uploadPreview.length - 50} calciatori
                </div>
              )}
            </PreviewTable>
          </div>
        )}
      </TabContent>

      {/* Tab Gestione Utenti */}
      <TabContent $active={activeTab === 'users'}>
        <ActionBar>
          <SearchBox
            type="text"
            placeholder="Cerca utenti per nome o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <AddButton
            onClick={() => openModal('add')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <UserPlus size={18} />
            Aggiungi Utente
          </AddButton>
        </ActionBar>

        <UsersTable>
          <TableHeader>
            <div></div>
            <div>Utente</div>
            <div>Email</div>
            <div>Crediti</div>
            <div>Spesi</div>
            <div>Giocatori</div>
            <div>Ruolo</div>
            <div>Azioni</div>
          </TableHeader>
          
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <Avatar>
                {user.username.charAt(0).toUpperCase()}
              </Avatar>
              
              <Username>
                {user.username}
                {user.is_admin && <AdminBadge>ADMIN</AdminBadge>}
              </Username>
              
              <StatCell style={{ textAlign: 'left' }}>
                {user.email}
              </StatCell>
              
              <StatCell>
                {user.crediti_totali}
              </StatCell>
              
              <StatCell style={{ color: user.crediti_spesi > 0 ? '#F44336' : '#4CAF50' }}>
                {user.crediti_spesi || 0}
              </StatCell>
              
              <StatCell>
                {user.calciatori_acquistati || 0}
              </StatCell>
              
              <StatCell>
                {user.is_admin ? (
                  <Shield size={16} color="#FFA726" />
                ) : (
                  <Users size={16} color="#B0BEC5" />
                )}
              </StatCell>
              
              <ActionButtons>
                <ActionButton
                  onClick={() => openModal('edit', user)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Modifica utente"
                  disabled={!user.id}
                >
                  <Edit size={14} />
                </ActionButton>
                
                <ActionButton
                  $secondary
                  onClick={() => toggleAdmin(user)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title={user.is_admin ? "Rimuovi admin" : "Rendi admin"}
                  disabled={!user.id}
                >
                  {user.is_admin ? <ShieldOff size={14} /> : <Shield size={14} />}
                </ActionButton>
                
                <ActionButton
                  $danger
                  onClick={() => handleDelete(user)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Elimina utente"
                  disabled={!user.id}
                >
                  <Trash2 size={14} />
                </ActionButton>
              </ActionButtons>
            </TableRow>
          ))}
        </UsersTable>
      </TabContent>

      {/* Tab Gestione Aste */}
      <TabContent $active={activeTab === 'auctions'}>
        <SectionGrid>
          {/* Creazione Aste */}
          <Section>
            <SectionHeader>
              <SectionTitle>
                <Gavel size={20} />
                Crea Nuova Asta
              </SectionTitle>
            </SectionHeader>

            <Form onSubmit={handleCreateAuction}>
              <FormGroup>
                <Label>Calciatore</Label>
                <Select
                  value={newAuction.calciatore_id}
                  onChange={(e) => setNewAuction({
                    ...newAuction,
                    calciatore_id: e.target.value
                  })}
                  required
                >
                  <option value="">Seleziona calciatore...</option>
                  {calciatori.map(player => (
                    <option key={player.id} value={player.id}>
                      {player.nome} ({player.squadra}) - {player.ruolo}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Durata (minuti)</Label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={newAuction.durata_minuti}
                  onChange={(e) => setNewAuction({
                    ...newAuction,
                    durata_minuti: parseInt(e.target.value)
                  })}
                />
              </FormGroup>

              <Button type="submit" whileHover={{ scale: 1.02 }}>
                <Plus size={16} />
                Crea Asta
              </Button>
            </Form>
          </Section>

          {/* Statistiche */}
          <Section>
            <SectionHeader>
              <SectionTitle>
                📊 Statistiche Sistema
              </SectionTitle>
            </SectionHeader>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
  <InfoItem>
    <InfoLabel>Utenti Registrati</InfoLabel>
    <InfoValue>{users.length}</InfoValue>
  </InfoItem>
  <InfoItem>
    <InfoLabel>Aste Totali</InfoLabel>
    <InfoValue>{aste.length}</InfoValue>
  </InfoItem>
  <InfoItem>
    <InfoLabel>Aste Attive</InfoLabel>
    <InfoValue>{activeAuctions.length}</InfoValue>
  </InfoItem>
  <InfoItem>
    <InfoLabel>Calciatori Disponibili</InfoLabel>
    <InfoValue>{calciatori.length}</InfoValue>
  </InfoItem>
</div>

{/* Pulsante Elimina Tutte le Aste */}
{aste.length > 0 && (
  <div style={{ marginTop: '2rem', textAlign: 'center' }}>
    <Button
      variant="danger"
      onClick={handleDeleteAllAuctions}
      whileHover={{ scale: 1.02 }}
      style={{ 
        background: '#F44336',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        margin: '0 auto'
      }}
    >
      <Trash2 size={16} />
      Elimina Tutte le Aste ({aste.length})
    </Button>
    <div style={{ 
      color: '#F44336', 
      fontSize: '0.8rem', 
      marginTop: '0.5rem',
      fontStyle: 'italic' 
    }}>
      ⚠️ Operazione irreversibile - elimina tutto lo storico
    </div>
  </div>
)}
          </Section>
        </SectionGrid>

        {/* Aste Attive */}
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#FFFFFF' }}>
            Aste Attive ({activeAuctions.length})
          </h3>
          
          {activeAuctions.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              color: '#B0BEC5', 
              padding: '2rem',
              background: '#1A1A1A',
              borderRadius: '8px'
            }}>
              Nessuna asta attiva
            </div>
          ) : (
            activeAuctions.map(auction => (
              <AuctionCard key={auction.id}>
                <AuctionHeader>
                  <AuctionTitle>{auction.calciatore_nome}</AuctionTitle>
                  <AuctionStatus status={auction.stato}>
                    {auction.stato.toUpperCase()}
                  </AuctionStatus>
                </AuctionHeader>

                <AuctionInfo>
                  <InfoItem>
                    <InfoLabel>Squadra</InfoLabel>
                    <InfoValue>{auction.squadra}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Ruolo</InfoLabel>
                    <InfoValue>{auction.ruolo}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Offerte</InfoLabel>
                    <InfoValue>{auction.numero_offerte}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Offerta Max</InfoLabel>
                    <InfoValue>🔒 Segreta</InfoValue>
                  </InfoItem>
                </AuctionInfo>

                <AuctionActions>
                  <Button
                    variant="danger"
                    onClick={() => handleCloseAuction(auction.id)}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Pause size={16} />
                    Chiudi Asta
                  </Button>
                </AuctionActions>
              </AuctionCard>
            ))
          )}
        </div>

        {/* Aste Chiuse Recenti */}
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            📋 Ultime Aste Chiuse (Ultime 5)
          </h3>
          
          {aste.filter(a => a.stato === 'chiusa').slice(0, 5).length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              color: '#B0BEC5', 
              padding: '2rem',
              background: '#1A1A1A',
              borderRadius: '8px'
            }}>
              Nessuna asta chiusa recentemente
            </div>
          ) : (
            aste
              .filter(a => a.stato === 'chiusa')
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .slice(0, 5)
              .map(auction => (
                <AuctionCard key={auction.id} style={{ 
                  border: auction.numero_offerte > 0 ? '1px solid #FFC107' : '1px solid #9E9E9E',
                  background: auction.numero_offerte > 0 ? 'rgba(255, 193, 7, 0.05)' : 'rgba(158, 158, 158, 0.05)'
                }}>
                  <AuctionHeader>
                    <AuctionTitle style={{ 
                      color: auction.numero_offerte > 0 ? '#FFC107' : '#9E9E9E',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      {auction.numero_offerte > 0 ? '🔒' : '📭'} {auction.calciatore_nome}
                    </AuctionTitle>
                    <AuctionStatus status="chiusa">
                      CHIUSA
                    </AuctionStatus>
                  </AuctionHeader>

                  <AuctionInfo>
                    <InfoItem>
                      <InfoLabel>Squadra</InfoLabel>
                      <InfoValue>{auction.squadra}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>Ruolo</InfoLabel>
                      <InfoValue>{auction.ruolo}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>Partecipanti</InfoLabel>
                      <InfoValue>{auction.numero_offerte}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>Offerta Max</InfoLabel>
                      <InfoValue>
                        {auction.numero_offerte > 0 ? '🔒 Segreta' : '0 crediti'}
                      </InfoValue>
                    </InfoItem>
                  </AuctionInfo>

                  <div style={{
                    background: auction.numero_offerte > 0 ? 'rgba(255, 193, 7, 0.1)' : 'rgba(158, 158, 158, 0.1)',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    textAlign: 'center'
                  }}>
                    {auction.numero_offerte > 0 ? (
                      <div style={{ color: '#FFC107' }}>
                        🔒 <strong>Asta Completata</strong>
                        <br />
                        <small>Clicca "Vedi Risultati" per scoprire l'esito</small>
                      </div>
                    ) : (
                      <div style={{ color: '#9E9E9E' }}>
                        📭 <strong>Nessuna Offerta</strong>
                        <br />
                        <small>Calciatore rimasto disponibile</small>
                      </div>
                    )}
                  </div>

                  <AuctionActions>
                    <Button
                      variant="success"
                      onClick={() => {
                        window.location.href = `/risultati-asta/${auction.id}`;
                      }}
                      whileHover={{ scale: 1.02 }}
                      style={{ background: '#2D5A87' }}
                    >
                      <Eye size={16} />
                      Vedi Risultati
                    </Button>
                  </AuctionActions>
                </AuctionCard>
              ))
          )}
        </div>
      </TabContent>

      {/* Tab Assegnazione Manuale */}
      <TabContent $active={activeTab === 'manual'}>
        <SectionGrid>
          {/* Form Assegnazione Manuale */}
          <Section>
            <SectionHeader>
              <SectionTitle>
                <Edit size={20} />
                Assegna Giocatore Manualmente
              </SectionTitle>
            </SectionHeader>

            <Form onSubmit={handleManualAssignment}>
              <FormGroup>
                <Label>Calciatore</Label>
                <Select
                  value={manualAssignment.calciatore_id}
                  onChange={(e) => setManualAssignment({
                    ...manualAssignment,
                    calciatore_id: e.target.value
                  })}
                  required
                >
                  <option value="">Seleziona calciatore...</option>
                  {calciatori.map(player => (
                    <option key={player.id} value={player.id}>
                      {player.nome} ({player.squadra}) - {player.ruolo}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Utente</Label>
                <Select
                  value={manualAssignment.utente_id}
                  onChange={(e) => setManualAssignment({
                    ...manualAssignment,
                    utente_id: e.target.value
                  })}
                  required
                >
                  <option value="">Seleziona utente...</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.username} ({(user.crediti_totali - (user.crediti_spesi || 0))} crediti disponibili)
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Prezzo di Acquisto</Label>
                <Input
                  type="number"
                  min="1"
                  value={manualAssignment.prezzo}
                  onChange={(e) => setManualAssignment({
                    ...manualAssignment,
                    prezzo: e.target.value
                  })}
                  placeholder="Inserisci prezzo..."
                  required
                />
              </FormGroup>

              <Button type="submit" whileHover={{ scale: 1.02 }}>
                <Plus size={16} />
                Assegna Giocatore
              </Button>
            </Form>
          </Section>

          {/* Informazioni Assegnazione */}
          <Section>
            <SectionHeader>
              <SectionTitle>
                ℹ️ Informazioni
              </SectionTitle>
            </SectionHeader>

            <div style={{ color: '#B0BEC5', fontSize: '0.9rem', lineHeight: '1.6' }}>
              <h4 style={{ color: '#FFFFFF', marginBottom: '1rem' }}>Quando usare l'assegnazione manuale:</h4>
              
              <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                <li>🤝 Offerte identiche tra più utenti</li>
                <li>🛠️ Correzione di errori nelle aste</li>
                <li>⚡ Assegnazioni fuori asta per casi speciali</li>
                <li>🎯 Gestione di situazioni eccezionali</li>
              </ul>

              <div style={{ 
                background: 'rgba(255, 193, 7, 0.1)', 
                border: '1px solid rgba(255, 193, 7, 0.3)',
                borderRadius: '8px',
                padding: '1rem',
                marginTop: '1rem'
              }}>
                <strong style={{ color: '#FFC107' }}>⚠️ Attenzione:</strong>
                <br />
                L'assegnazione manuale bypassa il sistema d'asta e assegna direttamente il giocatore all'utente specificato al prezzo indicato.
              </div>
            </div>
          </Section>
        </SectionGrid>

        {/* Aste Chiuse Senza Vincitore */}
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#FFFFFF' }}>
            🤔 Aste Problematiche (Senza Vincitore Chiaro)
          </h3>
          
          {aste.filter(a => a.stato === 'chiusa' && a.numero_offerte > 0 && !a.vincitore_id).length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              color: '#B0BEC5', 
              padding: '2rem',
              background: '#1A1A1A',
              borderRadius: '8px'
            }}>
              Nessuna asta problematica al momento
            </div>
          ) : (
            aste
              .filter(a => a.stato === 'chiusa' && a.numero_offerte > 0 && !a.vincitore_id)
              .map(auction => (
                <AuctionCard key={auction.id} style={{ border: '2px solid #FFC107' }}>
                  <AuctionHeader>
                    <AuctionTitle style={{ color: '#FFC107' }}>
                      ⚠️ {auction.calciatore_nome}
                    </AuctionTitle>
                    <AuctionStatus status="problematica" style={{ 
                      background: 'rgba(255, 193, 7, 0.1)',
                      color: '#FFC107' 
                    }}>
                      RICHIEDE INTERVENTO
                    </AuctionStatus>
                  </AuctionHeader>

                  <AuctionInfo>
                    <InfoItem>
                      <InfoLabel>Squadra</InfoLabel>
                      <InfoValue>{auction.squadra}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>Ruolo</InfoLabel>
                      <InfoValue>{auction.ruolo}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>Offerte</InfoLabel>
                      <InfoValue>{auction.numero_offerte}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>Offerta Max</InfoLabel>
                      <InfoValue>{auction.offerta_massima || 0}</InfoValue>
                    </InfoItem>
                  </AuctionInfo>

                  <div style={{ 
                    background: 'rgba(255, 193, 7, 0.1)', 
                    padding: '1rem', 
                    borderRadius: '8px',
                    marginTop: '1rem',
                    color: '#FFC107',
                    fontSize: '0.9rem'
                  }}>
                    💡 Questa asta potrebbe avere offerte identiche o altre problematiche. 
                    Usa l'assegnazione manuale sopra per risolvere.
                  </div>
                </AuctionCard>
              ))
          )}
        </div>
      </TabContent>

      {/* Tab Gestione Trasferimenti */}
      <TabContent $active={activeTab === 'transfers'}>
        <SectionGrid>
          {/* Form Trasferimento */}
          <Section>
            <SectionHeader>
              <SectionTitle>
                <ArrowLeftRight size={20} />
                Trasferisci Giocatore
              </SectionTitle>
            </SectionHeader>

            <Form onSubmit={handleTransferPlayer}>
              <FormGroup>
                <Label>Calciatore da Trasferire</Label>
                <Select
                  value={transferData.calciatore_id}
                  onChange={(e) => setTransferData({
                    ...transferData,
                    calciatore_id: e.target.value
                  })}
                  required
                >
                  <option value="">Seleziona calciatore assegnato...</option>
                  {calciatoriAssegnati.map(player => (
                    <option key={player.id} value={player.id}>
                      {player.nome} ({player.squadra}) - {player.ruolo} 
                      {player.proprietario && ` - Attualmente di ${player.proprietario}`}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Nuovo Proprietario</Label>
                <Select
                  value={transferData.nuovo_utente_id}
                  onChange={(e) => setTransferData({
                    ...transferData,
                    nuovo_utente_id: e.target.value
                  })}
                  required
                >
                  <option value="">Seleziona nuovo utente...</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.username} ({(user.crediti_totali - (user.crediti_spesi || 0))} crediti disponibili)
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Nuovo Prezzo</Label>
                <Input
                  type="number"
                  min="1"
                  value={transferData.nuovo_prezzo}
                  onChange={(e) => setTransferData({
                    ...transferData,
                    nuovo_prezzo: e.target.value
                  })}
                  placeholder="Inserisci nuovo prezzo..."
                  required
                />
              </FormGroup>

              <Button type="submit" whileHover={{ scale: 1.02 }}>
                <ArrowLeftRight size={16} />
                Trasferisci Giocatore
              </Button>
            </Form>
          </Section>

          {/* Informazioni Trasferimenti */}
          <Section>
            <SectionHeader>
              <SectionTitle>
                ℹ️ Informazioni Trasferimenti
              </SectionTitle>
            </SectionHeader>

            <div style={{ color: '#B0BEC5', fontSize: '0.9rem', lineHeight: '1.6' }}>
              <h4 style={{ color: '#FFFFFF', marginBottom: '1rem' }}>Operazioni disponibili:</h4>
              
              <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                <li>🔄 <strong>Trasferimento:</strong> Sposta un giocatore da un utente ad un altro</li>
                <li>🆓 <strong>Liberazione:</strong> Rimuovi un giocatore dalla rosa (torna disponibile)</li>
                <li>💰 <strong>Aggiustamento crediti:</strong> I crediti vengono ricalcolati automaticamente</li>
                <li>📊 <strong>Verifica crediti:</strong> Controlla che il nuovo proprietario abbia crediti sufficienti</li>
              </ul>

              <div style={{ 
                background: 'rgba(33, 150, 243, 0.1)', 
                border: '1px solid rgba(33, 150, 243, 0.3)',
                borderRadius: '8px',
                padding: '1rem',
                marginTop: '1rem'
              }}>
                <strong style={{ color: '#2196F3' }}>💡 Nota:</strong>
                <br />
                Il trasferimento aggiorna automaticamente i crediti spesi di entrambi gli utenti. 
                Il vecchio proprietario recupera i crediti, il nuovo li spende.
              </div>
            </div>
          </Section>
        </SectionGrid>

        {/* Lista Giocatori Assegnati */}
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#FFFFFF' }}>
            👥 Tutti i Giocatori Assegnati ({calciatoriAssegnati.length})
          </h3>
          
          {calciatoriAssegnati.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              color: '#B0BEC5', 
              padding: '2rem',
              background: '#1A1A1A',
              borderRadius: '8px'
            }}>
              Nessun giocatore assegnato al momento
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '1rem'
            }}>
              {calciatoriAssegnati.map(player => (
                <div
                  key={player.id}
                  style={{
                    background: '#1A1A1A',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    padding: '1rem'
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    marginBottom: '0.5rem'
                  }}>
                    <div>
                      <h4 style={{ color: '#FFFFFF', margin: '0 0 0.25rem 0' }}>
                        {player.nome}
                      </h4>
                      <div style={{ color: '#B0BEC5', fontSize: '0.9rem' }}>
                        {player.squadra} • {player.ruolo} • Quot. {player.quotazione}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#4CAF50', fontWeight: 'bold' }}>
                        {player.proprietario}
                      </div>
                      <div style={{ color: '#FFA726', fontSize: '0.9rem' }}>
                        {player.prezzo_acquisto} crediti
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    gap: '0.5rem', 
                    marginTop: '1rem' 
                  }}>
                    <Button
                      onClick={() => setTransferData({
                        calciatore_id: player.id,
                        nuovo_utente_id: '',
                        nuovo_prezzo: player.prezzo_acquisto?.toString() || ''
                      })}
                      style={{ 
                        background: '#2196F3', 
                        fontSize: '0.8rem', 
                        padding: '0.5rem 1rem',
                        flex: 1 
                      }}
                    >
                      <ArrowLeftRight size={14} />
                      Trasferisci
                    </Button>
                    
                    <Button
                      variant="danger"
                      onClick={() => handleReleasePlayer(player.id, player.nome)}
                      style={{ 
                        fontSize: '0.8rem', 
                        padding: '0.5rem 1rem' 
                      }}
                    >
                      <Trash2 size={14} />
                      Libera
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </TabContent>

      {/* Modal per aggiungere/modificare utente */}
      {showModal && (
        <Modal
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
        >
          <ModalContent
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <ModalHeader>
              <ModalTitle>
                {modalMode === 'add' ? 'Aggiungi Nuovo Utente' : 'Modifica Utente'}
              </ModalTitle>
              <CloseButton onClick={closeModal}>×</CloseButton>
            </ModalHeader>

            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Username</Label>
                <Input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Password {modalMode === 'edit' && '(lascia vuoto per non modificare)'}</Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required={modalMode === 'add'}
                />
              </FormGroup>

              <FormGroup>
                <Label>Crediti Totali</Label>
                <Input
                  type="number"
                  value={formData.crediti_totali}
                  onChange={(e) => setFormData({...formData, crediti_totali: parseInt(e.target.value)})}
                  min="0"
                  required
                />
              </FormGroup>

              <FormGroup>
                <CheckboxGroup>
                  <Checkbox
                    type="checkbox"
                    checked={formData.is_admin}
                    onChange={(e) => setFormData({...formData, is_admin: e.target.checked})}
                  />
                  <Label>Amministratore</Label>
                </CheckboxGroup>
              </FormGroup>

              <ModalActions>
                <ModalButton type="button" onClick={closeModal}>
                  Annulla
                </ModalButton>
                <ModalButton $primary type="submit">
                  {modalMode === 'add' ? 'Crea Utente' : 'Salva Modifiche'}
                </ModalButton>
              </ModalActions>
            </form>
          </ModalContent>
        </Modal>
      )}
    </AdminContainer>
  );
};

export default AdminPanel;