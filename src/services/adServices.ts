import { GuildTextBasedChannel } from "discord.js";
import { client } from "..";
import { getChannel, updateChannel } from "./channelServices";
import { getAllEvents } from "./eventServices";

export const createAd = async (events: any[]) => {
    try{        
        const header = "**Events for today**\n\n";

        let eventsText = '';
        let i = 0;
        for(let event of events){                        
            i++;
            const {name, time, channelId} = event;

            const timeText = (time + "");
            const timeTemplate  = timeText.slice(0, timeText.length - 3);

            eventsText += `${i}. **${name}** event at <#${channelId}> <t:${timeTemplate}:R> \n`
        }

        const footer = "\nNITRO UP FOR GRABS";

        return events.length != 0 ? header + eventsText + footer : header + "*# No events listed for today :(*"
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

                const previousAd = await channel.messages.fetch(msgId);
                await previousAd.delete();

            }else{
                return;
            }
        }

        const sentAd = await channel.send({
            content: ad
        });

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
            await sendAd(channelId, ad, delay);
        }
    }, 10_000)
}