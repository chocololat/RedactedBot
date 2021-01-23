module.exports = async (bot) => {
    bot.user.setPresence({
        status: 'online',
        activity: {
            name: 'Keeping things private...',
            type: 'PLAYING'
        }
    })

    bot.logger.info('The bot is now running.');

    bot.db.query(`SELECT * FROM channels`, (err, rows) => {
        if (!rows[0]) return bot.logger.info('No channels were found in database.');
        else {
            rows.forEach(row => {
                let time = row.timestamp - Date.now();
                if (time > 0) {
                    console.log(time);
                    setTimeout(() => {
                        let channel = bot.channels.cache.get(row.channelID);
                        let user = bot.users.cache.get(row.userID);

                        user.send('Hi there! The no-response private venting channel you\'ve created in the `🌸Plural Safe Space🌸` has been deleted. You are free to create another one whenever you want with the command `!!create` !');

                        channel.delete();
                        bot.db.query(`DELETE FROM channels WHERE channelID='${channel.id}'`);
                    }, time);
                } else {
                    let channel = bot.channels.cache.get(row.channelID);
                    let user = bot.users.cache.get(row.userID);

                    user.send('Hi there! The no-response private venting channel you\'ve created in the `🌸Plural Safe Space🌸` has been deleted. You are free to create another one whenever you want with the command `!!create` !');

                    channel.delete();
                        bot.db.query(`DELETE FROM channels WHERE channelID='${channel.id}'`);
                }
            })
            return bot.logger.info('Channels were found. Timeouts have been launched.')
        }
    })
}