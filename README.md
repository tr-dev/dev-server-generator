# Dev Server Generator

A CLI for interacting with the digital ocean

### Running the app
- Install [Node LTS ](https://nodejs.org/en/download/)
- [Generate](https://www.digitalocean.com/community/tutorials/how-to-use-the-digitalocean-api-v2#how-to-generate-a-personal-access-token) a digital ocean API token 
- Run the app with the token set as `DO_KEY`
```
DO_KEY="mytoken" node app
```
or 

```
export DO_KEY="mytoken"; node app
```
### Managing SSH Keys
The `keys` command is an easy way for managing local and remote ssh keys.
```
keys <action> [-l -r] [keyname]
```

Action | Description
--- | ---
`create` | Will create a local ssh key and upload the public key to digital ocean to be used to quickly access droplets. If a keyname is not provided, a random string is generated for the name.
`ls`, `list` | List of the keys avaliable locally (using either `-l`, `--local`) or remotely (using `-r`, `--remote`)
`rm`, `remove` | Removes an avaliable locally (using either `-l`, `--local`) or remotely (using `-r`, `--remote`). Requires the `key` name to be passed.

## TODO
- Add commands for launching and managing droplets
- Add login command to easiy swap out DO token
- Improve dockerfile
  - Possibly add ansible code for provision droplet after it's been launched

