import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap, delay } from 'rxjs/operators';
import { UsersActions } from './users.actions';
import { UsersService } from '../../users.service';
import { NotificationService } from '../../core/services/notification.service';

@Injectable()
export class UsersEffects {
  loadUsers$: any;
  createUser$: any;
  createUserSuccessNotification$: any;

  constructor(
    private actions$: Actions,
    private usersService: UsersService,
    private notificationService: NotificationService
  ) {
    this.loadUsers$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UsersActions.loadUsers),
        switchMap(() =>
          this.usersService.getUsers().pipe(
            delay(1500), 
            map((users) => UsersActions.loadUsersSuccess({ users })),
            catchError((error) =>
              of(UsersActions.loadUsersFailure({ error: error.message || 'Failed to load users' }))
            )
          )
        )
      )
    );

    this.createUser$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UsersActions.createUser),
        switchMap(({ userData }) =>
          this.usersService.createUser(userData).pipe(
            delay(1500),
            map((user) => UsersActions.createUserSuccess({ user })),
            catchError((error) =>
              of(UsersActions.createUserFailure({ error: error.message || 'Failed to create user' }))
            )
          )
        )
      )
    );

    this.createUserSuccessNotification$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UsersActions.createUserSuccess),
        tap(({ user }) => {
          this.notificationService.showSuccess(`Hello ${user.firstName}!`);
        })
      ),
      { dispatch: false } 
    );

    const createUserFailureNotification$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UsersActions.createUserFailure),
        tap(({ error }) => {
          this.notificationService.showError(error || 'Failed to create user');
        })
      ),
      { dispatch: false }
    );
  }
}