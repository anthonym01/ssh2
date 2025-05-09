// ssh manager prototype
const Table = require('easy-table');
const input = require('input');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const shell = require('shelljs');


input.text('Enter the SSH command: ', { default: 'ssh samuel@samuelm.us.to' }).then(commandToRun => {
    console.log(`You entered: ${commandToRun}`);
    // Here you can add the logic to execute the SSH command
    // For example, using child_process.exec or a similar method

    // Command to run after Node.js exits

    // Function to execute the terminal command
    function runCommand(command) {
        shell.exec(command, { async: true }, (code, stdout, stderr) => {
            if (code !== 0) {
                console.error(`Error executing command: ${stderr}`);
            } else {
                console.log(`Command output: ${stdout}`);
            }
        });
    }

    // Gracefully exit the Node.js process
    function gracefulExit() {
        console.log('Node.js process is exiting...');
        // Perform any necessary cleanup here (e.g., closing database connections)
        process.exit(0); // Exit with a success code
    }

    // Call gracefulExit after a certain condition or event
    // For example, after a timeout:

    runCommand(commandToRun);
    //gracefulExit();


    // Or perhaps in response to a specific event:
    // process.on('SIGINT', () => { // Handle Ctrl+C
    //   gracefulExit();
    //   runCommand(commandToRun);
    // });

}).catch(err => {
    console.error('Error:', err);
});
