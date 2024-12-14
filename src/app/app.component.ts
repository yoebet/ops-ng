import { Component, OnInit } from '@angular/core';
import { ThemeService } from '@/services/style/theme.service';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  constructor(private themeService: ThemeService) {
  }

  async ngOnInit() {
    this.themeService.setDefaultTheme();
  }
}
