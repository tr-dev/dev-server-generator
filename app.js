'use strict';

const config   = require('./config.json')
const vorpal   = require('vorpal')();

const DigitalOceanHelper = require('./lib/DigitalOceanHelper');
const DO_KEY    = process.env.DO_KEY;
const PAGE_SIZE = process.env.PAGE_SIZE || 25;
const DOHelper  = new DigitalOceanHelper(DO_KEY, PAGE_SIZE);

const commands = require('./lib/commands')(config, DOHelper);

vorpal.command('list-images', 'List The images')
.action(commands["list-images"])

vorpal.command('keys <action> [key]')
.description('Commands to create, upload, and remove local ssh keys to digital ocean')
.option('-l, --local', '<action> applies to local ssh keys')
.option('-r, --remote', '<action> applies to remote ssh keys')
.action(commands.keys)

vorpal
  .delimiter('digitalocean-cli')
  .show();

