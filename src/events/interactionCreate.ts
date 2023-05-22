import { ButtonInteraction, Client, GuildMember, ModalSubmitInteraction } from "discord.js";
import { errHandler } from "..";
import { create_button, delete_button } from "../services/interactionServices";

export const interaction_create_listener = (client: Client) => {
    client.on('interactionCreate', async interaction => {

        if(!interaction.member) return;

        const member = interaction.member as GuildMember;
        if(!member.permissions.has('Administrator') && !member.roles.cache.has('989322114735693858')) return;
    
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

            }
        }catch(err: any){
            console.log("Err at /events/interactionCreate.ts/interaction_create_listener()");
            console.log(err);
            errHandler(err, interaction);
        }
    })
}