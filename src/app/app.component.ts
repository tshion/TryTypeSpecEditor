import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PropertyFormComponent } from './organisms/property-form.component';
import { SideMenuComponent } from './organisms/side-menu.component';
import { PropertyFormService } from './services/property-form.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    PropertyFormComponent,
    SideMenuComponent,
  ],
  template: `
    <app-side-menu [formGroup]="propertyForm" />
    <main>
      <app-property-form [formGroup]="propertyForm" />
    </main>
  `,
  styles: [
    `:host {
      display: flex;
      flex-direction: row;
    }`,
    `main {
      background-color: var(--app-color-base);
      color: var(--app-color-base-on);
      flex-grow: 1;
      height: 100vh;
      overflow-y: auto;
      padding: 0 16px;
    }`,
  ],
})
export class AppComponent implements OnInit {

  protected propertyForm!: FormGroup;


  constructor(
    private readonly propertyFormService: PropertyFormService,
  ) {
  }


  ngOnInit(): void {
    this.propertyForm = this.propertyFormService.toFormGroup();
  }
}
