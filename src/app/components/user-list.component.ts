import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { User } from '../models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul class="list-group">
      <li
        *ngFor="let user of users; trackBy: trackByFn"
        class="list-group-item"
        [class.bg-warning]="user.editingInProgress"
      >
        {{ user.nickname }}
        ( {{ user.email }} )
        <a href="#" (click)="$event.preventDefault(); edit.emit(user)">edit</a>
        |
        <a href="#" (click)="$event.preventDefault(); delete.emit(user)"
          >delete</a
        >
      </li>
    </ul>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .editing {
        background: orange;
      }
    `,
  ],
})
export class UserListComponent {
  @Input() users: User[] | null = [];

  @Output() delete = new EventEmitter<User>();
  @Output() edit = new EventEmitter<User>();

  trackByFn(index: any, user: User) {
    return user.id;
  }
}
