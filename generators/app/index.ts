import Generator = require('yeoman-generator');
import yosay = require('yosay');

console.log(yosay('Enjoy your new 11ty plugin!'));
export default class extends Generator {
  private answers: Generator.Answers = {};

  constructor(args: any[], opts: Generator.GeneratorOptions) {
    super(args, opts);
    this.appname = 'your-new-plugin';
  }

  async prompting() {
    this.answers = await this.prompt([
      {
        type: 'input',
        name: 'name',
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
    ]);
  }

  writing() {
    this.fs.copyTpl(this.templatePath('gitignore'), this.destinationPath('.gitignore'));
    this.fs.copyTpl(this.templatePath('editorconfig'), this.destinationPath('.editorconfig'));
    this.fs.copyTpl(this.templatePath('prettierrc'), this.destinationPath('.prettierrc'));
    this.fs.copyTpl(this.templatePath('package.json'), this.destinationPath('.package.json'), {
      projectName: this.answers.name,
      projectScope: this.answers.scope,
    });
    this.fs.copyTpl(this.templatePath('src'), this.destinationPath('src'), {
      projectName: this.answers.name,
      projectScope: this.answers.scope,
    });
  }
}
