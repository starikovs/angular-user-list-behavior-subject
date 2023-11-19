import { Injectable } from '@angular/core';
import { BehaviorSubject, scan } from 'rxjs';

import { User, createEmptyUser, createUser } from '../models/user.model';

const ACTIONS = {
  ADD: 'ADD USER',
  DELETE: 'DELETE USER',
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
  private userListSubject = new BehaviorSubject<User[]>([
    createUser('root'),
    createUser('admin'),
  ]);
  public readonly userList$ = this.userListSubject.asObservable();

  private userListSubjectScan = new BehaviorSubject<UserAction>({
    type: ACTIONS.ADD,
    payload: createUser('root'),
  });
  public readonly userListScan$ = this.userListSubjectScan.pipe(
    scan((acc: User[], action: UserAction) => {
      switch (action.type) {
        case ACTIONS.ADD:
          acc.push(action.payload);
          return acc;

        case ACTIONS.UPDATE:
          return acc.map((user) => {
            if (user.id === action.payload.id) {
              return action.payload;
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

  constructor() {}

  addUser(user: User) {
    this.userListSubject.next([
      ...this.userListSubject.value,
      createUser(user.nickname),
    ]);
  }

  deleteUser(user: User) {
    this.userListSubject.next(
      this.userListSubject.value.filter((u) => u.id !== user.id)
    );
  }

  editUser(user: User) {
    this.userListSubject.next(
      this.userListSubject.value.map((u) => {
        if (user.id === u.id) {
          return user;
        }

        return u;
      })
    );
  }

  addUserScan(user: User) {
    this.userListSubjectScan.next({
      type: ACTIONS.ADD,
      payload: createUser(user.nickname),
    });
  }

  deleteUserScan(user: User) {
    this.userListSubjectScan.next({
      type: ACTIONS.DELETE,
      payload: user,
    });
  }

  editUserScan(user: User) {
    this.userListSubjectScan.next({
      type: ACTIONS.UPDATE,
      payload: user,
    });
  }
}
