import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";

import { UserListComponent } from "./components/user-list/user-list.component";
import { AddOrEditComponent } from "./components/add-or-edit/add-or-edit.component";
import { User } from "./models/user.model";
import { UserEditingService } from "./services/user-editing.service";
import { User2Service } from "./services/user2.service";

@Component({
  selector: "app-root",
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
              (delete)="handleDelete($event)"></app-user-list>
          </div>
        </div>
        <div class="col">
          <div class="p-5">
            <app-add-or-edit
              *ngIf="userService.editingUser$ | async as editedUser"
              [user]="editedUser"
              (addOrEdit)="handleAddOrEdit($event)"
              (cancel)="handleCancel($event)"></app-add-or-edit>
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
  // *ngIf="userEditingService.userEditing$ | async as editedUser"
  // userService = inject(UserService);
  userService = inject(User2Service);
  userEditingService = inject(UserEditingService);

  handleAddOrEdit(user: User) {
    if (typeof user.id !== "undefined") {
      this.userService.updateUser({ ...user, editingInProgress: false });
    } else {
      this.userService.addUser(user);
    }

    // this.userEditingService.startEditUser(createEmptyUser());
  }

  handleDelete(user: User) {
    this.userService.deleteUser(user);
  }

  handleEdit(user: User) {
    this.userService.updateUser({ ...user, editingInProgress: true });
    // this.userEditingService.startEditUser(user);
  }

  handleCancel(user: User) {
    this.userService.updateUser({ ...user, editingInProgress: false });
    // this.userEditingService.startEditUser(createEmptyUser());
  }

  log(i: any) {
    console.log("_debug 3", i);
  }
}
