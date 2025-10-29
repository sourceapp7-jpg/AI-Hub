
import { MessageSquare, Sun, Zap, Brain } from 'lucide-react';
import { AIModel } from './types';

export const COLORS = {
  BACKGROUND: '#05050A',
  CARD_BG: '#101015',
  TEXT_LIGHT: '#E0FFFF',
  ACCENT_CYAN: '#00FFFF',
};

export const AI_MODELS: AIModel[] = [
  { id: 'ChatGPT', icon: MessageSquare, displayName: 'ChatGPT' },
  { id: 'Gemini', icon: Sun, displayName: 'Gemini' },
  { id: 'Grok', icon: Zap, displayName: 'Grok' },
  { id: 'Claude', icon: Brain, displayName: 'Claude' },
];
