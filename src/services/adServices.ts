import { GuildTextBasedChannel } from "discord.js";
import { client } from "..";

export const createAd = async (...events: any[]) => {
    try{
        const header = "**Events for today**\n";

        let eventsText = '';
        let i = 0;
        for(let event of events){
            i++;
            const {name, time, channelId} = event;

            const timeText = (time + "");
            const timeTemplate  = timeText.slice(0, timeText.length - 3);

            eventsText += `${i}. **${name}** event at <#${channelId}> <t:${timeTemplate}:R> \n`
        }

        const footer = "NITRO UP FOR GRABS";

        return events.length != 0 ? header + eventsText + footer : header + "*# No events listed for today :(*"
    }catch(err: any){
        console.log('Err at /services/adServices.ts/createAd()');
        console.log(err);
        throw new Error(err.message);
    }
}

export const sendAd = async (channelId: string, ad: string) => {
    try{
        const channel = ( await client.channels.fetch(channelId) ) as GuildTextBasedChannel;
        
    }catch(err: any){
        console.log("Err at /services/adServices.ts/sendAd()");
        console.log(err);
        throw new Error(err.message);
    }
}