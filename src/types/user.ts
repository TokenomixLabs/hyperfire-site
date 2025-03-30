
export interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  avatarUrl?: string;
  role?: 'user' | 'admin' | 'moderator';
  isNewUser?: boolean;
  referralLinks?: {
    insiderlife: string;
    insiderdao: string;
    societi: string;
    aifc: string;
  };
}
