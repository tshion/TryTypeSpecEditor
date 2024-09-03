import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  template: `
    <nav class="pure-menu pure-menu-scrollable">
    </nav>
    <main>
    </main>
  `,
  styles: [
    `:host {
      display: flex;
      flex-direction: row;
    }`,
    `main {
      flex-grow: 1;
      height: 100vh;
      overflow-y: scroll;
    }`,
    `nav {
      background-color: #333333;
      color: #FFFFFF;
      height: 100vh;
      width: 360px;
    }`,
  ],
})
export class AppComponent {
}
