#!/bin/bash
const program = require('commander');
const db = require('./db');
const api = require('./index')
const pkg = require('./package.json')
program.version(pkg.version)
program
    .option('-x, --xxx', 'what the x')
program
    .command('add')
    .description('add a task')
    .action((...args) => {
        const words = args.slice(0, -1).join(' ')
        api.add(words).then(() => { console.log('添加成功') })
    });
program
    .command('clear')
    .description('clear a task')
    .action((source, destination) => {
        api.clear().then(() => { console.log('清除完毕') })
    });


program.parse(process.argv);
if (process.argv.length === 2) {
    api.showAll()
}