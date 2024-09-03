import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  template: `
    <nav class="pure-menu pure-menu-scrollable">
      aaa
    </nav>
    <main>
      bbb
      <button class="pure-button">ccc</button>
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
      overflow-y: scroll;
    }`,
    `nav {
      background-color: var(--app-color-main);
      color:  var(--app-color-main-on);
      height: 100vh;
      width: 360px;
    }`,
  ],
})
export class AppComponent {
}
