import chalk from 'chalk';
import { program } from 'commander';
import inquirer from 'inquirer';
import ora from 'ora';
import generateJSDoc from './generateJSDoc.js';

program.version("1.0.0").description("JSDoc Generator CLI");

program
    .command('generate')
    .description('Generate JSDoc comments')
    .action(() => {
        inquirer.prompt([
            {
                type: "input",
                name: "code",
                message: "Enter your JavaScript function or line of code:",
            }
        ])
        .then((answers) => {
            const spinner = ora('Generating JSDoc comments...').start();
            setTimeout(() => {
                const jsdoc = generateJSDoc(answers.code);
                spinner.succeed("JSDoc comments generated!");
                console.log(chalk.green(jsdoc));
            }, 1000);
        });
    });

program.parse(process.argv);
