#! /usr/bin/env node

const { program } = require('commander');
const fs = require('fs');
const path = require('path');
const FileHound = require('filehound');

program.name('magecopy').usage('[copy]');

program
    .helpOption('-h, --help', 'Show this command summary.')
    .addHelpCommand(false);

program
    .command('copy')
    .description(
        'Generate optimization configuration based on given page URLs.'
    )
    .action((config) => {
        require('./cli')
    });

program.parse(process.argv);