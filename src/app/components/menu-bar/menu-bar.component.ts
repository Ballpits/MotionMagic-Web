import { Component } from '@angular/core';

@Component({
  selector: 'menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css', '../../../styles.css'],
})
export class MenuBarComponent {
  showDropdown: { [key: string]: boolean } = {};

  toggleDropdown(menu: string): void {
    this.showDropdown[menu] = !this.showDropdown[menu];

    console.log(this.showDropdown[menu]);
  }
}
