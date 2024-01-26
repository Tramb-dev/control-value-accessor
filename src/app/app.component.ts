import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { CustomInputComponent } from './custom-input/custom-input.component';

@Component({
  selector: 'custom-comp',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(blur)': '_onTouched()' },
  template: `
    Custom:
    <button (click)="onClick()">Counter is {{ counter }}</button>
  `,
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: CustomComp },
  ],
  styles: `:host { background: pink; height: 200px; display: flex; align-items: center; justify-content: center; }`,
})
export class CustomComp implements ControlValueAccessor {
  counter = 2;

  writeValue(value: number) {
    this.counter = value;
  }

  onClick(): void {
    this.onChange(++this.counter);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};
}

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, JsonPipe, CustomComp, CustomInputComponent],
  template: `<form [formGroup]="form">
      <app-custom-input formControlName="first" />
      <custom-comp formControlName="last" />
    </form>
    {{ form.value | json }}
    <button (click)="form.reset()">RESET</button>`,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly fb = inject(FormBuilder).nonNullable;

  form = this.fb.group({
    first: this.fb.control('test'),
    last: this.fb.control(5),
  });
}
