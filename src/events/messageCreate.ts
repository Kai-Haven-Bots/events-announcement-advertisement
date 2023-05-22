import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, EmbedBuilder, Message, PermissionFlagsBits } from "discord.js";
import { errHandler, sequelize } from "..";
import { events_list_ad } from "../services/commandServices";

export const message_create_listener = (client: Client) => {
    client.on('messageCreate', async msg => {
        try{
            if(!(msg.content === "!events-list-ad")) return; 
            if(!msg.member) return;
            if(!msg.member?.permissions.has(PermissionFlagsBits.ModerateMembers) && !msg.member?.roles.cache.has('1028735048473645148')) throw new Error('Insufficient permissions');

            await events_list_ad(msg)

        }catch(err: any){
            console.log("Err at /events/messageCreate.ts/message_create_listener()");
            console.log(err);
            errHandler(err, msg)
        }
    })
}


