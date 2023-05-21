import { sequelize } from "..";

export const addEvent = async (data: {name: string, channelId: string, time: number}) => {
    try{
        const events_model = sequelize.model('events');

        const previous = await events_model.findOne({
            where: {
                name: data.name
            }
        })

        if(previous) throw new Error('Event already exists!');

        const created = await events_model.create(data);

        return created.dataValues;
    }catch(err: any){
        console.log('Err at /services/eventServices.ts/addEvent()');
        console.log(err);
        throw new Error(err.message) 
    }
}

export const removeEvent = async (data: {name: string}) => {
    try{
        const events_model = sequelize.model('events');

        const previous = await events_model.findOne({
            where: {
                name: data.name
            }
        })

        if(!previous) throw new Error('Event does not exists!');

        const deleted = await previous.destroy();

        return previous.dataValues;
    }catch(err: any){
        console.log('Err at /services/eventServices.ts/removeEvent()');
        console.log(err);
        throw new Error(err.message) 
    }
}

export const getAllEvents = async () => {
    try{

        const events_model = await sequelize.model('events');
        const all = (await events_model.findAll()).map(v => v.dataValues);
        
        return all;
    }catch(err: any){
        console.log('Err at /services/eventServices.ts/getAllEvents()');
        console.log(err);
        throw new Error(err.message) 
    }
}