const { Client, CommandInteraction, ApplicationCommandOptionType, EmbedBuilder,  } = require('discord.js');
const { reply } = require("../../systems/reply")

module.exports = {
    name: 'limpar',
    description: 'limpe as menssagens do canal ou de um user',
    options: [
        {
            name: 'quantidade',
            description: 'insire um numero de mensagens que quer apagar máximo sao 99',
            type: ApplicationCommandOptionType.Integer,
            required: true,
        },
        {
            name: 'usuário',
            description: 'mencione qual usar quer que as mensagens sejam apagadas',
            type: ApplicationCommandOptionType.User,
            required: false,
        }
    ],
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     * @param {String[]} args
     * @returns 
     */
    run: async (client, interaction) => {

        try {

            const amount = interaction.options.getInteger('quantidade');
            const target = interaction.options.getUser('usuário');
    
            const messages = await interaction.channel.messages.fetch({ limit: amount + 1, });
    
            if(target){
                let i = 0;
                const filtered = [];
    
                (await messages).filter((msg) =>{
                    if(msg.author.id === target.id && amount > i) {
                        filtered.push(msg);
                        i++
                    }
                });
    
                await interaction.channel.bulkDelete(filtered).then(messages => {
                    const embed = new EmbedBuilder()
                    .setColor("Green")
                    .setDescription(`\`♻️\` | O Staff ${interaction.user} apagou ${messages.size} mensagens do utilizador ${target} com sucesso`)
    
                    interaction.reply({ embeds: [embed] });
                })
            } else {
                await interaction.channel.bulkDelete(amount, true).then(messages => {
                    const embed = new EmbedBuilder()
                    .setColor("Green")
                    .setDescription(`\`♻️\` | O Staff ${interaction.user} apagou ${messages.size} mensagens com sucesso`)
    
                    interaction.reply({ embeds: [embed] })
                })
            }

        } catch (error) {

            return reply(interaction, "❌", "**Insira uma quantidade entre \`1 - 99\`.**")
            
        }

    },
};