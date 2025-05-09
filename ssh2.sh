#!/bin/bash

# Define the remote host and username
remote_host="samuelm.us.to"
remote_user="samuel"
port="22"

remote_host_command="ssh samuel@samuelm.us.to -p 2222"
# Execute SSH to start an interactive session
#ssh "$remote_user@$remote_host -p $port"

$remote_host_command
# Once the SSH session ends, the script will continue here (if there's anything else)
echo "SSH session to $remote_host_command has ended."

exit 0