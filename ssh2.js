// ssh manager prototype
const Table = require('easy-table');
const input = require('input');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const shell = require('shelljs');

const { spawn } = require('child_process');

const scriptPath = './ssh2.sh'; // Replace with the actual path to your script

//adjust script permissions
const scriptPermissions = '755'; // Set the desired permissions (e.g., '755' for rwxr-xr-x)
const scriptPathAbsolute = path.resolve(scriptPath);
fs.chmod(scriptPathAbsolute, scriptPermissions, (err) => {
    if (err) {
        console.error(`Error setting permissions: ${err}`);
    } else {
        console.log(`Permissions set to ${scriptPermissions} for ${scriptPath}`);
    }
});



const child = spawn(scriptPath, [], { stdio: 'inherit', });

child.on('close', (code) => {
    console.log(`Bash script finished with code ${code}`);
    // You can perform actions after the script finishes here
});

child.on('error', (err) => {
    console.error(`Failed to start script: ${err}`);
});

//input.text('Enter the SSH command: ', { default: 'ssh samuel@samuelm.us.to' }).then(commandToRun => {
//    console.log(`You entered: ${commandToRun}`);
//});
