module.exports = class Command {
    constructor(bot, options) {
        this.bot = bot;
        
        this.name = options.name;
        
        this.cooldown = options.cooldown * 1000 || 3000;
    }

    run(message, args) {
        throw new Error(`Command ${this.name} has no run() method.`)
    }
}