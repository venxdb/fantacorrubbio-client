import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Gavel, Clock, Users, Coins, Trophy, Play, Pause, Timer, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import API_URL from '../config/api';

const AstaContainer = styled.div`
  padding: ${props => props.theme.spacing.md} 0;
  max-width: 1000px;
  margin: 0 auto;
  
  /* 🎯 TABLET: Container ottimizzato 481px-1200px */
  @media (min-width: 481px) and (max-width: 1200px) {
    padding: 8px !important;
    max-width: 100% !important;
    height: 100vh !important;
    overflow-y: auto !important;
    font-size: 0.85rem !important;
  }
  
  @media (max-width: 768px) {
    padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.xs};
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.lg};
  
  /* 🎯 TABLET: Header compatto */
  @media (min-width: 481px) and (max-width: 1200px) {
    margin-bottom: 12px !important;
  }
  
  @media (max-width: 768px) {
    margin-bottom: ${props => props.theme.spacing.md};
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  background: ${props => props.theme.colors.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${props => props.theme.spacing.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  
  @media (max-width: 768px) {
    font-size: 1.6rem;
    gap: ${props => props.theme.spacing.xs};
  }
  
  @media (max-width: 480px) {
    font-size: 1.4rem;
    flex-direction: column;
    gap: ${props => props.theme.spacing.xs};
  }

/* 🎯 TABLET: Titolo compatto */
@media (min-width: 481px) and (max-width: 1200px) {
  font-size: 1.4rem !important;
  font-weight: 700 !important;
  margin-bottom: 6px !important;
  gap: 6px !important;
}
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  background: ${props => props.$active ? 'rgba(244, 67, 54, 0.1)' : 'rgba(158, 158, 158, 0.1)'};
  color: ${props => props.$active ? props.theme.colors.error : props.theme.colors.textSecondary};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  border-radius: 25px;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: ${props => props.theme.spacing.md};
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.md};
    gap: ${props => props.theme.spacing.xs};
  }
  
  /* Aggiungi dopo la media query 768px esistente: */
/* 🎯 TABLET: Badge compatto */
@media (min-width: 481px) and (max-width: 1200px) {
  font-size: 0.75rem !important;
  padding: 4px 12px !important;
  gap: 4px !important;
  margin-bottom: 8px !important;
  border-radius: 16px !important;
}
`;

const LiveDot = styled.div`
  width: 8px;
  height: 8px;
  background: ${props => props.theme.colors.error};
  border-radius: 50%;
  animation: ${props => props.$active ? 'pulse 2s infinite' : 'none'};

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  @media (max-width: 768px) {
    width: 6px;
    height: 6px;
  }
    /* Aggiungi dopo la media query 768px esistente: */
/* 🎯 TABLET: Dot più piccolo */
@media (min-width: 481px) and (max-width: 1200px) {
  width: 6px !important;
  height: 6px !important;
}
`;

const AuctionCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.lg};
  
  /* 🎯 TABLET: Card compatta */
  @media (min-width: 481px) and (max-width: 1200px) {
    padding: 12px !important;
    margin-bottom: 12px !important;
    border-radius: 8px !important;
  }
  
  @media (max-width: 768px) {
    padding: ${props => props.theme.spacing.md};
    margin-bottom: ${props => props.theme.spacing.md};
  }
  
  @media (max-width: 480px) {
    padding: ${props => props.theme.spacing.sm};
  }
`;

const PlayerSection = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.lg};
  position: relative;
  
  /* 🎯 TABLET: Sezione player compatta */
  @media (min-width: 481px) and (max-width: 1200px) {
    margin-bottom: 12px !important;
  }
  
  @media (max-width: 768px) {
    margin-bottom: ${props => props.theme.spacing.md};
  }
`;

const PlayerName = styled.h2`
  font-size: 1.6rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.sm};
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
    line-height: 1.3;
  }
    /* Aggiungi dopo la media query 480px esistente: */
/* 🎯 TABLET: Nome player compatto */
@media (min-width: 481px) and (max-width: 1200px) {
  font-size: 1.2rem !important;
  font-weight: 600 !important;
  margin-bottom: 6px !important;
  line-height: 1.3 !important;
}
`;

