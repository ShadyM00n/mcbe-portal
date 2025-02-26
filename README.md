# mcbe-portal README

`mcbe-portal` is a simple, customizable library to manage Minecraft Bedrock Edition servers with ease. It allows you to configure backups, manage scripts, and automate server creation. With `mcbe-portal`, you can handle server creation and backups with minimal setup.

## Features
- **Server Creation**: Easily create new servers with simple configurations.
- **Backups**: Set up automatic backups for your servers at customizable intervals.
- **Database**: Optionally enable database support for your servers.
- **Script Packs**: Add custom script packs to your servers.

## Installation

To install `mcbe-portal` in your project, run:

```bash
npm install mcbe-portal-tmp
```

## Usage

### Configuration

Below is an example of how to configure and use the portal to manage your Minecraft Bedrock Edition servers:

```javascript
const Portal = require("mcbe-portal");

const portal = new Portal({
    backups: {
        enabled: true,                    // Enable the backup system
        active: ["Hub"]                   // List of active servers that require backups
    },
    database: {
        enabled: true                     // Enable database support for server management
    },
    scripts: {
        enabled: true,                    // Enable script support
        packs: ["761affb6-1c0e-435a-acda-8d4c275d9a64"] // List of script packs to load
    },
    prefix: "--"                         // Command prefix for executing actions
});

// Create a server named "Hub" in the specified directory
portal.create_server("Hub", "./servers/home");

// Backup system
function backups() {
    portal.backup_servers();             // Manual backup
    setInterval(() => {
        portal.backup_servers();         // Automatic backup every 12 hours
    }, 12 * 60 * 60 * 1000);
}

backups();
```

### Explanation of Configuration
- **backups.enabled**: Enable or disable the backup system.
- **backups.active**: A list of active servers that should be backed up.
- **database.enabled**: Enable or disable database support for your servers.
- **scripts.enabled**: Enable or disable the use of script packs.
- **scripts.packs**: A list of script pack UUIDs to be applied to your servers.
- **prefix**: The command prefix used to execute actions.

### Automatic Backups
The `backups()` function is set to perform backups manually and automatically every 12 hours. This ensures that your servers remain safe and recoverable.

## Command Line Interface

You can use the `mcbe-portal` library with your custom commands by prefixing them with the configured `prefix`. For example, the default prefix is `--`.

## License

MIT License. See LICENSE file for more details.
