# 👋 Here

This app was first presented at the [DEPT x Node.js talk](https://bit.ly/deptxnodejs) I gave on June 18th 2021. It was designed to demonstrate the usage of Socket.io, and really just show how fast it was to do something really quick and easy. Overall, it took me a couple of hours to complete the version I gave at the talk (which, for posterity, can always be found at the SHA `f8dd7a4`).

The `/client` directory contains a [`create-react-app`](https://github.com/facebook/create-react-app)-based SPA that displays the map. The `/server` folder contains an Express app that also serves Socket.io connections. I just copy and pasted a lot of the boilerplate from some of the other code I wrote in the past.

## What does it do?

When you land on the webpage, it asks for permission to access your location. If you say yes, it'll drop a pin on the map at your current location. If other people visit the same webpage after you, then you'll see their locations get added to the map in real-time. That's it, super simple.

Redis is used as in-memory location storage. I didn't want to keep location data around forever, so it was important to have volatile storage so I could just turn it off when I was done and have all the data be gone. Locations are stored as JSON strings in a set.

## Development

### Installation

As this project uses [`npm` workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces), this project requires at least `npm@7`.

To install the dependencies:

```bash
npm install
```

You'll also need to be running Redis locally. You can also optionally supply a custom URL to a Redis instance by assigning a valid URL to the `REDIS_URL` environment variable.

You can then run the following to start the compiler in _watch_ mode. This watches both `/client` and `/server` for changes, restarting both when one is detected. It also

```bash
npm run build:watch
```

You can also build the library without watching the directory:

```bash
npm run build
```

Version management configuration is provided for [`volta`](https://volta.sh/).
