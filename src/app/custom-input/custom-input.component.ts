import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-custom-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: CustomInputComponent,
    },
  ],
  templateUrl: './custom-input.component.html',
  styleUrl: './custom-input.component.scss',
})
export class CustomInputComponent implements OnDestroy, ControlValueAccessor {
  input = new FormControl('');
  subscriptions: Subscription[] = [];

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  writeValue(input: string) {
    this.input.setValue(input);
  }

  // Step 5: Listen to value changes on the form control. If something happens, the function provided by Angular will be called and the outside world will be informed.
  registerOnChange(fn: any): void {
    this.subscriptions.push(this.input.valueChanges.subscribe(fn));
  }

  onTouch: any = () => {};
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
}
