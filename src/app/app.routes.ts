import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Menu } from './pages/menu/menu';
import { Booking } from './pages/booking/booking';
import { Contact } from './pages/contact/contact';
import { About } from './pages/about/about';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'menu', component: Menu },
    { path: 'booking', component: Booking },
      { path: 'contact', component: Contact },
    { path: 'about', component: About },
    { path: '**', redirectTo: '' }
];
