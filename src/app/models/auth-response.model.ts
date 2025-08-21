import { User } from './user.model';

export interface AuthResponse {
  status: string;
  token: string;
  user: User;
}
