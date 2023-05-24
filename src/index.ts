import { Client, EmbedBuilder, IntentsBitField, Message} from 'discord.js';
import * as path from 'path';
import * as fs from 'fs';
import { Sequelize } from 'sequelize';
import { addEvent, getAllEvents } from './services/eventServices';
import { getChannel, updateChannel } from './services/channelServices';
import { adScanner, createAd, sendAd } from './services/adServices';
import { message_create_listener } from './events/messageCreate';
import { interaction_create_listener } from './events/interactionCreate';
import { Json } from 'sequelize/types/utils';

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
    adScanner()
    message_create_listener(client);
    interaction_create_listener(client);

    // const msg = JSON.parse(fs.readFileSync('msg.txt').toString()) as Message
    
    // await msg.edit('very sus!!!!')
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



