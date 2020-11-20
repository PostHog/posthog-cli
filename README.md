## Depreacted, DO NOT USE!

This project is depreacted. It started out as a hackathon experiment to install plugins. We have since [changed course](https://github.com/PostHog/posthog/issues/1896) several times and no longer support this usecase.

Still keeping the project itself and the `posthog-cli` utility around, since we might come up with other uses for a CLI in the future.

Read below for the old docs.


## PostHog Command Line Interface (Deprecated)

The CLI allows you to interact with your PostHog instance from the command line.

It currently just supports installing global plugins.

## Getting started

Run ```npm install -g posthog-cli``` to install `posthog-cli`.

## Plugins

#### Searching the repository

Run ```posthog plugin search [term]``` to search the repository. The `term` is optional.

#### Adding a plugin

Run ```posthog plugin add <url>```, where ```<url>``` is the plugin's `github.com` or `npmjs.com` URL.

#### Removing a plugin

Run ```posthog plugin remove <url>```, where ```<url>``` is the plugin's `github.com` or `npmjs.com` URL.

#### Listing installed plugins

Run ```posthog plugin list``` to view installed plugins.
