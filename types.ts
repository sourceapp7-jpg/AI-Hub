
import { LucideProps } from 'lucide-react';
import React from 'react';

export type ModelId = 'ChatGPT' | 'Gemini' | 'Grok' | 'Claude';

export interface AIModel {
  id: ModelId;
  icon: React.ComponentType<LucideProps>;
  displayName: string;
}

export type HomeOrModelId = 'Home' | 'Settings' | ModelId;

export interface Message {
  role: 'user' | 'ai';
  content: string;
}

export type ApiKeySet = Record<ModelId, string>;

export interface ImageAttachment {
  data: string; // base64
  mimeType: string;
  fileName: string;
  preview: string; // data URL for preview
}
