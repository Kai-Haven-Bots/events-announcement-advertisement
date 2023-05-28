import { GuildTextBasedChannel } from "discord.js";
import { client, sequelize } from "..";
import { getChannel, updateChannel } from "./channelServices";
import { getAllEvents, removeEvent } from "./eventServices";
import { Op } from "sequelize";
import * as fs from 'fs';

export const createAd = async (events: any[]) => {
    try{        
        const header = "**Events for today**\n\n";

        let eventsText = '';
        let i = 0;
        for(let event of events){                        
            i++;
            const {name, time, channelId, endingAt} = event;

            const timeText = (time + "");
            let timeTemplate  = "<t:" + timeText.slice(0, timeText.length - 3) + ":R>";

            const current = Date.now();
            if(current>= time && endingAt>current) timeTemplate = ":arrow_left: :warning:**HAPPENING NOW**:warning:";

            eventsText += `${i}. **${name}** event at <#${channelId}> ${timeTemplate} \n`
        }

        const footer = "\nNITRO UP FOR GRABS";

        return events.length != 0 ? header + eventsText + footer : header + "*No events listed for today :(*"
    }catch(err: any){
        console.log('Err at /services/adServices.ts/createAd()');
        console.log(err);
        throw new Error(err.message);
    }
}

export const sendAd = async (channelId: string, ad: string, delay: number) => {
    try{
        const channel = ( await client.channels.fetch(channelId) ) as GuildTextBasedChannel;

        const channelInfo = await getChannel(channelId);

        if(channelInfo){
            const {msgId, lastSentAt} = channelInfo;

            if((lastSentAt + delay) <= Date.now()){

                try{
                    const previousAd = await channel.messages.fetch(msgId);
                    await previousAd.delete();
                }catch(err){
                    console.log(err);
                }

            }else{
                return;
            }
        }

        const sentAd = await channel.send({
            content: ad
        });
        
        // const json = JSON.stringify(sentAd.toJSON());
        // fs.writeFileSync('msg.txt', json);

        await updateChannel({channelId: channelId, lastSentAt: Date.now(), msgId: sentAd.id})
        
    }catch(err: any){
        console.log("Err at /services/adServices.ts/sendAd()");
        console.log(err);
        throw new Error(err.message);
    }
}

export const adScanner = () => {
    setInterval(async () => {
        const channelIds = (process.env._CHANNELS as string).split(" ");
        const delay = Number(process.env._DELAY);

        const events = await getAllEvents();
        const ad = await createAd(events);

        for(let channelId of channelIds){
            try {
                await sendAd(channelId, ad, delay);
            } catch (error) {
                console.log(error);
            }
        }

        await eventsCleaner()

        setTimeout(async () => {
            await updateAllAds()
        }, 10_000)

    }, 30_000)
}

export const eventsCleaner = async () => {
    try{
        const events_model = sequelize.model('events');
        const all = await events_model.findAll({
            where: {
                time:{
                    [Op.lte]: Date.now()
                }
            }
        })
        
        for(let event of all){
            const {name, endingAt} = event.dataValues;
            if(endingAt === 0){
                await removeEvent({name}); 
            }else if(Date.now() >= endingAt){
                await removeEvent({name}); 
            }
        }
    }catch(err){
        console.log("Err at /services/adServices.ts/eventsCleaner()");
        console.log(err);
    }
}

export const updateAllAds = async () => {
    try{
        const channels_model = sequelize.model('channels');
        const all = (await channels_model.findAll()).map(model => {
            return {channelId: model.dataValues.channelId, msgId: model.dataValues.msgId}
        })

        const events = await getAllEvents();
        const ad = await createAd(events);

        for (let one of all){
            const channel = (await client.channels.fetch(one.channelId)) as GuildTextBasedChannel;
            try{
                const msg = await channel.messages.fetch(one.msgId);
                await msg.edit(ad)
            }catch(err){
                console.log(err);
            }
        }
        
    }catch(err){
        console.log("Err at /services/adServices.ts/editAllAds()");
        console.log(err);
    }
}