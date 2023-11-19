import { Component, Input } from '@angular/core';

@Component({
  selector: 'textbox-up-down',
  templateUrl: './textbox-up-down.component.html',
  styleUrls: ['./textbox-up-down.component.css'],
})
export class TextboxUpDownComponent {
  @Input() width: string = '100%'; // Default width is 100%

  value: number = 0;

  increment() {
    this.value++;
  }

  decrement() {
    this.value--;
  }
}
