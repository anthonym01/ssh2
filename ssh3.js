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
            if (verbose) {
                console.debug("Creating new config file");
            }
            this.save();
        }
    }
}

let ssh3 = {
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

            //console.log("Connect to host");
            console.log("--------- Hosts ---------");
            let i = 1;
            for (const key in config.data.hosts) {
                //console.log(`${i}. ${key}\t${config.data.hosts[key].host}`);
                console.log(`${i}. ${key}\t${[...config.data.hosts[key].split("@")][1].split(" ")[0]}`);
                //[...config.data.hosts[key].host.split("@")][1]
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
                await this.add_new_host();
                continue;
            }
            if (selection === i + 1) {
                await this.edit_hosts();
                continue;
            }
            if (selection > 0 && selection < i) {
                const key = Object.keys(config.data.hosts)[selection - 1];
                if (verbose) {
                    console.debug("Selected host: ", key);
                    console.debug(`Connecting to ${config.data.hosts[key].host}`);
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
        if (config.data.hosts[name]) {
            console.log("Host already exists");
            return;
        }
        //impliment dynamic defaults later
        // const host = await input.text("Enter host name: ", { default: //use last used host });
        const host = await input.text("Enter host and arguments (e.g. root@192.168.0.99 -i ~/.ssh/id_rsa -g -J user@host:port): ");
        console.log('ssh command: ssh ',host)
        config.data.hosts[name] = host;
        config.save();
    },
    edit_hosts: async function () {
        console.log("Edit hosts");
    },
    run: function (key) {//run ssh commands
        const this_host = config.data.hosts[key];

        if (verbose) {
            console.debug("Running ssh command for host: ", this_host);
        }

        const args = [...this_host.split(" ")];

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
