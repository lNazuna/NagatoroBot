const { Client, CommandInteraction, ApplicationCommandOptionType, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const Canvas = require('canvas')
const block = "⬛";
const hearts = ":red_square:";

module.exports = {
    name: 'ship',
    description: 'Descubra o quanto 2 pessoas se amam!',
    options: [
        {
            name: 'usuário',
            description: 'O primeiro usuário.',
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: 'usuário2',
            description: 'O segundo usuário.',
            type: ApplicationCommandOptionType.User,
            required: true,
        }
    ],
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     * @param {String[]} args
     * @returns 
     */
    run: async (client, interaction, args) => {

        
        await interaction.deferReply({ ephemeral: false });

        const user1 = interaction.options.getUser("usuário")
        const user2 = interaction.options.getUser("usuário2")

        const canvas = Canvas.createCanvas(700, 250)
        const ctx = canvas.getContext("2d")
    
        const bg = await Canvas.loadImage("structures/imagens/ship/backgroud.png")
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height)
    
        const avatar = await Canvas.loadImage(user1.displayAvatarURL({ extension: "png", size: 1024 }))
        ctx.save();
        ctx.beginPath();
        ctx.arc(200, 125, 95, 120, Math.PI * 2, true);
        ctx.lineWidth = 10
        ctx.strokeStyle = "#ffffff"
        ctx.stroke();
        ctx.clip();
        ctx.drawImage(avatar, 100, 25, 200, 200);
        ctx.restore();
    
        const TargetAvatar = await Canvas.loadImage(user2.displayAvatarURL({ extension: "png", size: 1024 }))
        ctx.save();
        ctx.beginPath();
        ctx.arc(500, 125, 95, 120, Math.PI * 2, true);
        ctx.lineWidth = 10
        ctx.strokeStyle = "#ffffff"
        ctx.stroke();
        ctx.clip();
        ctx.drawImage(TargetAvatar, 400, 25, 200, 200)
        ctx.restore();
    
        const heart = await Canvas.loadImage('structures/imagens/ship/love.png')
        const broken = await Canvas.loadImage('structures/imagens/ship/broken-heart.png')
        const random = Math.floor(Math.random() * 99) + 1

        const hearte = (random / 10)

        const str = `${hearts.repeat(hearte)}${block.repeat(11 - hearte)} ${random}%`;
    
        if(random >= 50) {
            ctx.drawImage(heart, 275, 60, 150, 150)
            const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'love.png'})
            const embed = new EmbedBuilder()
            .setTitle("💓 **__Parece que o amor está no ar__** 💓")
            .addFields(
                { name: `User 1`, value: `****${user1}****`, inline: true },
                { name: `User 2`, value: `****${user2}****`, inline: true  },
                { name: `**Ship Meter**`, value: `${str}` },
                )
            .setImage(`attachment://love.png`)
            .setColor("Green")
            return  interaction.editReply({ embeds: [embed], files: [attachment] })
    
        } else {
            ctx.drawImage(broken, 275, 60, 150, 150)
            const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'broken.png'})
            const embed = new EmbedBuilder()
            .setTitle("💓 **__Parece que vocês não foram feitos um para o outro__** 💓")
            .addFields(
                { name: `User 1`, value: `****${user1}****`, inline: true },
                { name: `User 2`, value: `****${user2}****`, inline: true  },
                { name: `**Ship Meter**`, value: `${str}` },
                )
            .setImage(`attachment://broken.png`)
            .setColor("Red")
            return  interaction.editReply({ embeds: [embed], files: [attachment] })
    
        }

    },
};