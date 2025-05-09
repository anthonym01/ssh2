# ssh2

A utility to make my life easier when host chaining 

Goal is to create a utility that displays saved hosts in the form

|#|Status|Name|Host|
|---|---|---|---|
|1|🔴|name of server|192.168.0.100|
|2|🟢|utils|192.168.0.102|
|3|🟢|etc...|0.0.0.0|

Alows selecting of a host by number or name or IP, etc..

## To-do:

- [ ] Create basic host chaining ability
- [ ] Integrate other ssh command utlities to create/select an rsa key and upload it to a desired server on request
- [ ] ability not just to check if a host is responding to regular pings, but to check if its listening on the port configured for ssh
- [ ] multiple profile support
- [ ] 