const { MessageEmbed } = require("discord.js");
const Command = require("../structures/Command");

module.exports = class CreateCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'create',
        });
    }

    /**
     * Todo:
     * - add mods role to the permissionsoverwrite
     * - send dm to channel owner when channel is deleted
     */

    async run(message) {
        this.bot.db.query(`SELECT * FROM channels WHERE userID='${message.author.id}'`, (err, rows) => {
            if (rows[0]) return message.reply('❌ - You already have a channel created.')

            let role = message.guild.roles.cache.get('782684017925160980')
        
        message.guild.channels.create(`venting-${message.author.id}`, {
            type: "text",
            topic: `This channel will be deleted in 20 minutes. Only you and the owner can see this channel.`,
            permissionOverwrites: [
                {
                    id: message.author.id,
                    allow: [
                        "ADD_REACTIONS", "VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "READ_MESSAGE_HISTORY", "USE_EXTERNAL_EMOJIS",
                    ]
                },
                {
                    id: message.guild.id,
                    deny: [
                        "ADD_REACTIONS", "VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "READ_MESSAGE_HISTORY", "USE_EXTERNAL_EMOJIS",
                    ]
                }
            ]
        }).then(ch => {
            ch.send(`Hey ${message.author}!\nThis is your private no-response venting channel. After 20 minutes, the channel will be deleted forever, so make the time count!`);
            message.channel.send('✅ - Your venting channel has been created.');

            this.bot.db.query(`INSERT INTO channels (timestamp, userID, channelID) VALUES ('${Date.now() + 1200000}', '${message.author.id}', '${ch.id}')`);
            setTimeout(() => {
                message.author.send('Hi there! The no-response private venting channel you\'ve created in the `🌸Plural Safe Space🌸` has been deleted. You are free to create another one whenever you want with the command `!!create` !');
                ch.delete();
                this.bot.db.query(`DELETE FROM channels WHERE channelID='${ch.id}'`);
            }, 1200000)
        })

    })
    }
}