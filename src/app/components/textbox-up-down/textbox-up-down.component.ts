import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'textbox-up-down',
  templateUrl: './textbox-up-down.component.html',
  styleUrls: ['./textbox-up-down.component.css'],
})
export class TextboxUpDownComponent {
  @Input() width: string = '100%'; // Default width is 100%
  @Input() value: number = 0;
  @Output() valueChanged = new EventEmitter<number>();

  increment() {
    this.value++;
    this.valueChanged.emit(this.value);
  }

  decrement() {
    this.value--;
    this.valueChanged.emit(this.value);
  }
}
