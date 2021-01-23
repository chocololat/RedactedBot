const { MessageEmbed } = require("discord.js");
const Command = require("../structures/Command");

module.exports = class PingCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'ping',
        });
    }

    async run(message) {
        const embed = new MessageEmbed()
            .setDescription(`Pong...`)
            .setColor("RANDOM")

            const msg = await message.channel.send(embed);
            const timestamp = (message.editedTimestamp) ? message.editedTimestamp : message.createdTimestamp;

            const latency = Math.floor(msg.createdTimestamp - timestamp);
            const heartbeat = Math.round(this.bot.ws.ping);

            embed.setDescription('Pong!', true)
            .addField('Latency', `\`\`\`ini\n[ ${latency}ms ]\`\`\``, true)
            .addField('Heartbeat', `\`\`\`ini\n[ ${heartbeat}ms ]\`\`\``, true)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        msg.edit(embed);
    }
}