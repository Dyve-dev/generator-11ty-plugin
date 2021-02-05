"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Generator = require("yeoman-generator");
const yosay = require("yosay");
console.log(yosay('Enjoy your new 11ty plugin!'));
class default_1 extends Generator {
    constructor(args, opts) {
        super(args, opts);
        this.answers = {};
        this.appname = 'your-new-plugin';
    }
    async prompting() {
        this.answers = await this.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Your project name',
                default: this.appname,
            },
            {
                type: 'input',
                name: 'scope',
                message: 'Your project scope (Optional)',
                default: undefined,
                validate: function (input) {
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
exports.default = default_1;
