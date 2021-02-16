"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Generator = require("yeoman-generator");
const childProc = require("child_process");
const url = require("url");
const yosay = require("yosay");
const slug = require("slugify");
console.log(yosay('Enjoy your new 11ty plugin!'));
class default_1 extends Generator {
    constructor(args, opts) {
        super(args, opts);
        this.answers = {};
        this.metadata = {
            gitRepo: undefined,
            bugsUrl: undefined,
            homeUrl: undefined,
        };
        this.appname = 'your-new-plugin';
        this._gitRepo();
    }
    _gitRepo() {
        this.log('gitRepo');
        let stdout;
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
        }
        catch (err) {
            this.log.error(err);
        }
    }
    async prompting() {
        this.answers = await this.prompt([
            {
                type: 'input',
                name: 'projectName',
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
    configuring() {
        this.fs.copyTpl(this.templatePath('config/gitignore'), this.destinationPath('.gitignore'));
        this.fs.copyTpl(this.templatePath('config/npmignore'), this.destinationPath('.npmignore'));
        this.fs.copyTpl(this.templatePath('config/tsconfig'), this.destinationPath('tsconfig.json'));
        this.fs.copyTpl(this.templatePath('config/editorconfig'), this.destinationPath('.editorconfig'));
        this.fs.copyTpl(this.templatePath('config/prettierrc'), this.destinationPath('.prettierrc'));
        this.fs.copyTpl(this.templatePath('config/eleventy.js'), this.destinationPath('__test__/.eleventy.js'));
        this.fs.copyTpl(this.templatePath('config/package.json'), this.destinationPath('package.json'), Object.assign(Object.assign({}, this.metadata), this.answers));
    }
    writing() {
        this.fs.copyTpl(this.templatePath('__test__'), this.destinationPath('__test__'));
        this.fs.copyTpl(this.templatePath('src'), this.destinationPath('src'), Object.assign(Object.assign({}, this.metadata), this.answers));
    }
    install() {
        this.spawnCommandSync('npx', ['ncu', '-u']);
        this.installDependencies({
            bower: false,
            npm: true,
        });
    }
}
exports.default = default_1;
