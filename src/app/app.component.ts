/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { schemaData } from '../schema';
import { PropertyFormComponent } from './organisms/property-form.component';
import { SideMenuComponent } from './organisms/side-menu.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    PropertyFormComponent,
    SideMenuComponent,
  ],
  template: `
    <app-side-menu [formGroup]="form" />
    <main>
      <app-property-form [formGroup]="form" />
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

  protected form!: FormGroup;


  ngOnInit(): void {
    const controls: any = {};
    schemaData.groups.flatMap(group => group.items).forEach(item => {
      const children = item.value.map(value => new FormControl(value));
      controls[item.key] = new FormArray(children);
    });
    this.form = new FormGroup(controls);
  }
}
