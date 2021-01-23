global.__basedir = __dirname;

const config = require('./config.json');7

const Client = require('./structures/Client');

const bot = new Client(config);

function init() {
    bot.loadEvents('./events');
    bot.loadCommands('./commands');
    bot.login(bot.token);
}

init();

process.on('unhandledRejection', err => bot.logger.error(err));