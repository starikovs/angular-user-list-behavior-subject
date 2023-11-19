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
          [class.is-invalid]="form.invalid && !form.pristine"
          type="text"
          placeholder="User nickname"
          class="form-control"
          id="nickname"
        />
        <div *ngIf="form.invalid && !form.pristine" class="invalid-feedback">
          Should be required and something more
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
        Validators.minLength(3),
        Validators.maxLength(5),
      ]),
    ],
  });

  ngOnChanges(sc: SimpleChanges) {
    const userChange: SimpleChange = sc['user'];

    if (userChange.previousValue && userChange.currentValue) {
      this.resetForm(userChange.currentValue.nickname);
    }
  }

  onSubmit() {
    const nicknameControl = this.form.get('nickname');

    if (nicknameControl) {
      this.addOrEdit.emit({
        ...this.user,
        nickname: nicknameControl.value || '',
      });

      this.form.reset();
    }
  }

  handleResetClick() {
    if (this.user.id) {
      const nicknameInputValue = this.form.get('nickname')?.value;

      if (nicknameInputValue === this.user.nickname) {
        this.cancel.emit(this.user);
      }
    }

    this.resetForm(this.user.nickname);
  }

  private resetForm(nickname: string) {
    this.form.reset({ nickname });
  }
}
