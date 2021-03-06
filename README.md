[![NSP Status](https://nodesecurity.io/orgs/tegh/projects/24e090c8-8a9b-4827-a224-6e638b70df50/badge)](https://nodesecurity.io/orgs/tegh/projects/24e090c8-8a9b-4827-a224-6e638b70df50)

## The Tegh Project

Tegh is a work in progress Next Gen 3D Printer Host Server. Tegh aims to:
1. connect your 3D printer to the internet with any commodity USB Type C Android phone
2. control your 3D printer from anywhere with end-to-end encryption, WebRTC and live video streaming
3. streamline your 3D printing process with easy-to-use print queuing

## Installation

Run `yarn bootstrap`

**Prerequisites:** node and yarn (`npm i -g yarn`)

## Hacking

The yarn scripts bellow should be run from the root directory of this repo.

### Running the Dev Host + Web UI

Run `yarn start`

**Note:** This is the only way to run tegh atm. It is a temporary stop-gap solution. Eventually the plan is to start Tegh via SystemD or inside of an Android App but neither of those are done yet.

* starts a development server connected to a simulated serial port
* starts the tegh-web-ui dev server
* information on how to connect to the servers is echo'd to the command line

### Running the test suite

Run `yarn test`

<!-- TODO: rewrite outdated SystemD scripts and update docs.
## Installing the development server SystemD Unit File

As a temporary provision until a build script is ready for Tegh the server can be installed with systemd via the following steps:

1. Run:
  ```
    sudo ln -s `pwd`/packages/tegh-server/scripts/tegh-server /usr/sbin/tegh-server
    sudo cp `pwd`/packages/tegh-server/scripts/tegh-server.service /etc/systemd/system/
  ```
2. Fill in your username: `sudo vim /etc/systemd/system/tegh-server.service`
3. Run:
  ```
    systemctl daemon-reload
    systemctl enable tegh-server
    systemctl start tegh-server
  ```
4. Unplug and replug the 3D printer

Tegh's stderr log is accessible via journalctl:

`journalctl -u tegh-server.service --follow` -->
