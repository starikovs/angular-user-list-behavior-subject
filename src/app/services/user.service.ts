import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, scan, map } from 'rxjs';

import { User, createEmptyUser, createUser } from '../models/user.model';

const ACTIONS = {
  ADD: 'ADD USER',
  DELETE: 'DELETE USER',
  EDIT: 'EDIT USER',
  UPDATE: 'UPDATE USER',
};

type UserAction = {
  type: string;
  payload: User;
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userActionsSubject = new BehaviorSubject<UserAction>({
    type: ACTIONS.ADD,
    payload: createUser('root', 'root@gmail.com'),
  });

  readonly userList$ = this.userActionsSubject.pipe(
    scan((acc: User[], action: UserAction) => {
      switch (action.type) {
        case ACTIONS.ADD:
          return [...acc, action.payload];

        case ACTIONS.EDIT:
          return acc.map((user) => {
            if (user.id === action.payload.id) {
              return { ...action.payload, editingInProgress: true };
            }

            return { ...user, editingInProgress: false };
          });

        case ACTIONS.UPDATE:
          return acc.map((user) => {
            if (user.id === action.payload.id) {
              return { ...action.payload, editingInProgress: false };
            }

            return user;
          });

        case ACTIONS.DELETE:
          return acc.filter((user) => user.id !== action.payload.id);

        default:
          return acc;
      }
    }, [])
  );

  readonly editingUser$: Observable<User> = this.userList$.pipe(
    map((userList: User[]) => {
      return (
        userList.find((user: User) => user.editingInProgress) ||
        createEmptyUser()
      );
    })
  );

  addUser(user: User) {
    this.userActionsSubject.next({
      type: ACTIONS.ADD,
      payload: createUser(user.nickname, user.email),
    });
  }

  deleteUser(user: User) {
    this.userActionsSubject.next({
      type: ACTIONS.DELETE,
      payload: user,
    });
  }

  editUser(user: User) {
    this.userActionsSubject.next({
      type: ACTIONS.EDIT,
      payload: user,
    });
  }

  updateUser(user: User) {
    this.userActionsSubject.next({
      type: ACTIONS.UPDATE,
      payload: user,
    });
  }
}
