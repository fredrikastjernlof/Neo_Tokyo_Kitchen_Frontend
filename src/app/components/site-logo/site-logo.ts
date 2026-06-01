import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-site-logo',
  imports: [RouterLink],
  templateUrl: './site-logo.html',
  styleUrl: './site-logo.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SiteLogo {}