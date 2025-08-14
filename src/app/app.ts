import { Component, inject, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PropertyForm } from './organisms/property-form';
import { SideMenu } from './organisms/side-menu';
import { SchemaFormService } from './services/schema-form.service';

@Component({
  selector: 'app-root',
  imports: [
    PropertyForm,
    SideMenu,
  ],
  template: `
    <app-side-menu [(formGroup)]="propertyForm" />
    <main>
      <app-property-form [formGroup]="propertyForm()" />
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
export class App {

  private readonly schemaFormService = inject(SchemaFormService);

  protected readonly propertyForm = signal<FormGroup>(this.schemaFormService.newFormGroup());
}
