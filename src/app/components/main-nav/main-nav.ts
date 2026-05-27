import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterLink, RouterLinkActive} from '@angular/router';
import 'iconify-icon';

@Component({
  selector: 'app-main-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './main-nav.html',
  styleUrl: './main-nav.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MainNav {}
