const readline = require("node:readline");
const { CommandHandler } = require('./commands');

module.exports = function (portal) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    rl.on("line", (input) => {
        new CommandHandler(input, portal);
    });
    
}