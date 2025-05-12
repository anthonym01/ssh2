// Project: ssh3
// Prototype ssh session manager
// Author: Samuel M. <
//
const { spawn } = require('child_process');
const fs = require('fs');
const input = require('input');

let verbose = false;
// get any arguments passed to the script
const args = process.argv.slice(2);



let config = {
    data: {
        hosts: {},
        last_used: -1,
    },
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
        const args = ['samuel@samuelm.us.to', '-p 22']; // Arguments to the command 
        this.run(args);
    },
    help: function () {
        console.log("--------- Help ----------");
        console.log("ssh3 - A simple ssh session manager");
        console.log("Usage: ssh3 [options]");
        console.log("Options:");
        console.log("-h, --help\tShow this help message");
        console.log("-v, --verbose\tEnable verbose output");
        console.log("-o, --output\tgive configuration file path");
    },
    startup: async function () {
        let selection = -1;
        config.load();
        while (selection !== 0) {

            console.log("Connect to host");
            console.log("--------- Hosts ---------");
            let i = 1;
            for (const key in config.data) {
                console.log(`${i}. ${key}\t${config.data[key].host}`);
                i++;
            }
            console.log("---------------------------------")
            console.log(`${i}. add a new host`);
            console.log(`${i + 1}. edit a host`);
            console.log(`${i + 2}. upload rsa key to a host`);
            console.log("0. Exit");
            selection = parseInt(await input.text("Enter your choice: ", { default: 1 }));
            if (selection === 0) {
                console.log("Exiting...");
                break;
            }
            if (selection === i) {
                this.add_new_host();
                continue;
            }
            if (selection === i + 1) {
                this.edit_hosts();
                continue;
            }
            if (selection > 0 && selection < i) {
                const key = Object.keys(config.data)[selection - 1];
                if (verbose) {
                    console.debug("Selected host: ", key);
                    console.debug(`Connecting to ${config.data[key].host}`);
                }
                this.run(key);
                break;
            } else {
                console.log("Invalid selection");
            }
        }

    },
    add_new_host: async function () {
        console.log("Add new host");
        const name = await input.text("Enter name (e.g. dev server1): ");
        if (config.data[name]) {
            console.log("Host already exists");
            return;
        }
        //impliment dynamic defaults later
        // const host = await input.text("Enter host name: ", { default: //use last used host });
        const host = await input.text("Enter host name (e.g. 192.168.0.12): ");
        const user = await input.text("Enter user name: ");
        const port = await input.text("Enter port #: ", { default: 22 });
        const arguments = await input.text("Enter arguments (e.g. -i ~/.ssh/id_rsa -g -J user@host:port -l login_name): ");
        config.data[name] = { host, user, port, arguments };
        config.save();
    },
    edit_hosts: async function () {
        console.log("Edit hosts");
    },
    run: function (key) {//run ssh commands
        const this_host = config.data[key];

        if (verbose) {
            console.debug("Running ssh command for host: ", this_host.host);
            console.debug("Arguments: ", this_host.arguments);
        }

        const args = [`${this_host.user}@${this_host.host}`, `-p ${this_host.port}`, ...this_host.arguments.split(" ")];

        if (verbose) { console.debug("ssh command: ", args); }

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
//const child = spawn('ssh',[`root@192.168.0.99`,`-J`,`samuel@samuelm.us.to`], { stdio: 'inherit' });
