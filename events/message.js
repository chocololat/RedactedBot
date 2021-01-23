const { Collection } = require("discord.js");

const cooldowns = new Collection();

module.exports = (bot, message) => {
    const prefixRegex = new RegExp(`^(<@!?${bot.user.id}>|\!\!)\\s*`);

    if (prefixRegex.test(message.content)) {
        const [, match] = message.content.match(prefixRegex);
        const args = message.content.slice(match.length).trim().split(/ +/g);
        const cmd = args.shift().toLowerCase();
        let command = bot.commands.get(cmd);

        if (command) {
        

            command.run(message, args).catch(e => {
                throw e;
            })
        }
    }
}