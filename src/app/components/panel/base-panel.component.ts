import { Component, Input } from '@angular/core';

@Component({
  selector: 'base-panel',
  templateUrl: './base-panel.component.html',
  styleUrls: ['./base-panel.component.css', '../../../styles.css'],
})
export class BasePanelComponent {
  @Input() title: string = 'Panel'; // Default title

  isCollapsed: boolean = false;

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;

    console.log('clicked');
  }
}
