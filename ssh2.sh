#!/bin/bash

# Define the remote host and username
remote_host="samuelm.us.to"
remote_user="samuel"
port="22"

remote_host_command="ssh samuel@samuelm.us.to"
# Execute SSH to start an interactive session
#ssh "$remote_user@$remote_host -p $port"

$remote_host_command

echo "SSH session to $remote_host_command has ended."

exit 0