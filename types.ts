
export interface Document {
  id: string;
  name: string;
  content: string;
}

export interface SearchResult {
  document: Document;
  snippet: string;
}

export type ChatRole = 'user' | 'model';

export interface ChatMessage {
  role: ChatRole;
  text: string;
  sources?: GroundingSource[];
}

export interface GroundingSource {
    uri: string;
    title: string;
}
