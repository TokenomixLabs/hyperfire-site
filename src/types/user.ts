
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role?: 'user' | 'admin' | 'moderator';
  isNewUser?: boolean;
}
