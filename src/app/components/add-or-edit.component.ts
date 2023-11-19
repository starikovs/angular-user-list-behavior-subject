import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChange,
  SimpleChanges,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { User, createEmptyUser } from '../models/user.model';

@Component({
  selector: 'app-add-or-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1 *ngIf="user.id; else elseBlock">Editing user {{ user.nickname }}</h1>
    <ng-template #elseBlock>
      <h1>Add new user</h1>
    </ng-template>

    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div class="mb-3">
        <label for="nickname" class="form-label">User nickname</label>
        <input
          formControlName="nickname"
          [class.is-invalid]="
            nickname?.invalid && nickname?.touched && !nickname?.pristine
          "
          type="text"
          placeholder="User nickname"
          class="form-control"
          id="nickname"
        />
        <div
          *ngIf="nickname?.invalid && nickname?.touched && !nickname?.pristine"
          class="invalid-feedback"
        >
          Required and the length should be 4-10 chars
        </div>
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">User email</label>
        <input
          formControlName="email"
          [class.is-invalid]="
            email?.invalid && email?.touched && !email?.pristine
          "
          type="email"
          placeholder="User email"
          class="form-control"
          id="email"
        />
        <div
          *ngIf="email?.invalid && email?.touched && !email?.pristine"
          class="invalid-feedback"
        >
          Required and should be a valid email address
        </div>
      </div>

      <button [disabled]="form.invalid" type="submit" class="btn btn-primary">
        Add / Edit
      </button>
      <button
        (click)="handleResetClick()"
        type="button"
        class="btn btn btn-outline-secondary ms-3"
      >
        Cancel
      </button>
    </form>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class AddOrEditComponent implements OnChanges {
  @Input() user: User = createEmptyUser();

  @Output() addOrEdit = new EventEmitter<User>();
  @Output() cancel = new EventEmitter<User>();

  fb = inject(FormBuilder);

  form = this.fb.group({
    nickname: [
      this.user.nickname,
      Validators.compose([
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(10),
      ]),
    ],
    email: [
      this.user.email,
      Validators.compose([Validators.required, Validators.email]),
    ],
  });

  get nickname() {
    return this.form.get('nickname');
  }

  get email() {
    return this.form.get('email');
  }

  ngOnChanges(sc: SimpleChanges) {
    const userChange: SimpleChange = sc['user'];

    if (userChange.previousValue && userChange.currentValue) {
      this.resetForm(
        userChange.currentValue.nickname,
        userChange.currentValue.email
      );
    }
  }

  onSubmit() {
    if (this.nickname && this.email) {
      this.addOrEdit.emit({
        ...this.user,
        nickname: this.nickname.value || '',
        email: this.email.value || '',
      });

      this.form.reset();
    }
  }

  handleResetClick() {
    if (this.user.id) {
      const nicknameInputValue = this.nickname?.value;
      const emailInputValue = this.email?.value;

      if (
        nicknameInputValue === this.user.nickname &&
        emailInputValue === this.user.email
      ) {
        this.cancel.emit(this.user);
      }
    }

    this.resetForm(this.user.nickname, this.user.email);
  }

  private resetForm(nickname: string, email: string) {
    this.form.reset({ nickname, email });
  }
}
