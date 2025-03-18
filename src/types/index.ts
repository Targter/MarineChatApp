export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
  images:String,
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
} 

export interface User {
  id: string;
  name: string; 
  isPremium: boolean;
} 