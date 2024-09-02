# TryTypeSpecEditor
試し書きしたTypeSpec を基に、編集UI を実装するリポジトリ。



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
