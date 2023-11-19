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
      <ng-container *ngFor="let user of users; trackBy: trackByFn">
        <li *ngIf="!user.editingInProgress" class="list-group-item">
          {{ user.nickname }}
          ( {{ user.email }} )
          <a href="#" (click)="$event.preventDefault(); edit.emit(user)"
            >edit</a
          >
          |
          <a href="#" (click)="$event.preventDefault(); delete.emit(user)"
            >delete</a
          >
        </li>
      </ng-container>
    </ul>
  `,
  styles: [
    `
      :host {
        display: block;
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
