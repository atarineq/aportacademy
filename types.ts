
export type Category = 'Смартфон' | 'Ноутбук' | 'AirPods' | 'Часы';
export type Role = 'ADMIN' | 'HEAD' | 'MANAGER' | 'INTERN';

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  unlockedAt?: number;
}

export interface Branch {
  id: string;
  name: string;
  city: string;
  createdAt: number;
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: Role;
  branchId?: string;
  avatar?: string;
  joinedAt: number;
  stats?: {
    completedChecks: number;
    passedExams: number;
    xp: number;
    level: number;
    rank: string;
  };
  achievements?: Achievement[];
}

export interface AcademyItem {
  id: string;
  name: string;
  icon?: string;
  title?: string;
  content?: string;
  grid?: { id: string; name: string; icon?: string }[];
}

export interface QuizQuestion {
  q: string;
  a: string;
  o: string[];
}

export interface ChecklistState {
  [key: string]: 'ok' | 'bad' | null;
}

export interface InspectionData {
  id: string;
  timestamp: number;
  branchId: string;
  inspectorId: string;
  inspectorName: string;
  phone: string;
  category: Category;
  model: string;
  marketPrice: number;
  loanAmount: number;
  checklist: ChecklistState;
  comment: string;
  photo?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  groundingUrls?: { title: string; uri: string }[];
}
