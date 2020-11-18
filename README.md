## PostHog Command Line Interface

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
