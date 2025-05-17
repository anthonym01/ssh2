// Project: ssh3
// Prototype ssh session manager
// Author: Samuel M. <
//
const { spawn } = require('child_process');
const fs = require('fs');
//const input = require('input');
const Table = require('easy-table');
const path = require('path');
const { default: inquirer } = require('inquirer');
const prompt = inquirer.createPromptModule();

prompt({
    question: "name",
    name: 'answer',
    message: "What is your name?",
    type: 'list',
    choices: [
        //value name
        { value: 1, name: '1) Enter your name ' },
        { value: 2, name: '2) or dont its up to you' },
        { value: 3, name: '3) or you can just press enter' }
    ],
    default: 2,
}).then(answers => {
    console.log(answers);
});

let verbose = false;
// get any arguments passed to the script
const args = process.argv.slice(2);

let config = {
    data: {
        hosts: {},
        last_used: 1,
    },
    save: function () {
        if (verbose) {
            console.debug("Saving config");
        }
        fs.writeFileSync(path.join(__dirname, './config.json'), JSON.stringify(this.data));
    },
    load: function () {
        if (verbose) {
            console.debug("Loading config");
        }
        try {
            this.data = JSON.parse(fs.readFileSync(path.join(__dirname, './config.json'), 'utf8'));
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
        console.log("-i, --input\tInput file to load hosts from");
        console.log("-o, --output\tOutput file to save hosts to");
    },
    startup: async function () {
        let selection = -1;
        config.load();
        while (selection !== 0) {
            let i = 1;

            if (Object.keys(config.data.hosts).length != 0) {
                //console.log("Connect to host");
                //console.log("--------- Hosts ---------\n");
                let table = new Table();
                for (const key in config.data.hosts) {
                    //console.log(`${i}. ${key}\t${config.data.hosts[key].host}`);
                    //console.log(`${i}. ${key}\t${[...config.data.hosts[key].split("@")][1].split(" ")[0]}`);
                    //[...config.data.hosts[key].host.split("@")][1]
                    table.cell('#', i);
                    table.cell('Name', key);
                    table.cell('Host', [...config.data.hosts[key].split("@")][1].split(" ")[0]);
                    table.newRow();
                    i++;
                }
                console.log(table.toString());
                //console.log("---------------------------------")
            }
            console.log(`${i}. Add a new host`);
            console.log(`${i + 1}. Edit a host`);
            console.log("0. Exit");

            selection = parseInt(await input.text("Enter your choice: ", { default: config.data.last_used }));

            if (selection > 0 && selection < i) {
                config.data.last_used = selection;
                config.save();
                const key = Object.keys(config.data.hosts)[selection - 1];
                if (verbose) {
                    console.debug("Selected host: ", key);
                    console.debug(`Connecting to ${config.data.hosts[key].host}`);
                }
                this.run(key);
                break;
            } else if (selection === 0) {
                console.log("Exiting...");
                break;
            } else if (selection === i) {
                await this.add_new_host();
                continue;
            } else if (selection === i + 1) {
                await this.edit_hosts();
                continue;
            } else {
                console.log("Invalid selection");
                selection = -1;
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
        console.log('ssh command: ssh ', host)
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
    try {
        for (const arg of args) {
            switch (arg) {
                case "-h":
                case "--help":
                    ssh3.help();
                    process.exit(0);
                    break;
                case "-v":
                case "--verbose":
                    verbose = true;
                    break;
                case "-i":
                case "--input":
                    const input = args[args.indexOf(arg) + 1];
                    if (input) {
                        config.data.hosts = JSON.parse(fs.readFileSync(input, 'utf8'));
                    } else {
                        console.error("No input file specified");
                        process.exit(1);
                    }
                    break;
                case "-o":
                case "--output":
                    const output = args[args.indexOf(arg) + 1];
                    if (output) {
                        fs.writeFileSync(path.join(output, '.json'), JSON.stringify(config.data));
                    } else {
                        console.error("No output file specified");
                        process.exit(1);
                    }
                    break;
                default:
                    console.error(`Unknown argument: ${arg}`);
                    ssh3.help();
                    process.exit(1);
                    break;
            }
        }
    } catch (err) {
        console.log('Could not parse arguments:', err);
        ssh3.help();
        process.exit(1);
    }
}
//ssh3.startup();
//const child = spawn('ssh',[`root@192.168.0.99`,`-J`,`samuel@samuelm.us.to`], { stdio: 'inherit' });
