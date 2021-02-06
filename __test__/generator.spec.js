const path = require('path');
const chai = require('chai');
const rimraf = require('rimraf');
const helpers = require('yeoman-test');
const assert = require('yeoman-assert');

chai.should();

describe('11ty-plugin:app', () => {
  before((done) => {
    rimraf('./_project/**', (err) => {
      if (err) {
        console.error(err);
      }
      done();
    });
  });
  it('generate a project', function () {
    return (
      helpers
        .run(path.join(__dirname, '../generators/app'))
        /* .inDir(path.join(__dirname, '../_project'), (dir) => {
          console.log(dir);
        }) */
        .withPrompts({
          projectName: 'test-plugin',
          scope: 'test',
          description: 'test description',
          publishAccess: 'public',
          pluginName: 'plugin-name',
        })
        .then(function () {
          assert.file([
            'package.json',
            '.gitignore',
            '.editorconfig',
            '.npmignore',
            '.prettierrc',
            'tsconfig.json',
            'src/index.ts',
            'src/plugin.ts',
            'src/types.ts',
            '__test__/index.njk',
            '__test__/plugin.spec.js',
          ]);
          assert.jsonFileContent('package.json', {
            name: 'test/test-plugin',
            description: 'test description',
            publishConfig: { access: 'public' },
          });
          assert.fileContent('src/plugin.ts', /\'test:11typlugin:plugin\-name\'/);
        })
    );
  });
});
