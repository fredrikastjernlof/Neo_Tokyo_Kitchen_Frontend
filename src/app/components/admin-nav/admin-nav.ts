import { Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { RouterLink, RouterLinkActive} from '@angular/router';
import 'iconify-icon';

@Component({
  selector: 'app-admin-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './admin-nav.html',
  styleUrl: './admin-nav.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminNav {}
