// Project: ssh3
// Prototype ssh session manager
// Author: Samuel M. <
//


const { spawn } = require('child_process');
const fs = require('fs');

let verbose = false;
// get any arguments passed to the script
const args = process.argv.slice(2);

let config = {
    data: {},
    save: function () {
        if (verbose) {
            console.debug("Saving config");
        }
        fs.writeFileSync('./config.json', JSON.stringify(this.data));
    },
    load: function () {
        if (verbose) {
            console.debug("Loading config");
        }
        try {
            this.data = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
        } catch (err) {
            console.error('Error reading config file:', err);
            this.data = {};
            if (verbose) {
                console.debug("Creating new config file");
            }
            this.save();
        }
    }
}

let ssh3 = {
    test: function () {
        console.log("test");
        const command = 'ssh'; // The command you want to run
        const args = ['samuel@samuelm.us.to', '-p 22']; // Arguments to the command 
        this.run(args);
    },
    help: function () {
        console.log("--------- Help ----------");
        console.log("0. Exit");
        console.log("1. Test");
    },
    startup: function () {
        config.load();
        console.log("Main menu");

        console.log("0. Exit");
    },
    run: function (args) {//run ssh commands

        const child = spawn('ssh', args, { stdio: 'inherit' });

        child.on('close', (code) => {
            console.log(`ssh finished with code ${code}`);
        });

        child.on('error', (err) => {
            console.error(`Failed to start command: ${err}`);
        });
    }
}


if (args.length > 0) {
    for (const arg of args) {
        console.log(`${arg}`);
        if (arg === "-h" || arg === "--help") {//show help menu
            ssh3.help();
            process.exit(0);
        }
        if (arg === "-v" || arg === "--verbose") {//verbosity
            verbose = true;
        }
    }
}
ssh3.startup();
