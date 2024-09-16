const fs = require('fs');
const path = require('path');

/**
 * JSON Schema から編集項目データへ変換
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
        case 'anyOf': {
          const options = isArray ? v['items']['anyOf'] : v['anyOf'];
          if(options[0]['type'] === 'number') {
            item['inputFormat'] = 'select_int';
          } else {
            item['inputFormat'] = 'select_text';
          }
          item['options'] = options.map(x => x['const']);
          break;
        }
        case 'boolean':
          item['inputFormat'] = 'checkbox';
          break;
        case 'integer':
          item['inputFormat'] = 'number';
          item['min'] = v['minimum'];
          item['max'] = v['maximum'];
          break;
        case 'number':
          item['inputFormat'] = 'double';
          break;
        case 'string':
          switch (v['format']) {
            case 'uri':
              item['inputFormat'] = 'url';
              break;
            default:
              item['inputFormat'] = 'text';
          }
          break;
        case '#/$defs/argb':
          item['inputFormat'] = 'text';
          item['pattern'] = /^#[\dA-F]{8}$/.source;
          break;
        case '#/$defs/latitude':
          item['inputFormat'] = 'number';
          item['min'] = -90.0;
          item['max'] = 90.0;
          item['step'] = 0.000001;
          break;
        case '#/$defs/longitude':
          item['inputFormat'] = 'number';
          item['min'] = -180.0;
          item['max'] = 180.0;
          item['step'] = 0.000001;
          break;
        case '#/$defs/rgb':
          item['inputFormat'] = 'color';
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
