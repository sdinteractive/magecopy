const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

var copyMagentoFile = function(fileName, parent, child) {
    const parentEnv = parent.src;
    const themeEnv = child.src;
    const filePath = fileName.replace(parentEnv, '');
    const parentFileToCopy = `${parentEnv}/${filePath}`;
    const themeFile = `${themeEnv}${filePath}`;

    fs.promises.mkdir(path.parse(themeFile).dir, { recursive: true }, (err) => {
        if (err) throw err;
    }).then(() => {
      fs.createReadStream(parentFileToCopy).pipe(fs.createWriteStream(themeFile));
      commitFile(themeFile);
    });
}

const commitFile = (themeFile) => {
    const fileName = path.parse(themeFile).base;
    exec(`git add ${themeFile} && git commit -m "Copy ${fileName} to override \n\nCopying ${themeFile} to theme to override." `, (err, stdout, stderr) => {
        if (err) {
          console.log('This file may have already been committed.')
          return;
        }

        console.log(`File copied to theme. Committing ${themeFile}`);
      });
}

module.exports = {copyMagentoFile, commitFile};
