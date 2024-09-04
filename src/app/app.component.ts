import { Component } from '@angular/core';
import { schemaData } from '../schema';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  template: `
    <nav class="pure-menu pure-menu-scrollable">
      <hgroup>
        <h1>TypeSpecEditor</h1>
        {{ appVersion }}
      </hgroup>
      <hr />
      <form class="pure-form pure-form-stacked">
        <input type="file" accept="application/json" class="pure-input-1" />

        <label for="meta-title">タイトル</label>
        <input type="text" id="meta-title" class="pure-input-1" />

        <button type="button" class="pure-button">ファイル出力</button>
      </form>
      <hr />
      <ul class="pure-menu-list">
        <li class="pure-menu-item">
          <a href="https://www.google.com/maps" class="pure-menu-link">Google Map</a>
        </li>
      </ul>
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
      overflow-y: auto;
    }`,
    `nav {
      background-color: var(--app-color-main);
      color:  var(--app-color-main-on);
      height: 100vh;
      overflow-y: auto;
      width: 360px;
    }`,
    `nav > form {
      padding: 8px 16px;
    }`,
    `nav > hgroup {
      padding: 16px;
    }`,
    `nav > hgroup > h1 {
      margin: 0 0 8px 0;
    }`,
  ],
})
export class AppComponent {

  public readonly appVersion = schemaData.version;
}
