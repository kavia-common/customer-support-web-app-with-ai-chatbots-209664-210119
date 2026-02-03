export type Role = 'customer' | 'agent' | 'admin';

export interface User {
  id: string;
  email: string;
  role: Role;
}

export interface AuthTokens {
  accessToken: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'pending' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  requesterEmail?: string;
  assigneeEmail?: string;
  aiSummary?: string;
}

export interface ChatMessage {
  id: string;
  ticketId?: string;
  author: 'user' | 'agent' | 'bot' | 'system';
  text: string;
  createdAt: string;
}
