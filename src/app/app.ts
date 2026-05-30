import { Component, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

import { SiteHeader } from './components/site-header/site-header';
import { SiteFooter } from './components/site-footer/site-footer';
import { MainNav } from './components/main-nav/main-nav';
import { AdminHeader } from './components/admin-header/admin-header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SiteHeader, SiteFooter, MainNav, AdminHeader],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('frontend');

  isAdminRoute = signal(false);

  constructor(private router: Router) {
    this.isAdminRoute.set(this.router.url.startsWith('/admin'));

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isAdminRoute.set(this.router.url.startsWith('/admin'));
      });
  }
}