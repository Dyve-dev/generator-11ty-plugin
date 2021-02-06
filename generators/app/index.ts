import Generator = require('yeoman-generator');
import childProc = require('child_process');
import url = require('url');
import yosay = require('yosay');
import slug = require('slugify');

console.log(yosay('Enjoy your new 11ty plugin!'));

export default class extends Generator {
  private answers: Generator.Answers = {};
  private metadata: Record<string, any> = {
    gitRepo: undefined,
    bugsUrl: undefined,
    homeUrl: undefined,
  };

  constructor(args: any[], opts: Generator.GeneratorOptions) {
    super(args, opts);
    this.appname = 'your-new-plugin';
    this._gitRepo();
  }

  _gitRepo() {
    this.log('gitRepo');
    let stdout: string;
    try {
      const git = childProc.spawn('git', ['config', '--get', 'remote.origin.url']);
      git.stdout.on('data', (data) => {
        //this.log(`stdout: ${data}`);
        stdout = data;
      });

      git.stderr.on('data', (data) => {
        this.log(`stderr: ${data}`);
      });

      git.on('error', (error) => {
        this.log(`error: ${error.message}`);
      });

      git.on('close', (code) => {
        if (code === 0) {
          const _url = new url.URL(String(stdout).split('\n')[0]);
          this.metadata.gitRepo = String(_url);
          const pathParts = _url.pathname.split('/');
          pathParts[pathParts.length - 1] = pathParts[pathParts.length - 1].replace('.git', '');
          _url.pathname = pathParts.join('/');
          if (url) {
            this.metadata.bugsUrl = String(_url) + '/issues';
            this.metadata.homeUrl = String(_url) + '#readme';
          }
        }
      });
    } catch (err) {
      this.log.error(err);
    }
  }
  async prompting() {
    this.answers = await this.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Your project name',
        default: this.appname, // Default to current folder name
      },
      {
        type: 'input',
        name: 'scope',
        message: 'Your project scope (Optional)',
        default: undefined,
        validate: function (input: string) {
          if (input) {
            if (!input.startsWith('@')) {
              return 'Your scope must start with `@` > try: @' + input;
            }
          }
          return true;
        },
      },
      {
        type: 'input',
        name: 'description',
        message: 'project description (Optional)',
        default: undefined,
      },
      {
        type: 'list',
        name: 'publishAccess',
        message: 'publishConfig access',
        default: 0,
        choices: ['public', 'private'],
      },
      {
        type: 'input',
        name: 'pluginName',
        message: `plugin name (Optional)`,
        default: undefined,
        filter: function (input) {
          if (input) {
            return slug.default(input);
          }
          return input;
        },
      },
    ]);
  }

  writing() {
    this.fs.copyTpl(this.templatePath('gitignore'), this.destinationPath('.gitignore'));
    this.fs.copyTpl(this.templatePath('npmignore'), this.destinationPath('.npmignore'));
    this.fs.copyTpl(this.templatePath('tsconfig.json'), this.destinationPath('tsconfig.json'));
    this.fs.copyTpl(this.templatePath('editorconfig'), this.destinationPath('.editorconfig'));
    this.fs.copyTpl(this.templatePath('prettierrc'), this.destinationPath('.prettierrc'));
    this.fs.copyTpl(this.templatePath('__test__'), this.destinationPath('__test__'));
    this.fs.copyTpl(this.templatePath('package.json'), this.destinationPath('package.json'), {
      ...this.metadata,
      ...this.answers,
    });
    this.fs.copyTpl(this.templatePath('src'), this.destinationPath('src'), {
      ...this.metadata,
      ...this.answers,
    });
  }
  install() {
    this.spawnCommandSync('npx', ['ncu', '-u']);
    this.installDependencies({
      bower: false,
      npm: true,
    });
  }
}
