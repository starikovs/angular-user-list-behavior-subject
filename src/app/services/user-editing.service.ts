import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';

import { User, createEmptyUser } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserEditingService {
  private userEditingSubject = new BehaviorSubject<User>(createEmptyUser());
  public readonly userEditing$ = this.userEditingSubject.asObservable().pipe(
    tap((i) => {
      console.log('_debug UserEditingService::userEditingSubject emit', i);
    })
  );

  constructor() {}

  startEditUser(user: User = createEmptyUser()) {
    this.userEditingSubject.next(user);
  }
}
