class CommandHandler {
    constructor(text, portal) {
        this.portal = portal;
        this.prefix = portal.config.prefix;
        this.handler(text);
    }

    handler(text) {
        const args = text.slice(this.prefix.length).trim().split(/\s+/);
        const command = args.shift().toLowerCase();

        switch (text) {
            case "reload":{
                 this.portal.deploy_scripts();
                 this.portal.broadcast_command("reload");
            }
        }

        switch (command) {
            case "reload":return this.portal.deploy_scripts();
            default: return this.portal.broadcast_command(text);
        }
    }
}

module.exports = { CommandHandler };