const PlayerDetails = styled.div`
  display: flex;
  justify-content: center;
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.md};
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: ${props => props.theme.spacing.md};
  }
  
  @media (max-width: 480px) {
    gap: ${props => props.theme.spacing.sm};
    flex-direction: row;
    justify-content: space-around;
  }
`;

const PlayerDetail = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  
  @media (max-width: 480px) {
    gap: 2px;
    min-width: 80px;
  }
`;

const DetailLabel = styled.span`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.85rem;
  
  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const DetailValue = styled.span`
  color: ${props => props.theme.colors.text};
  font-weight: 600;
  font-size: 1.1rem;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const TimerSection = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.lg};
  
  /* 🎯 TABLET: Timer compatto */
  @media (min-width: 481px) and (max-width: 1200px) {
    margin-bottom: 12px !important;
  }
  
  @media (max-width: 768px) {
    margin-bottom: ${props => props.theme.spacing.md};
  }
`;

const TimeDisplay = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  color: ${props => props.theme.colors.secondary};
  margin-bottom: ${props => props.theme.spacing.xs};
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
    /* Aggiungi dopo la media query 480px esistente: */
/* 🎯 TABLET: Display tempo compatto */
@media (min-width: 481px) and (max-width: 1200px) {
  font-size: 1.8rem !important;
  font-weight: 700 !important;
  margin-bottom: 4px !important;
}
`;

const TimerLabel = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1rem;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const BidSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
  
  /* 🎯 TABLET: Sezione bid compatta */
  @media (min-width: 481px) and (max-width: 1200px) {
    margin-bottom: 12px !important;
  }
  
  @media (max-width: 768px) {
    margin-bottom: ${props => props.theme.spacing.md};
  }
`;

const BidHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${props => props.theme.spacing.md};
  gap: ${props => props.theme.spacing.sm};
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: ${props => props.theme.spacing.sm};
  }
`;

const BidTitle = styled.h3`
  color: ${props => props.theme.colors.text};
  font-size: 1.3rem;
  font-weight: 600;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    text-align: center;
  }
`;

const BidHeaderControls = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  align-items: center;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    justify-content: center;
    gap: ${props => props.theme.spacing.xs};
  }
`;

const BidStats = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.lg};
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${props => props.theme.spacing.xs};
    font-size: 0.8rem;
    text-align: center;
  }
  
  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

const BidStat = styled.span`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const VisibilityToggle = styled(motion.button)`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  font-size: 0.8rem;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    color: ${props => props.theme.colors.text};
    border-color: ${props => props.theme.colors.primary};
  }
  
  @media (max-width: 768px) {
    font-size: 0.75rem;
    padding: ${props => props.theme.spacing.xs};
  }
`;

const AdminControls = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.xs};
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const AdminButton = styled.button`
  background: ${props => props.$variant === 'danger' ? '#F44336' : props.$active ? '#FF9800' : '#2D5A87'};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  white-space: nowrap;
  
  @media (max-width: 768px) {
    font-size: 0.7rem;
    padding: 0.4rem 0.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.65rem;
    padding: 0.3rem 0.6rem;
  }
`;

const BidForm = styled.form`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};
  
  @media (max-width: 768px) {
    gap: ${props => props.theme.spacing.sm};
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: ${props => props.theme.spacing.sm};
  }
`;

const BidInputContainer = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
`;

const BidInput = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  padding-right: 50px;
  background: ${props => props.theme.colors.background};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  font-weight: 600;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }

  &[data-hidden="true"] {
    -webkit-text-security: disc;
    font-family: text-security-disc, -apple-system, BlinkMacSystemFont, sans-serif;
  }
  
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 1000px ${props => props.theme.colors.background} inset !important;
    -webkit-text-fill-color: ${props => props.theme.colors.text} !important;
  }
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: ${props => props.theme.spacing.sm};
    padding-right: 45px;
  }
  
  @media (max-width: 480px) {
    font-size: 0.85rem;
  }

  /* Aggiungi dopo la media query 480px esistente: */
