const fs = require('fs');
const path = require('path');

/**
 * JSON Schema から入力の書式データへ変換
 */
+function (
  /** 書式バージョン @type{string} */
  version,
) {
  /** プロジェクトルートのパス*/
  const rootPath = __dirname;


  // JSON Schema の読み込み
  const jsonSchemas = (dirPath => {
    const pathList = fs.readdirSync(dirPath)
      .filter(filename => filename.endsWith('.json'))
      .map(filename => path.join(dirPath, filename));

    const result = [];
    pathList.forEach(filePath => {
      const file = fs.readFileSync(filePath).toString();
      if (file.includes('"properties": {')) {
        const obj = JSON.parse(file);
        result.push({
          name: path.basename(filePath).replace('.json', ''),
          description: obj['description'],
          schema: obj['properties'],
        });
      }
    });
    return result;
  })(path.join(rootPath, 'schemas', 'json-schema'));


  // 配列型のデフォルト値の読み込み
  const arrayDefaults = (filePath => {
    const file = fs.readFileSync(filePath).toString();
    return file ? JSON.parse(file) : {};
  })(path.join(rootPath, 'schemas', 'defaults.json'));


  // 入力の書式データへ変換
  const groups = [];
  const fxGetType = (prop) => {
    return prop['type']
      ?? prop['$ref']
      ?? (prop['anyOf'] ? 'anyOf' : undefined);
  };
  for (const domain of jsonSchemas) {
    const list = [];
    for (const [k, v] of Object.entries(domain.schema)) {
      const isArray = v['type'] === 'array';
      const type = isArray ? fxGetType(v['items']) : fxGetType(v);

      const item = {
        isArray: isArray,
        key: k,
        label: v['description'],
        value: isArray ? arrayDefaults[k] : [v['default']],
      };
      switch (type) {
        case 'anyOf':
          item['inputType'] = 'select';
          item['options'] = (isArray ? v['items']['anyOf'] : v['anyOf'])
            .map(x => x['const']);
          break;
        case 'boolean':
          item['inputType'] = 'checkbox';
          break;
        case 'integer':
          item['inputType'] = 'number';
          item['min'] = v['minimum'];
          item['max'] = v['maximum'];
          break;
        case 'number':
          item['inputType'] = 'textbox';
          item['pattern'] = /^\d+\.\d+$/.source;
          break;
        case 'string':
          switch (v['format']) {
            case 'uri':
              item['inputType'] = 'url';
              break;
            default:
              item['inputType'] = 'textbox';
          }
          break;
        case '#/$defs/argb':
          item['inputType'] = 'textbox';
          item['pattern'] = /^#[\dA-F]{8}$/.source;
          break;
        case '#/$defs/latitude':
          item['inputType'] = 'number';
          item['min'] = -90.0;
          item['max'] = 90.0;
          item['step'] = 0.000001;
          break;
        case '#/$defs/longitude':
          item['inputType'] = 'number';
          item['min'] = -180.0;
          item['max'] = 180.0;
          item['step'] = 0.000001;
          break;
        case '#/$defs/rgb':
          item['inputType'] = 'color';
          break;
        default:
          throw Error(`${k}: Undefined type!`);
      }
      list.push(item);
    }
    groups.push({
      name: domain.name,
      description: domain.description,
      items: list,
    });
  }


  // 入力書式データのファイル出力
  const template = fs.readFileSync(path.join(rootPath, `convert-schema.template.ts`)).toString()
    .replace('%%VERSION%%', version)
    .replace('[/** Data */]', JSON.stringify(groups, null, 4));
  fs.writeFileSync(
    path.join(rootPath, 'src', 'schema.ts'),
    template,
    { encoding: 'utf-8' },
  );
}(
  process.argv[2],
);
