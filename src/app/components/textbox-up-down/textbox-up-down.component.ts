import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'textbox-up-down',
  templateUrl: './textbox-up-down.component.html',
  styleUrls: ['./textbox-up-down.component.css', '../../../styles.css'],
})
export class TextboxUpDownComponent {
  @Input() width: string = '100%'; // Default width is 100%
  @Input() value: number = 0;
  @Output() valueChanged = new EventEmitter<number>();

  updateValue(): void {
    this.valueChanged.emit(Number(this.value) || 0);
  }

  increment() {
    this.value++;
    this.updateValue();
  }

  decrement() {
    this.value--;
    this.updateValue();
  }

  onKeyPressEventHandler(event: any): void {
    if (event.key === 'Enter') {
      this.updateValue();
    }
  }
}
