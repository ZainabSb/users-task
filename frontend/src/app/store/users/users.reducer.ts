import { createFeature, createReducer, on } from '@ngrx/store';
import { UsersActions } from './users.actions';
import { initialState } from './users.state';

export const usersFeature = createFeature({
  name: 'users',
  reducer: createReducer(
    initialState,
    on(UsersActions.loadUsers, (state) => ({
      ...state,
      loading: true,
      error: null
    })),
    on(UsersActions.loadUsersSuccess, (state, { users }) => ({
      ...state,
      users,
      loading: false,
      error: null
    })),
    on(UsersActions.loadUsersFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error
    })),
    on(UsersActions.createUser, (state) => ({
      ...state,
      loading: true,
      error: null
    })),
    on(UsersActions.createUserSuccess, (state, { user }) => ({
      ...state,
      users: [...state.users, user],
      loading: false,
      error: null
    })),
    on(UsersActions.createUserFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error
    }))
  )
});