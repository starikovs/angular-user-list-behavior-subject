import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { User } from './models/user.model';
import { UserService } from './services/user.service';
import { UserListComponent } from './components/user-list.component';
import { AddOrEditComponent } from './components/add-or-edit.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, UserListComponent, AddOrEditComponent],
  template: `
    <div class="container gx-5">
      <div class="row">
        <div class="col">
          <div class="p-5">
            <app-user-list
              *ngIf="userService.userList$ | async as users"
              [users]="users"
              (edit)="handleEdit($event)"
              (delete)="handleDelete($event)"
            ></app-user-list>
          </div>
        </div>
        <div class="col">
          <div class="p-5">
            <app-add-or-edit
              *ngIf="userService.editingUser$ | async as editedUser"
              [user]="editedUser"
              (addOrEdit)="handleAddOrEdit($event)"
              (cancel)="handleCancel($event)"
            ></app-add-or-edit>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class AppComponent {
  userService = inject(UserService);

  handleAddOrEdit(user: User) {
    if (typeof user.id !== 'undefined') {
      this.userService.updateUser(user);
    } else {
      this.userService.addUser(user);
    }
  }

  handleDelete(user: User) {
    this.userService.deleteUser(user);
  }

  handleEdit(user: User) {
    this.userService.editUser(user);
  }

  handleCancel(user: User) {
    this.userService.updateUser(user);
  }
}
