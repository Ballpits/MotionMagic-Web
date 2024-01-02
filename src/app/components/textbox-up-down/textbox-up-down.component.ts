import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';

@Component({
  selector: 'textbox-up-down',
  templateUrl: './textbox-up-down.component.html',
  styleUrls: ['./textbox-up-down.component.css', '../../../styles.css'],
})
export class TextboxUpDownComponent {
  @Input() public width: string = '100%';
  @Input() protected _value!: string;
  @Output() public valueChanged = new EventEmitter<number>();

  private previousValue!: string; // Used to store the previous valid value.

  @Input()
  set value(newValue: string) {
    this._value = newValue;
    this.previousValue = newValue;
  }

  get value(): string {
    return this._value;
  }

  @HostListener('keydown.enter', ['$event'])
  onEnter(event: KeyboardEvent): void {
    event.preventDefault();

    this.updateValue();
  }

  @HostListener('blur', ['$event'])
  onBlur(event: FocusEvent): void {
    // When the input loses focus, update the value.
    this.updateValue();
  }

  private sanitizeInput(input: string): string {
    // Use a regex to allow only specified characters.
    return input.replace(/[^1234567890+\-*/.()]/g, '');
  }

  private evaluateExpression(expression: string): number | undefined {
    try {
      return eval(expression);
    } catch (error) {
      return undefined;
    }
  }

  updateValue(): void {
    const sanitizedValue: string = this.sanitizeInput(this._value);
    const result: number | undefined = this.evaluateExpression(sanitizedValue);

    if (result !== undefined && result !== Infinity) {
      this._value = result.toString();
      this.previousValue = this._value;
      this.valueChanged.emit(result);
    } else {
      // If evaluation failed, revert to the previous valid value.
      this._value = this.previousValue;
    }
  }

  increment(): void {
    this._value = String(Number(this._value) + 1);
    this.updateValue();
  }

  decrement(): void {
    this._value = String(Number(this._value) - 1);
    this.updateValue();
  }
}
