import { createActionGroup, props, emptyProps } from '@ngrx/store';
import { User } from '../../users.service';

export const UsersActions = createActionGroup({
  source: 'Users',
  events: {
    'Load Users': emptyProps(),
    'Load Users Success': props<{ users: User[] }>(),
    'Load Users Failure': props<{ error: string }>(),
    'Create User': props<{ userData: { firstName: string; lastName: string; dateOfBirth: string; username: string; password: string } }>(),
    'Create User Success': props<{ user: User }>(),
    'Create User Failure': props<{ error: string }>(),
  }
});
