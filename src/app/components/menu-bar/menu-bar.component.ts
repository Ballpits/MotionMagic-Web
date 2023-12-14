import { Component } from '@angular/core';

import { Mode } from 'src/app/model/modes.model';
import { ViewportModesSharedService } from 'src/app/services/viewport-modes-shared.service';

@Component({
  selector: 'menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css', '../../../styles.css'],
})
export class MenuBarComponent {
  constructor(private viewportModesSharedService: ViewportModesSharedService) {}

  ngOnInit(): void {
    this.viewportModesSharedService.setCurrentMode(this.selectedMode);
  }

  showDropdown: { [key: string]: boolean } = {};
  selectedMode: Mode = Mode.Construction;

  toggleDropdown(menu: string): void {
    this.showDropdown[menu] = !this.showDropdown[menu];
  }

  onModeChange() {
    if (this.selectedMode) {
      this.viewportModesSharedService.setCurrentMode(this.selectedMode);
    }
  }
}
