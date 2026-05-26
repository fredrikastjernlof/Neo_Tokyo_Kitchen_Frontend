import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SiteHeader } from './components/site-header/site-header';
import { SiteFooter } from './components/site-footer/site-footer';
import { MainNav } from './components/main-nav/main-nav';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SiteHeader, SiteFooter, MainNav],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('frontend');
}
