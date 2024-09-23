# TryTypeSpecEditor
[TypeSpec] の試し書きリポジトリ https://github.com/tshion/TryTypeSpec を基に、その編集UI を実装するリポジトリ。



## Getting started
1. `./schemas` にJSON Schema を配置する
    ```
    schemas/
        json-schema/*.json
        defaults.json
    ```
1. Node.js (※[バージョン情報](./.node-version)) が使える環境で `npm ci` を実行する
1. VSCode で `F5` キーを入力する (※ `npm start` + ブラウザ起動)



## Notes
### 初期生成時のコマンド
``` shell
npx -p @angular/cli@18.2.2 ng new try-typespec-editor --minimal --package-manager npm --routing false --skip-git --skip-install --ssr false --standalone --style css
```

### 入力形式の対応表
TypeSpec<br />(`※` は独自型) | (code)<br />(`※` は独自型) | HTML 入力欄
--- | --- | ---
`argb` ※ | `TEXT` | `input:text` + `pattern:^#[\dA-F]{8}$`
`boolean` | `CHECKBOX` | `input:checkbox`
`float` | `DOUBLE` ※ | `input:text` + `pattern:^\d+\.\d+$`
`integer` | `NUMBER` | `input:number` + ( `min` + `max` )
`integer \| integer` | `SELECT_INT` ※ | `select` + `<option>int</option>`
`latitude` ※ | `NUMBER` | `input:number` + `min:-90.0` + `max:90.0` + `step:0.000001`
`longitude` ※ | `NUMBER` | `input:number` + `min:-180.0` + `max:180.0` + `step:0.000001`
`rgb` ※ | `COLOR` | `input:color`
`string` | `TEXT` | `input:text`
`string \| string` | `SELECT_TEXT` ※ | `select` + `<option>text</option>`
`url` | `URL` | `input:url`



[TypeSpec]: https://typespec.io/
