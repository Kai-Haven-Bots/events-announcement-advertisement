import { ButtonInteraction, Client, GuildMember, ModalSubmitInteraction, PermissionFlagsBits } from "discord.js";
import { errHandler } from "..";
import { create_button, create_modal, delete_button, delete_modal } from "../services/interactionServices";

export const interaction_create_listener = (client: Client) => {
    client.on('interactionCreate', async interaction => {

        if(!interaction.member) return;

        const member = interaction.member as GuildMember;
        if(!member?.permissions.has(PermissionFlagsBits.ModerateMembers) && !member?.roles.cache.has('1028735048473645148')) throw new Error('Insufficient permissions');

        try{
            if(interaction.isButton()){
                const int = interaction as ButtonInteraction;
                const customId = int.customId;
                
                if(!customId.startsWith('events-list-ad-button')) return;

                customId.endsWith('create') ? await create_button(int) : await delete_button(int);

            }else if(interaction.isModalSubmit()){
                const int = interaction as ModalSubmitInteraction;
                const customId = int.customId;
                
                if(!customId.startsWith('events-list-ad-modal')) return;
                
                customId.endsWith('create') ? await create_modal(int) : await delete_modal(int);

            }
        }catch(err: any){
            console.log("Err at /events/interactionCreate.ts/interaction_create_listener()");
            console.log(err);
            errHandler(err, interaction);
        }
    })
}