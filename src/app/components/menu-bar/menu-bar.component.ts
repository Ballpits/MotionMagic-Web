import { Component, ElementRef, HostListener } from '@angular/core';

import { Mode } from 'src/app/model/modes.model';
import { ViewportModesSharedService } from 'src/app/services/viewport-modes-shared.service';

@Component({
  selector: 'menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css', '../../../styles.css'],
})
export class MenuBarComponent {
  constructor(
    private viewportModesSharedService: ViewportModesSharedService,
    private elementRef: ElementRef,
  ) {}

  ngOnInit(): void {
    this.viewportModesSharedService.setCurrentMode(this.selectedMode);
  }

  showDropdown: { [key: string]: boolean } = {};
  activeTab: string | null = null;
  selectedMode: Mode = Mode.Construction;

  closeAllDropdownExcept(menu: string): void {
    // Close all other except 'menu' dropdowns.
    Object.keys(this.showDropdown).forEach((key) => {
      if (key !== menu) {
        this.showDropdown[key] = false;
      }
    });
  }

  toggleDropdown(menu: string): void {
    this.closeAllDropdownExcept(menu);
    this.showDropdown[menu] = !this.showDropdown[menu];
    this.activeTab = this.showDropdown[menu] ? menu : null;
  }

  openDropdown(menu: string): void {
    if (this.activeTab !== null) {
      this.closeAllDropdownExcept(menu);
      this.showDropdown[menu] = true;
      this.activeTab = this.showDropdown[menu] ? menu : null;
    }
  }

  onModeChange() {
    if (this.selectedMode) {
      this.viewportModesSharedService.setCurrentMode(this.selectedMode);
    }
  }

  @HostListener('document:click', ['$event'])
  @HostListener('document:touchend', ['$event'])
  handleDocumentClick(event: Event): void {
    // Close dropdowns if the click or tap is outside the menu.
    if (!this.elementRef.nativeElement.contains(event.target)) {
      Object.keys(this.showDropdown).forEach((key) => {
        this.showDropdown[key] = false;
      });

      this.activeTab = null; // Remove active tab when closing dropdowns.
    }
  }
}
