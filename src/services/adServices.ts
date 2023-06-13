import { GuildTextBasedChannel } from "discord.js";
import { client, sequelize } from "..";
import { getChannel, updateChannel } from "./channelServices";
import { getAllEvents, removeEvent } from "./eventServices";
import { Op } from "sequelize";
import * as fs from 'fs';

export const createAd = async (events: any[]) => {
    try {
      const header = "## Events for today\n\n";
      let happeningNowText = "**HAPPENING NOW**\n\n";
      let upcomingEventsText = "**UPCOMING EVENTS**\n\n";
      const happening_now = "`🟢 Happening Now`"

      let happeningNowCount = 0;
      let upcomingEventsCount = 0;
  
      const current = Date.now();
  
      for (let event of events) {
        const { name, time, channelId, endingAt } = event;
  
        if (current >= time && endingAt > current) {
          happeningNowCount++;
          happeningNowText += `- ${name} event at <#${channelId}> ${happening_now}\n`;
        } else {
          upcomingEventsCount++;
          const timeText = time.toString();
          const timeTemplate = `<t:${Math.floor(timeText / 1000)}:R>`;
          upcomingEventsText += `- ${name} event at <#${channelId}> ${timeTemplate}\n`;
        }
      }
  
      const footer = "\n-----------------------\nNITRO UP FOR GRABS";
  
      let adText = header;
      adText += happeningNowCount > 0 ? happeningNowText + "\n" : "";
      adText += upcomingEventsCount > 0 ? upcomingEventsText + "\n" : "";
      adText += footer;
  
      return adText !== header ? adText : header + "*No events listed for today :(*";
    } catch (err: any) {
      console.log('Err at /services/adServices.ts/createAd()');
      console.log(err);
      throw new Error(err.message);
    }
  };
  
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
        if(ad.includes("*No events listed for today :(*")) return;

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
        if(ad.includes("*No events listed for today :(*")) return;

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