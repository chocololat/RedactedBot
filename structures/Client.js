const { Client, Collection } = require("discord.js");

const { readdirSync, readdir } = require('fs');
const mysql = require("mysql");
const { join, resolve } = require("path");
const { error } = require("./Logger");



module.exports = class Bot extends Client {
    constructor(config, options = {}) {
        super(options);

        this.db = mysql.createConnection({
            host: config.db.host,
            user: "root",
            password: config.db.password,
            database: "CalmSys"
        });
        this.db.connect((err) => {
            if (err) throw err;
            this.logger.log("info", "Connected to database.");
        })

        this.logger = require('./Logger');

        this.commands = new Collection();

        this.config = require('../config.json');
        this.token = this.config.token;
    }

    loadCommands(path) {
        readdirSync(path).filter(f => f.endsWith('.js')).forEach(cmds => {

            const Command = require(resolve(__basedir, join(path,cmds)));
                    const cmd = new Command(this);
                    if (cmd.name) {
                        this.commands.set(cmd.name, cmd);
                        this.logger.info(`Loading command: ${cmd.name}`);
                    }  
            })
    }

    loadEvents(path) {
        readdir(path, (err, files) => {
            if (err) this.logger.error(err);
            files = files.filter(f => f.split('.').pop() === "js");
            if (files.length <= 0) return this.logger.warn("No events found.");
            this.logger.info(`${files.length} events found.`);
            files.forEach(f => {

                const eventName = f.substring(0, f.indexOf('.'));
                const event = require(resolve(__basedir, join(path, f)));
                super.on(eventName, event.bind(null, this));
                delete require.cache[require.resolve(resolve(__basedir, join(path, f)))];
                this.logger.info(`Loading event: ${eventName}`);
            })
        })
        return this;
    }
}