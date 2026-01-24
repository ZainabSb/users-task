import { User } from '../../users.service';

export interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}

export const initialState: UsersState = {
  users: [],
  loading: false,
  error: null
};