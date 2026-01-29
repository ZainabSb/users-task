import { createSelector } from '@ngrx/store';
import { usersFeature } from './users.reducer';

export const selectUsersState = usersFeature.selectUsersState;

export const selectUsers = createSelector(
  selectUsersState,
  (state) => state.users
);

export const selectUsersLoading = createSelector(
  selectUsersState,
  (state) => state.loading
);

export const selectUsersError = createSelector(
  selectUsersState,
  (state) => state.error
);