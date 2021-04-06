const { AutoComplete, prompt } = require('enquirer');
const { copyMagentoFile } = require('./copyThemeHelper');
const path = require('path')
const FileHound = require('filehound');
const themesDir = path.resolve(process.cwd(), './dev/tools/frontools/config/themes.json')
const themesConfig = require(themesDir)

async function init() {
    const themeChoices = Object.keys(themesConfig)

    const response = await prompt([
        {
            type: 'select',
            name: 'parentTheme',
            message: 'Pick your parent theme:',
            limit: 10,
            choices: themeChoices
        },
        {
            type: 'select',
            name: 'childTheme',
            message: 'Pick your child theme:',
            limit: 10,
            choices: themeChoices
        },
        {
            type: 'select',
            name: 'fileType',
            message: 'Pick your file type:',
            limit: 10,
            initial: 2,
            choices: ['scss', 'js', 'phtml']
        },
      ]);

      async function fileToCopy(response) {
        const parentTheme = themesConfig[response.parentTheme];
        const childTheme = themesConfig[response.childTheme];
        const parentThemeDirectory = themesConfig[response.parentTheme].src;
        const fileTypeRequested = response.fileType;

        const foundFiles = FileHound.create()
            .paths(parentThemeDirectory)
            .ext(fileTypeRequested)
            .find()
            .then((files) => {
                const prompt = new AutoComplete({
                    name: 'file',
                    message: 'Choose your file to copy: (This file will be committed immediately)',
                    limit: 10,
                    choices: files
                });

                prompt.run()
                    .then((answer) => {
                        copyMagentoFile(answer, parentTheme, childTheme)
                    })
                    .catch(console.error);
            })
      }

      fileToCopy(response)
 }

 init();



