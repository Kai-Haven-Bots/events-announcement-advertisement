import { Client, EmbedBuilder, IntentsBitField} from 'discord.js';
import * as path from 'path';
import * as fs from 'fs';
import { Sequelize } from 'sequelize';
import { addEvent, getAllEvents } from './services/eventServices';
import { getChannel, updateChannel } from './services/channelServices';
import { createAd, sendAd } from './services/adServices';

require('dotenv').config({
    path: path.join(__dirname, ".env")
})


export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'events.db',
    logging: false
})


const path_to_models = path.join(__dirname, 'database', 'models');

fs.readdirSync(path_to_models)
    .forEach(modelFile => {
        const model = require(path.join(path_to_models, modelFile));
        model.model(sequelize);
    })




sequelize.sync({alter: true}).then(async sequelize => {
    client.login(process.env._TOKEN);
})


const F = IntentsBitField.Flags;
export const client = new Client({
    intents: [F.Guilds, F.GuildMessages, F.GuildMembers, F.MessageContent]
})


client.once('ready', async (client) => {
    console.log("ready");

    // await addEvent({name: 'event 1', channelId: '1107343960642441248', time: Date.now() + 360000})
    // await addEvent({name: 'event 2', channelId: '1107343960642441248', time: Date.now() + 360000})
    // await addEvent({name: 'event 3', channelId: '1107343960642441248', time: Date.now() + 360000})

    const allEvents = await getAllEvents();
    
    const adText = await createAd(allEvents);
    sendAd('1107343960642441248', adText, 60_000)
})

export const errHandler = async (err: any, msg: any) => {
    try{
        const errBed = new EmbedBuilder()
            .setTitle("An error occurred!")
            .setDescription('```' + err.message + "```");
        await msg.reply({
            embeds: [errBed],
            ephemeral: true
        })
    }catch(err){
        console.log("Err on /src/errHandler()");
        console.log(err);
    }
}