/* 🎯 TABLET: Input compatto */
@media (min-width: 481px) and (max-width: 1200px) {
  padding: 8px 40px 8px 8px !important;
  font-size: 0.8rem !important;
  border-radius: 6px !important;
  font-weight: 500 !important;
}
`;

const ToggleVisibilityButton = styled(motion.button)`
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    color: ${props => props.theme.colors.text};
    background: ${props => props.theme.colors.surfaceHover};
  }
  
  @media (max-width: 768px) {
    right: 8px;
    padding: 2px;
  }
`;

const BidButton = styled(motion.button)`
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
  min-width: 120px;
  justify-content: center;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    min-width: 100px;
    padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  }
  
  @media (max-width: 480px) {
    width: 100%;
    min-width: auto;
  }
    /* Aggiungi dopo la media query 480px esistente: */
/* 🎯 TABLET: Button bid compatto */
@media (min-width: 481px) and (max-width: 1200px) {
  padding: 8px 16px !important;
  font-size: 0.8rem !important;
  min-width: 80px !important;
  gap: 4px !important;
  border-radius: 6px !important;
}
`;

const BidsList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: ${props => props.theme.colors.border} transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 3px;

    &:hover {
      background: ${props => props.theme.colors.textSecondary};
    }
  }
  
  @media (max-width: 768px) {
    max-height: 250px;
  }
`;

const BidItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.$isWinning ? 'rgba(255, 167, 38, 0.1)' : props.theme.colors.background};
  border: 1px solid ${props => props.$isWinning ? props.theme.colors.secondary : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  margin-bottom: ${props => props.theme.spacing.sm};
  
  @media (max-width: 768px) {
    padding: ${props => props.theme.spacing.sm};
    flex-direction: column;
    align-items: flex-start;
    gap: ${props => props.theme.spacing.xs};
  }
`;

const BidUser = styled.span`
  font-weight: 600;
  color: ${props => props.$isWinning ? props.theme.colors.secondary : props.theme.colors.text};
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const BidAmount = styled.span`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${props => props.$isWinning ? props.theme.colors.secondary : props.theme.colors.text};
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const BidItemRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const NoAuctionState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius};
  
  /* 🎯 TABLET: No auction compatto */
  @media (min-width: 481px) and (max-width: 1200px) {
    padding: 16px !important;
    border-radius: 8px !important;
  }
  
  @media (max-width: 768px) {
    padding: ${props => props.theme.spacing.md};
  }
`;

const NoAuctionIcon = styled.div`
  width: 60px;
  height: 60px;
  background: ${props => props.theme.colors.gradient};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${props => props.theme.spacing.md};
  
  /* 🎯 TABLET: Icona compatta */
  @media (min-width: 481px) and (max-width: 1200px) {
    width: 40px !important;
    height: 40px !important;
    margin-bottom: 8px !important;
  }
  
  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
  }
`;

const NoAuctionTitle = styled.h3`
  color: ${props => props.theme.colors.text};
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: ${props => props.theme.spacing.sm};
  
  /* 🎯 TABLET: Titolo compatto */
  @media (min-width: 481px) and (max-width: 1200px) {
    font-size: 1.1rem !important;
    font-weight: 600 !important;
    margin-bottom: 6px !important;
  }
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const NoAuctionText = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1rem;
  line-height: 1.6;
  
  /* 🎯 TABLET: Testo compatto */
  @media (min-width: 481px) and (max-width: 1200px) {
    font-size: 0.8rem !important;
    line-height: 1.4 !important;
  }
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;
const CreditsRanking = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    padding: 8px;
    margin-bottom: 12px;
  }
  
  @media (min-width: 481px) and (max-width: 1200px) {
    padding: 8px;
    margin-bottom: 8px;
    font-size: 0.8rem;
  }
`;

const RankingTitle = styled.h4`
  color: ${props => props.theme.colors.text};
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 8px;
  text-align: center;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding-bottom: 4px;
  
  @media (min-width: 481px) and (max-width: 1200px) {
    font-size: 0.8rem;
    margin-bottom: 6px;
  }
`;

const RankingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (min-width: 481px) and (max-width: 1200px) {
    padding: 3px 0;
  }
`;

const RankingUser = styled.span`
  color: ${props => props.$isCurrentUser ? props.theme.colors.secondary : props.theme.colors.text};
  font-weight: ${props => props.$isCurrentUser ? '600' : '400'};
  font-size: 0.8rem;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 8px;
  
  @media (min-width: 481px) and (max-width: 1200px) {
    font-size: 0.7rem;
  }
`;

const RankingCredits = styled.span`
  color: ${props => props.$isCurrentUser ? props.theme.colors.secondary : props.theme.colors.textSecondary};
  font-weight: 600;
  font-size: 0.8rem;
  flex-shrink: 0;
  
  @media (min-width: 481px) and (max-width: 1200px) {
    font-size: 0.7rem;
  }
`;

const MiniCreditsRanking = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  padding: 8px;
  min-width: 120px;
  max-height: 200px;
  overflow-y: auto;
  font-size: 0.7rem;
  box-shadow: ${props => props.theme.shadows.small};
  
  @media (max-width: 768px) {
    position: relative;
    margin-bottom: 12px;
    max-height: none;
    overflow-y: visible;
  }
  
  @media (min-width: 481px) and (max-width: 1200px) {
    padding: 6px;
    min-width: 100px;
    font-size: 0.6rem;
  }
`;

const MiniRankingTitle = styled.h4`
  color: ${props => props.theme.colors.text};
  font-size: 0.7rem;
  font-weight: 600;
  margin-bottom: 6px;
  text-align: center;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding-bottom: 2px;
  
  @media (min-width: 481px) and (max-width: 1200px) {
    font-size: 0.6rem;
    margin-bottom: 4px;
  }
`;

const MiniRankingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const MiniRankingUser = styled.span`
  color: ${props => props.$isCurrentUser ? props.theme.colors.secondary : props.theme.colors.text};
  font-weight: ${props => props.$isCurrentUser ? '600' : '400'};
  font-size: 0.65rem;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 4px;
  
  @media (min-width: 481px) and (max-width: 1200px) {
    font-size: 0.55rem;
  }
`;

const MiniRankingCredits = styled.span`
  color: ${props => props.$isCurrentUser ? props.theme.colors.secondary : props.theme.colors.textSecondary};
  font-weight: 600;
  font-size: 0.65rem;
  flex-shrink: 0;
  
  @media (min-width: 481px) and (max-width: 1200px) {
    font-size: 0.55rem;
  }
`;
const CenteredMessage = styled.div`
  text-align: center;
  color: #B0BEC5;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
    font-size: 0.9rem;
  }
`;

const AdminViewTitle = styled.h4`
  color: #FFA726;
  margin-bottom: 1rem;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
`;

const SecretMessage = styled.div`
  text-align: center;
  margin-bottom: 1rem;
  color: #B0BEC5;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }
`;

const HiddenBidsCount = styled.div`
  text-align: center;
  color: #B0BEC5;
  padding: 1rem;
  
  @media (max-width: 768px) {
    padding: 0.5rem;
    font-size: 0.9rem;
  }
`;

const AstaLive = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentAuction, setCurrentAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submittingBid, setSubmittingBid] = useState(false);
  const [showAdminView, setShowAdminView] = useState(false);
  const [showBidAmount, setShowBidAmount] = useState(false);
  const [rosaInfo, setRosaInfo] = useState(null);
  const [validationInfo, setValidationInfo] = useState(null);
  const [isProcessingExpiration, setIsProcessingExpiration] = useState(false);
  const [utentiCrediti, setUtentiCrediti] = useState([]);

  const fetchAuctionDetails = async (auctionId) => {
    try {
      const response = await axios.get(`${API_URL}/api/aste/${auctionId}`);
      const newBids = response.data.offerte || [];
      
      setBids(prevBids => {
        if (JSON.stringify(prevBids) !== JSON.stringify(newBids)) {
          return newBids;
        }
        return prevBids;
      });
      
    } catch (error) {
      console.error('Errore caricamento dettagli asta:', error);
    }
  };

