import { ActionRowBuilder, ButtonInteraction, ModalActionRowComponentBuilder, ModalBuilder, ModalSubmitInteraction, TextInputBuilder, TextInputStyle } from "discord.js"
import { addEvent, removeEvent } from "./eventServices";

export const create_button = async (int: ButtonInteraction) => {
    try{
        const modal = new ModalBuilder()
            .setCustomId('events-ad-list-modal-create')
            .setTitle('Create event');

        const nameInput = new TextInputBuilder()
            .setCustomId('events-ad-list-input-create-name')
            .setLabel('name of the event')
            .setPlaceholder('Enter the name of the event!')
            .setRequired(true)
            .setStyle(TextInputStyle.Short);
        
        
        const delayInput = new TextInputBuilder()
            .setCustomId('events-ad-list-input-create-time')
            .setLabel('how long till the event')
            .setRequired(true)
            .setPlaceholder('Enter in mintues! e.g. 15')
            .setStyle(TextInputStyle.Short);

        const channelIdInput = new TextInputBuilder()
            .setCustomId('events-ad-list-input-create-channelId')
            .setLabel('event channel Id')
            .setRequired(true)
            .setMinLength(15)
            .setValue('982495229779255306')
            .setStyle(TextInputStyle.Short);

        const nameRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(nameInput);
        const delayRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(delayInput);
        const channelIdRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(channelIdInput);
        
        modal.addComponents(nameRow, delayRow, channelIdRow);

        await int.showModal(modal);

    }catch(err: any){
        console.log("Err on /services/interactionServices.ts/create_button()");
        console.log(err);
        throw new Error(err.message);
    }
}

export const delete_button = async (int: ButtonInteraction) => {
    try{
        const modal = new ModalBuilder()
        .setCustomId('events-ad-list-modal-delete')
        .setTitle('Delete event');

    const nameInput = new TextInputBuilder()
        .setCustomId('events-ad-list-input-delete-name')
        .setLabel('name of ad')
        .setPlaceholder('Enter the name of the ad!')
        .setRequired(true)
        .setStyle(TextInputStyle.Short);
    

    const nameRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(nameInput);
    
    modal.addComponents(nameRow);

    await int.showModal(modal);

    }catch(err: any){
        console.log("Err on /services/interactionServices/delete_button()");
        console.log(err);
        throw new Error(err.message);
    }
}

export const create_modal = async (int: ModalSubmitInteraction) => {
    try{
        const name = int.fields.getTextInputValue('events-ad-list-input-create-name').trim().replaceAll(" ", '-');
        let time = (Number(int.fields.getTextInputValue('events-ad-list-input-create-time')) * 60_000) + Date.now();
        const channelId = int.fields.getTextInputValue('events-ad-list-input-create-channelId');
        
        await addEvent({
            name, channelId, time
        })
        int.reply({ephemeral: true, content: '✅'});

    }catch(err: any){
        console.log("Err on /services/interactionServices/create_modal()");
        console.log(err);
        int.reply({content: '⛔ something went wrong! error: \n ' + err.message, ephemeral: true});
        throw new Error(err.message);
    }
}

export const delete_modal = async (int: ModalSubmitInteraction) => {
    try{
        const name = int.fields.getTextInputValue('events-ad-list-input-delete-name').trim().replaceAll(" ", '-');
        
        await removeEvent({name});

        int.reply({ephemeral: true, content: '✅'});
    }catch(err: any){
        console.log("Err on /services/interactionServices.ts/delete_modal()");
        console.log(err);
        throw new Error(err.message);
    }
}