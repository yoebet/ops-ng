import { Component } from '@angular/core';

import { Theme, ThemeService } from '@/services/style/theme.service';

@Component({
  standalone: false,
  selector: 'app-theme-switch',
  templateUrl: './theme-switch.component.html',
})
export class ThemeSwitchComponent {
  options: Array<Theme>;

  constructor(private themeService: ThemeService) {
    this.options = themeService.options;
  }

  changeTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
  }
}
