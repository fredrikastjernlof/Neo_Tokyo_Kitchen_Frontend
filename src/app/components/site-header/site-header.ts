import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SiteLogo } from '../site-logo/site-logo';

@Component({
  selector: 'app-site-header',
  imports: [ SiteLogo ],
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SiteHeader {}
