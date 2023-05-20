import { sequelize } from "..";

export const updateChannel = async (body: {channelId: string, lastSentAt: number, msgId: string}) => {
    try{
        const channels_model = sequelize.model('channels');
        const [model, created] = await channels_model.findOrCreate({
            where: {
                channelId: body.channelId
            },
            defaults: body
        })

        
        if(created) return model.dataValues;

        const updated = await model.update(body);

        return updated.dataValues;
    }catch(err: any){
        console.log("Err at /services/channelServices.ts/addChannel()");
        console.log(err);
        throw new Error(err.message);
    }
}

export const getChannel = async (channelId: string)=> {
    try{
        const channels_model = sequelize.model('channels');
        const channel = await channels_model.findOne({
            where: {
                channelId
            }
        })

        return channel === null ? null : channel.dataValues; 
    }catch(err: any){
        console.log("Err at /services/channelServices.ts/getChannel()");
        console.log(err);
        throw new Error(err.message);
    }
}