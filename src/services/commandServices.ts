import { Message, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import { sequelize } from "..";

export const events_list_ad = async (msg: Message) => {
    try{
        const events_model = sequelize.model('events');
        const all = await events_model.findAll();

        let desc = all.map( (model, i) => {
            const {name, time} = model.dataValues;

            const timeText = time + "";
            const timeTemplate = timeText.slice(0, timeText.length -3);

            return `**${i+1}. ${name}** <t:${timeTemplate}:R>`
        }).join('\n');

        if(all.length === 0) desc = "# no events listed"

        const rows = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setLabel('create')
                .setCustomId('events-list-ad-button-create')
                .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
                .setLabel('delete')
                .setCustomId('events-list-ad-button-delete')
                .setStyle(ButtonStyle.Danger)
        )

        const embed = new EmbedBuilder()
            .setDescription(desc);

        await msg.reply({embeds: [embed], components: [rows], allowedMentions: {repliedUser: false}});

    }catch(err: any){
        console.log("Err at /events/messageCreate.ts/message_create_listener()");
        console.log(err); 
        throw new Error(err.message)
    }
}