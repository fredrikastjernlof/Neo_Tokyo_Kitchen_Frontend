import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Menu } from './pages/menu/menu';
import { Booking } from './pages/booking/booking';
import { Contact } from './pages/contact/contact';
import { About } from './pages/about/about';
import { AdminLogin } from './pages/admin-login/admin-login';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { AdminBookings } from './pages/admin-bookings/admin-bookings';
import { AdminMenu } from './pages/admin-menu/admin-menu';
import { AdminStaff } from './pages/admin-staff/admin-staff';
import { authGuard } from './guards/auth-guard';
import { Accessibility } from './pages/accessibility/accessibility';
import { Privacy } from './pages/privacy/privacy';
import { ImageCredits } from './pages/image-credits/image-credits';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'menu', component: Menu },
  { path: 'booking', component: Booking },
  { path: 'contact', component: Contact },
  { path: 'about', component: About },
  { path: 'accessibility', component: Accessibility },
  { path: 'privacy', component: Privacy },
  { path: 'credits', component: ImageCredits },
  { path: 'admin/login', component: AdminLogin },
  { path: 'admin/dashboard', component: AdminDashboard,canActivate: [authGuard], },
  { path: 'admin/bookings', component: AdminBookings, canActivate: [authGuard], },
  { path: 'admin/menu', component: AdminMenu, canActivate: [authGuard], },
  { path: 'admin/staff', component: AdminStaff, canActivate: [authGuard], },
  { path: "404", component: NotFound},
  { path: "**", redirectTo: "404", pathMatch: "full"}
];
