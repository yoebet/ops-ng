import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { StyleManager } from './style-manager';

export interface Theme {
  backgroundColor: string;
  buttonColor: string;
  headingColor: string;
  label: string;
  value: string;
  darkTheme: boolean;
}

@Injectable()
export class ThemeService {

  currentTheme: Theme;
  themeSubject: Subject<Theme> = new Subject();

  options: Theme[] = [
    // {
    //   backgroundColor: '#fff',
    //   buttonColor: '#ff4081',
    //   headingColor: '#3f51b5',
    //   label: 'Indigo & Pink',
    //   value: 'indigo-pink',
    //   darkTheme: false
    // },
    // {
    //   backgroundColor: '#fff',
    //   buttonColor: '#ffc107',
    //   headingColor: '#673ab7',
    //   label: 'Deeppurple & Amber',
    //   value: 'deeppurple-amber',
    //   darkTheme: false
    // },
    {
      backgroundColor: '#fff8f8',
      buttonColor: '#ba005c',
      headingColor: '#74565d',
      label: 'Rose & Red',
      value: 'rose-red',
      darkTheme: false
    },
    {
      backgroundColor: '#faf9fd',
      buttonColor: '#005cbb',
      headingColor: '#565e71',
      label: 'Azure & Blue',
      value: 'azure-blue',
      darkTheme: false
    },
    // {
    //   backgroundColor: '#303030',
    //   buttonColor: '#607d8b',
    //   headingColor: '#e91e63',
    //   label: 'Pink & Bluegrey',
    //   value: 'pink-bluegrey',
    //   darkTheme: true
    // },
    // {
    //   backgroundColor: '#303030',
    //   buttonColor: '#4caf50',
    //   headingColor: '#9c27b0',
    //   label: 'Purple & Green',
    //   value: 'purple-green',
    //   darkTheme: true
    // },
    {
      backgroundColor: '#161215',
      buttonColor: '#ffabf3',
      headingColor: '#dabfd2',
      label: 'Magenta & Violet',
      value: 'magenta-violet',
      darkTheme: true
    },
    {
      backgroundColor: '#101414',
      buttonColor: '#00dddd',
      headingColor: '#b0cccb',
      label: 'Cyan & Orange',
      value: 'cyan-orange',
      darkTheme: true
    }
  ];

  defaultTheme: Theme = this.options[0];

  constructor(
    private styleManager: StyleManager
  ) {
  }

  getTheme(key: string): Theme {
    return this.options.find(t => t.value === key);
  }

  setDefaultTheme(): void {
    const themeKey = localStorage.getItem('theme');
    if (themeKey) {
      const theme = this.getTheme(themeKey);
      if (theme) {
        this.setTheme(theme);
        return;
      }
    }
    this.setTheme(this.defaultTheme);
  }

  setTheme(theme: Theme): void {
    this.styleManager.setStyle(
      'theme',
      `assets/${theme.value}.css`
    );
    localStorage.setItem('theme', theme.value);
    this.currentTheme = theme;
    this.themeSubject.next(theme);
  }
}
