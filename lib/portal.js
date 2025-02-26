const { spawn } = require("node:child_process");
const { Database } = require("./database");
const path = require("node:path");
const fs = require("node:fs");

class Portal {
    constructor(config = {}) {
        require("./readline")(this);

        process.on("SIGINT", () => {
            console.log("\nShutting down servers...");
            this.stop_servers();
            process.exit(0);
        });

        this.config = {
            backups: {
                enabled: false,
                active: []
            },
            database: {
                enabled: false
            },
            scripts: {
                enabled: false,
                packs: []
            },
            ...config
        };
        this.database = new Database();
        this.servers = [];
        require("./api")(this.database);
    }

    create_server(name, filePath) {
        const serverProcess = spawn("./bedrock_server", { cwd: filePath, stdio: ["pipe", "pipe", "pipe"] });
        this.servers.push({ name, process: serverProcess, path: filePath });
        serverProcess.stdout.on("data", (data) => {
            console.log(data.toString("utf-8"));
        });
        this.deploy_scripts();
    }

    broadcast_command(command) {
        this.servers.forEach(({ name, process: pro }) => {
            if (pro.stdin.writable) {
                pro.stdin.write(command + "\n");
                if (command === "stop") {
                    this.stop_servers();
                    return process.exit(1);
                }
            }
        });
    }

    stop_servers() {
        this.servers.forEach((server) => {
            server.process.kill();
        });
        this.servers = [];
    }

    backup_servers() {
        const backupDir = path.join(process.cwd(), "backups");
        if (!this.config.backups.enabled) return;
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }

        this.servers.forEach(({ name, path: filePath }) => {
            if (!this.config.backups.active.includes(name)) return;
            const serverBackupDir = path.join(backupDir, name);
            if (!fs.existsSync(serverBackupDir)) {
                fs.mkdirSync(serverBackupDir, { recursive: true });
            }

            const timestamp = Date.now().toString();
            const serverBackupPath = path.join(serverBackupDir, timestamp);
            fs.mkdirSync(serverBackupPath, { recursive: true });

            const worldDir = path.join(filePath, "worlds");
            if (fs.existsSync(worldDir)) {
                fs.cpSync(worldDir, path.join(serverBackupPath, "worlds"), { recursive: true });
                console.log(`Backed up ${name} server world files to ${serverBackupPath}`);
            } else {
                console.log(`World folder not found for ${name}`);
            }
        });
    }

    deploy_scripts() {
        if (!this.config.scripts.enabled) return;
        const scriptsDir = path.join(process.cwd(), "scripts");
        if (!fs.existsSync(scriptsDir)) return fs.mkdir(path.join(process.cwd(), "scripts"));

        const scriptFolders = fs.readdirSync(scriptsDir);
        scriptFolders.forEach((pack) => {
            const scriptPath = path.join(scriptsDir, pack);
            const manifestPath = path.join(scriptPath, "manifest.json");

            if (fs.existsSync(manifestPath)) {
                const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
                if (this.config.scripts.packs.includes(manifest.header.uuid)) {
                    this.servers.forEach(({ path: serverPath }) => {
                        const destPath = path.join(serverPath, "development_behavior_packs", pack);
                        if (fs.existsSync(destPath)) {
                            fs.rmSync(destPath, { recursive: true, force: true });
                        }
                        fs.cpSync(scriptPath, destPath, { recursive: true });
                        console.log(`Deployed ${manifest.header.uuid}`);
                    });
                }
            }
        });
    }
}

module.exports = { Portal };
