// ssh manager prototype
const Table = require('easy-table');
const input = require('input');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const shell = require('shelljs');

const { spawn } = require('child_process');

const scriptPath = '/home/samuel/Code_bin/ssh2/ssh2.sh'; // Replace with the actual path to your script

const child = spawn(scriptPath, [], {  stdio: 'inherit',});

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
