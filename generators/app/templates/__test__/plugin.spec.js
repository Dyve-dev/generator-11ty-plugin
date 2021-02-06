const fs = require('fs');
const { join } = require('path');
const chai = require('chai');
const { spawn } = require('child_process');
const { Plugin } = require('../plugin/plugin');
const rimraf = require('rimraf');

chai.should();

describe('PLUGIN', () => {
  before((done) => {
    rimraf('./_site/**', (err) => {
      if (err) {
        console.error(err);
      }
      done();
    });
  });
  it('eleventy should run', (done) => {
    const eleventy = spawn('npx', ['eleventy']);
    eleventy.on('close', (code) => {
      code.should.equal(0);
      done();
    });
  });
  it('_site/index.html is created', async () => {
    const exist = fs.existsSync(join(__dirname, '_site/index.html'));
    exist.should.be.true;
  });
  it('_site/index.html should not be empty', async () => {
    const content = fs.readFileSync(join(__dirname, '_site/index.html'), 'utf-8');
    content.length.should.gt(600);
  });
});