const fetchValidationInfo = async (auctionId) => {
  try {
    const [rosaResponse, validationResponse] = await Promise.all([
      axios.get(`${API_URL}/api/aste/user/rosa-info`),
      axios.get(`${API_URL}/api/aste/user/validation-info/${auctionId}`)
    ]);
    
    setRosaInfo(rosaResponse.data);
    setValidationInfo(validationResponse.data);
  } catch (error) {
    console.error('Errore caricamento info validazione:', error);
  }
};

const fetchUtentiCrediti = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/utenti/rose/all`);
    const utenti = response.data.rose || [];
    
    console.log('🎯 Dati ricevuti da /api/utenti/rose/all:', utenti);
    
    if (utenti.length === 0) {
      console.log('⚠️ Nessun utente trovato');
      return;
    }
    
    // I dati arrivano già con crediti_totali, crediti_spesi, crediti_disponibili
    // Ordina per crediti disponibili (decrescente)
    const utentiOrdinati = utenti
      .filter(utente => utente.username) // Filtra utenti validi
      .map(utente => ({
        id: utente.id,
        username: utente.username,
        is_admin: utente.is_admin,
        crediti_totali: utente.crediti_totali,
        crediti_spesi: utente.crediti_spesi,
        crediti_rimanenti: utente.crediti_disponibili // Usa il campo che già viene calcolato dal backend
      }))
      .sort((a, b) => b.crediti_rimanenti - a.crediti_rimanenti);
    
    console.log('🎯 Utenti crediti caricati:', utentiOrdinati);
    setUtentiCrediti(utentiOrdinati);
  } catch (error) {
    console.error('Errore caricamento crediti utenti:', error);
    console.error('Dettagli errore:', error.response?.data);
  }
};

const fetchCurrentAuction = useCallback(async () => {
  if (isProcessingExpiration) {
    return;
  }

  try {
    const response = await axios.get(`${API_URL}/api/aste/attive/current`);
    
    if (response.data.asta) {
      const newAuction = response.data.asta;
      const now = new Date().getTime();
      const end = new Date(newAuction.tempo_fine).getTime();
      const isExpired = now >= end;
      
      if (isExpired) {
        // ✅ SOLO ADMIN gestisce aste scadute in fetchCurrentAuction
        if (user?.is_admin) {
          setIsProcessingExpiration(true);
          setTimeout(() => {
            navigate(`/risultati-asta/${newAuction.id}`);
          }, 1000);
        } else {
          // ✅ UTENTI: Ignora aste scadute, lascia gestire al timer
          setCurrentAuction(null);
          setBids([]);
        }
        return;
      }
      
      // Solo se asta ancora valida
      setCurrentAuction(prevAuction => {
  if (!prevAuction || prevAuction.id !== newAuction.id) {
    setIsProcessingExpiration(false);
    fetchAuctionDetails(newAuction.id);
    fetchValidationInfo(newAuction.id);
    fetchUtentiCrediti(); // Aggiungi questa riga
    return newAuction;
  } else {
    fetchAuctionDetails(newAuction.id);
    fetchValidationInfo(newAuction.id);
    fetchUtentiCrediti(); // Aggiungi questa riga
    return prevAuction;
  }
});
      
    } else {
      // Nessuna asta attiva
      if (currentAuction && user?.is_admin && !isProcessingExpiration) {
        setIsProcessingExpiration(true);
        setTimeout(() => {
          navigate(`/risultati-asta/${currentAuction.id}`);
        }, 1000);
      } else {
        // ✅ UTENTI: Semplicemente pulisci
        setCurrentAuction(null);
        setBids([]);
        setIsProcessingExpiration(false);
      }
    }
  } catch (error) {
    console.error('Errore caricamento asta:', error);
  } finally {
    setLoading(false);
  }
}, [currentAuction, navigate, isProcessingExpiration, user?.is_admin]);
        


  const handleCloseAuction = () => {
    if (!currentAuction) return;

    toast((t) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Gavel size={20} color="#F44336" />
          <strong>Chiudi Asta</strong>
        </div>
        <div style={{ fontSize: '14px', color: '#666' }}>
          Sei sicuro di voler chiudere l'asta per <strong>{currentAuction.calciatore_nome}</strong>?  
          Una volta chiusa, non sarà più modificabile.
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
                const response = await axios.post(`${API_URL}/api/aste/${currentAuction.id}/chiudi`);
                toast.dismiss(loading);
                navigate(`/risultati-asta/${currentAuction.id}`);
              } catch (error) {
                toast.dismiss(loading);
                const message = error.response?.data?.error || 'Errore nella chiusura dell\'asta';
                toast.error(message);
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

// Nel primo useEffect, modifica così:
useEffect(() => {
  fetchCurrentAuction();
  
  const interval = setInterval(() => {
    
    if (!isProcessingExpiration) {
      fetchCurrentAuction();
    }
  }, 8000);
  
  return () => clearInterval(interval);
}, [fetchCurrentAuction, isProcessingExpiration,]);

useEffect(() => {
  if (currentAuction && currentAuction.tempo_fine && !isProcessingExpiration) {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(currentAuction.tempo_fine).getTime();
      const difference = end - now;

      if (difference > 0) {
        setTimeLeft(Math.floor(difference / 1000));
      } else {
        setTimeLeft(0);
        
        if (!isProcessingExpiration) {
          if (user?.is_admin) {
            // Admin: vai ai risultati
            setTimeout(() => {
              fetchCurrentAuction();
            }, 3000);
          } else {
            // ✅ UTENTI: Pulisci stato e aspetta nuova asta
            toast.success('Asta terminata! Attendere la prossima asta...');
            setCurrentAuction(null);
            setBids([]);
            setIsProcessingExpiration(false); // ✅ SBLOCCA SUBITO
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }
}, [currentAuction?.id, fetchCurrentAuction, isProcessingExpiration, user?.is_admin]);

// ✅ Reset processing state quando cambia asta
useEffect(() => {
  if (currentAuction?.id) {
    setIsProcessingExpiration(false);
  }
}, [currentAuction?.id]);

  // Sostituisci TUTTO il contenuto della funzione submitBid con:
// 1. Modifica la funzione submitBid - distingui vuoto da 0:
const submitBid = async (e) => {
  e.preventDefault();
  
  // ✅ NUOVO: Campo vuoto = blocca, 0 esplicito = permetti bluff
  if (bidAmount === '' || bidAmount === null || bidAmount === undefined) {
    toast.error('Inserisci un importo (anche 0 per bluffare)');
    return;
  }
  
  const amount = parseInt(bidAmount);
  if (isNaN(amount) || amount < 0) {
    toast.error('Inserisci un importo valido (minimo 0 crediti)');
    return;
  }

  if (!currentAuction) {
    toast.error('Nessuna asta attiva');
    return;
  }

  // ✅ CONTROLLI AVANZATI FRONTEND (resto uguale)
  if (validationInfo && !validationInfo.validazione.puo_offrire) {
    toast.error(validationInfo.validazione.motivo_blocco);
    return;
  }

  const creditiUsabili = validationInfo?.validazione?.crediti_usabili || 0;

  if (amount > creditiUsabili) {
    toast.error(`Crediti insufficienti. Massimo offribile: ${creditiUsabili} (${validationInfo?.validazione?.crediti_riservati || 0} riservati per giocatori mancanti)`);
    return;
  }

  try {
    setSubmittingBid(true);
    
    const response = await axios.post(`${API_URL}/api/aste/${currentAuction.id}/offerta`, {
      importo: amount
    });

    toast.success(`Offerta inviata!`);
    setBidAmount('');
    
    setTimeout(() => {
      fetchAuctionDetails(currentAuction.id);
      fetchValidationInfo(currentAuction.id);
    }, 500);

  } catch (error) {
    const errorData = error.response?.data;
    
    if (errorData?.crediti_info) {
      toast.error(
        `${errorData.error}\n\nDettagli:\n• Crediti disponibili: ${errorData.crediti_info.crediti_disponibili}\n• Crediti riservati: ${errorData.crediti_info.crediti_riservati}\n• Crediti usabili: ${errorData.crediti_info.crediti_usabili}`,
        { duration: 6000 }
      );
    } else {
      const message = errorData?.error || 'Errore nell\'invio dell\'offerta';
      toast.error(message);
    }
  } finally {
    setSubmittingBid(false);
  }
};

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const creditiDisponibili = user ? (user.crediti_totali - user.crediti_spesi) : 0;
  const isActive = currentAuction && timeLeft > 0;

  if (loading) {
    return (
      <AstaContainer>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Caricamento asta...
        </div>
      </AstaContainer>
    );
  }

  if (!currentAuction) {
    return (
      <AstaContainer>
        <Header>
          <Title>
            <Gavel size={32} />
            Asta Live
          </Title>
          <StatusBadge $active={false}>
            <Pause size={16} />
            Nessuna Asta Attiva
          </StatusBadge>
        </Header>

        <NoAuctionState>
          <NoAuctionIcon>
            <Timer size={40} color="white" />
          </NoAuctionIcon>
          <NoAuctionTitle>Nessuna Asta in Corso</NoAuctionTitle>
          <NoAuctionText>
            Al momento non ci sono aste attive. Le aste vengono gestite dagli amministratori.
            Torna presto per partecipare alle prossime aste!
          </NoAuctionText>
        </NoAuctionState>
      </AstaContainer>
    );
  }

  const winningBid = bids.length > 0 ? bids[0] : null;

  return (
   <AstaContainer>
  <Header>
    <Title>
      <Gavel size={32} />
      Asta Live
    </Title>
    <StatusBadge $active={isActive}>
      <LiveDot $active={isActive} />
      {isActive ? 'ASTA IN CORSO' : 'ASTA TERMINATA'}
    </StatusBadge>
  </Header>

  <AuctionCard>
    <PlayerSection>
      {currentAuction && utentiCrediti.length > 0 && (
        <MiniCreditsRanking>
          <MiniRankingTitle>💰 Crediti</MiniRankingTitle>
          {utentiCrediti.slice(0, 8).map((utente) => (
            <MiniRankingItem key={utente.id}>
              <MiniRankingUser $isCurrentUser={utente.id === user?.id}>
                {utente.username}
              </MiniRankingUser>
              <MiniRankingCredits $isCurrentUser={utente.id === user?.id}>
                {utente.crediti_rimanenti}
              </MiniRankingCredits>
            </MiniRankingItem>
          ))}
        </MiniCreditsRanking>
      )}
      
      <PlayerName>{currentAuction.calciatore_nome}</PlayerName>
      
      <PlayerDetails>
        <PlayerDetail>
          <DetailLabel>Squadra</DetailLabel>
          <DetailValue>{currentAuction.squadra}</DetailValue>
        </PlayerDetail>
        <PlayerDetail>
          <DetailLabel>Ruolo</DetailLabel>
          <DetailValue>{currentAuction.ruolo}</DetailValue>
        </PlayerDetail>
        <PlayerDetail>
          <DetailLabel>Quotazione</DetailLabel>
          <DetailValue>{currentAuction.quotazione}</DetailValue>
        </PlayerDetail>
      </PlayerDetails>
    </PlayerSection>

    <TimerSection>
      <TimeDisplay>{formatTime(timeLeft)}</TimeDisplay>
      <TimerLabel>
        {timeLeft > 0 ? 'Tempo Rimanente' : 'Asta Terminata'}
      </TimerLabel>
    </TimerSection>

        <BidSection>
          <BidHeader>
            <BidTitle>Offerte</BidTitle>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <BidStats>
                <span><Users size={16} /> {bids.length} offerte</span>
                <span><Coins size={16} /> 
                {rosaInfo ? 
                  `Usabili: ${rosaInfo.riepilogo.crediti_usabili} (${rosaInfo.riepilogo.crediti_riservati} riservati)` :
                  `Tu hai: ${creditiDisponibili} crediti`
                }
              </span>
              </BidStats>
              
              {/* Toggle visibilità sempre disponibile */}
              <VisibilityToggle
                onClick={() => setShowBidAmount(!showBidAmount)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={showBidAmount ? "Nascondi importi" : "Mostra importi"}
              >
                {showBidAmount ? <EyeOff size={16} /> : <Eye size={16} />}
                {showBidAmount ? 'Nascondi' : 'Mostra'}
              </VisibilityToggle>
              
              {user?.is_admin && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => setShowAdminView(!showAdminView)}
                    style={{
                      background: showAdminView ? '#FF9800' : '#2D5A87',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    {showAdminView ? 'Nascondi' : 'Mostra'} Partecipanti
                  </button>
                  
                  {isActive && (
                    <button
                      onClick={handleCloseAuction}
                      style={{
                        background: '#F44336',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      Chiudi Asta
                    </button>
                  )}
                </div>
              )}
            </div>
          </BidHeader>

          {isActive && (
            <BidForm onSubmit={submitBid}>
              <BidInputContainer>
                <BidInput
                  type="number" // Sempre number, mai password
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder="Dai scemo offri almeno 0 per bluffare" 
                  min="0"
                  max={validationInfo?.validazione?.crediti_usabili || creditiDisponibili}
                  data-hidden={!showBidAmount} // Custom attribute per nascondere visivamente
                  
                  // Attributi per disabilitare COMPLETAMENTE i suggerimenti
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  data-form-type="other"
                  data-lpignore="true"
                  data-1p-ignore="true"
                  data-bwignore="true"
                  name={`bid-${Date.now()}`} // Nome dinamico per confondere i browser
                  id={`bid-${Date.now()}`}
                  
                  // Chrome specifici
                  data-chrome-autofill="off"
                  data-new-gr-c-s-check-loaded="false"
                  data-gr-ext-installed="false"
                />
                <ToggleVisibilityButton
                  type="button"
                  onClick={() => setShowBidAmount(!showBidAmount)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title={showBidAmount ? "Nascondi importo" : "Mostra importo"}
                >
                  {showBidAmount ? <EyeOff size={18} /> : <Eye size={18} />}
                </ToggleVisibilityButton>
              </BidInputContainer>
              <BidButton
                type="submit"
                disabled={submittingBid || !bidAmount}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {submittingBid ? 'Invio...' : 'Offri'}
                <Trophy size={16} />
              </BidButton>
            </BidForm>
          )}

          <BidsList>
            {bids.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#B0BEC5', padding: '2rem' }}>
                Nessuna offerta ancora. Puoi iniziare con 1 credito! 💰
              </div>
            ) : (
              <>
                {user?.is_admin && showAdminView ? (
                  <div>
                    <h4 style={{ color: '#FFA726', marginBottom: '1rem', textAlign: 'center' }}>
                      👑 Vista Amministratore - Partecipanti ({bids.length})
                    </h4>
                    {bids.map((bid, index) => (
                      <BidItem key={bid.id} $isWinning={false}>
                        <BidUser $isWinning={false}>
                          {bid.username}
                        </BidUser>
                        <div style={{ color: '#B0BEC5', fontSize: '0.8rem' }}>
                          Ha partecipato all'asta
                        </div>
                      </BidItem>
                    ))}
                  </div>
                ) : (
                  <div>
                    <div style={{ textAlign: 'center', marginBottom: '1rem', color: '#B0BEC5' }}>
                      🤐 Le offerte sono segrete fino alla fine dell'asta
                    </div>
                    {bids.filter(bid => bid.utente_id === user?.id).map((bid) => (
                      <BidItem key={bid.id} $isWinning={false}>
                        <BidUser $isWinning={false}>
                          La tua offerta
                        </BidUser>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <BidAmount $isWinning={false}>
                            {showBidAmount ? `${bid.importo} crediti` : '••• crediti'}
                          </BidAmount>
                          <ToggleVisibilityButton
                            type="button"
                            onClick={() => setShowBidAmount(!showBidAmount)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title={showBidAmount ? "Nascondi importo" : "Mostra importo"}
                            style={{ position: 'static', right: 'auto', padding: '2px' }}
                          >
                            {showBidAmount ? <EyeOff size={14} /> : <Eye size={14} />}
                          </ToggleVisibilityButton>
                        </div>
                      </BidItem>
                    ))}
                    {bids.filter(bid => bid.utente_id !== user?.id).length > 0 && (
                      <div style={{ textAlign: 'center', color: '#B0BEC5', padding: '1rem' }}>
                        🔒 {bids.filter(bid => bid.utente_id !== user?.id).length} altre offerte nascoste
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </BidsList>
        </BidSection>
      </AuctionCard>
    </AstaContainer>
  );
};

export default AstaLive;