<p align="center">
  <img src="icon.png" alt="Project Logo" width="21%">
</p>

# Frigate Electrum Server for StartOS

[Frigate](https://github.com/sparrowwallet/frigate) is an experimental Electrum Server testing Silent Payments scanning with ephemeral client keys.

## Dependencies

Install the system dependencies below to build this project by following the instructions in the provided links. You can also find detailed steps to setup your environment in the service packaging [documentation](https://docs.start9.com/latest/developer-docs/packaging#development-environment).

- [docker](https://docs.docker.com/get-docker)
- [docker-buildx](https://docs.docker.com/buildx/working-with-buildx/)
- [make](https://www.gnu.org/software/make/)
- [start-sdk](https://github.com/Start9Labs/start-os/tree/sdk)

## Cloning

Clone the repository locally.

```
git clone git@github.com:remcoros/frigate-startos.git
cd frigate-startos
```

## Building

To build the **Frigate Electrum Server** service as a universal package, run the following command:

```
make
```

## Installing (on StartOS)

Before installation, define `host: https://server-name.local` in your `~/.embassy/config.yaml` config file then run the following commands to determine successful install:

> Change server-name.local to your Start9 server address

```
start-cli auth login
#Enter your StartOS password
make install
```

**Tip:** You can also install the frigate.s9pk by sideloading it under the **StartOS > System > Sideload a Service** section.

## Verify Install

Go to your StartOS Services page, select **Frigate Electrum Server**, configure and start the service.

**Done!**
