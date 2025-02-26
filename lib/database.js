const path = require("node:path");
const fs = require("node:fs");

class Database {

    #databasePath
    #database

    constructor () {
        this.#databasePath = path.join(process.cwd(), "database.json");
        this.load();
    }

    load() {
        if (!fs.existsSync(this.#databasePath) || fs.readFileSync(this.#databasePath, "utf8").trim() === "") {
            fs.writeFileSync(this.#databasePath, JSON.stringify({}, null, 4));
        }
    
        try {
            this.#database = JSON.parse(fs.readFileSync(this.#databasePath, "utf8"));
        } catch (error) {
            console.error("Error parsing database.json. Resetting database.");
            this.#database = {};
            this.save();
        }
    }
    

    save() {
        fs.writeFileSync(this.#databasePath, JSON.stringify(this.#database, null, 4));
    }

    set(key, val, name) {
        if (!this.#database[name]) this.#database[name] = {};
        this.#database[name][key] = val;
        this.save();
    }

    keys(name) {
        return this.#database[name] ? Object.keys(this.#database[name]) : [];
    }

    get(key, name) {
        return this.#database[name]?.[key] || null;
    }
}

module.exports = { Database };