import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterLink } from '@angular/router'; 

import 'iconify-icon';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink],
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SiteHeader {}
