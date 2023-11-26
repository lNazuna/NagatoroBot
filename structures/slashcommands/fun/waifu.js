const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const ms = require("ms")

module.exports = {
    name: 'waifu',
    description: 'Veja sua waifu!',
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     * @param {String[]} args
     * @returns 
     */
    run: async (client, interaction) => {

        const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle("Olá escolha qual a waifu quer ver ♥️")
        .setDescription(`Olá ${interaction.user} use o menu abaixo para alterar as imagens`)
        .setImage('https://i.imgur.com/Vs4b7EE.jpg');

		const row = new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('select')
					.setPlaceholder("Selecione aqui")
					.addOptions([
						{
							label: 'Waifu',
							value: 'waifu',
						},
                        {
							label: 'Maid',
							value: 'maid',
						},
						{
							label: 'Marin Kitagawa',
							value: 'marin-kitagawa',
						},
                        {
							label: 'Mori Calliopea',
							value: 'mori-calliope',
						},
                        {
							label: 'Raiden Shogun',
							value: 'raiden-shogun',
						},
                        {
							label: 'Oppai',
							value: 'oppai',
						},
                        {
							label: 'Selfies',
							value: 'selfies',
						},
                        {
							label: 'Uniform',
							value: 'uniform',
						},
					]),
			);

        interaction.reply({embeds: [embed], components: [row], fetchReply: true}).then(msg => {
    
            const collector = msg.createMessageComponentCollector({ time: ms("120s") });
          
          collector.on('collect', async i => {
          
            if(i.user.id != interaction.user.id) return i.reply({embeds: [new EmbedBuilder()
              .setTitle("👨 Calma ae...")
              .setColor("a5d7ff")
              .setDescription("Só quem solicitou o menu pode usá-lo.")
          ], ephemeral: true})
          
             i.deferUpdate()

           if(i.values[0] == "waifu"){

            const body = await fetch(`https://api.waifu.im/search/?included_tags=waifu`).then((res) => res.json());

            interaction.editReply({embeds: [new EmbedBuilder()
                .setTitle("Olá eu sou uma waifu prazer em te conhecer ♥️")
                .setColor("Random")
                .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setTimestamp()
                .setImage(body.images[0].url)
                ]})

           }          
           if(i.values[0] == "maid"){

            const body = await fetch(`https://api.waifu.im/search/?included_tags=maid`).then((res) => res.json());

            interaction.editReply({embeds: [new EmbedBuilder()
                .setTitle("Olá eu sou uma Maid prazer em te conhecer ♥️")
                .setColor("Random")
                .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setTimestamp()
                .setImage(body.images[0].url)
                ]})

           }
           if(i.values[0] == "marin-kitagawa"){

            const body = await fetch(`https://api.waifu.im/search/?included_tags=marin-kitagawa`).then((res) => res.json());

            interaction.editReply({embeds: [new EmbedBuilder()
                .setTitle("Olá eu sou a Marin Kitagawa prazer em te conhecer ♥️")
                .setColor("Random")
                .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setTimestamp()
                .setImage(body.images[0].url)
                ]})

           }
           if(i.values[0] == "mori-calliope"){

            const body = await fetch(`https://api.waifu.im/search/?included_tags=marin-kitagawa`).then((res) => res.json());

            interaction.editReply({embeds: [new EmbedBuilder()
                .setTitle("Olá eu sou a Mori Calliopea prazer em te conhecer ♥️")
                .setColor("Random")
                .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setTimestamp()
                .setImage(body.images[0].url)
                ]})

           }
            if(i.values[0] == "raiden-shogun"){

                const body = await fetch(`https://api.waifu.im/search/?included_tags=raiden-shogun`).then((res) => res.json());

                interaction.editReply({embeds: [new EmbedBuilder()
                    .setTitle("Olá eu sou a Raiden Shogun prazer em te conhecer ♥️")
                    .setColor("Random")
                    .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                    .setTimestamp()
                    .setImage(body.images[0].url)
                    ]})

            }
            if(i.values[0] == "oppai"){

                const body = await fetch(`https://api.waifu.im/search/?included_tags=oppai`).then((res) => res.json());

                interaction.editReply({embeds: [new EmbedBuilder()
                    .setTitle("Olá eu tenho oppai grandes espero que gostes ♥️")
                    .setColor("Random")
                    .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                    .setTimestamp()
                    .setImage(body.images[0].url)
                    ]})

             }
             if(i.values[0] == "selfies"){

                const body = await fetch(`https://api.waifu.im/search/?included_tags=selfies`).then((res) => res.json());;

                interaction.editReply({embeds: [new EmbedBuilder()
                    .setTitle("Olá eu tirei uma selfie só para ti ♥️")
                    .setColor("Random")
                    .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                    .setTimestamp()
                    .setImage(body.images[0].url)
                    ]})

             }
             if(i.values[0] == "uniform"){

                const body = await fetch(`https://api.waifu.im/search/?included_tags=selfies`).then((res) => res.json());

                interaction.editReply({embeds: [new EmbedBuilder()
                    .setTitle("Olá gostarias de me ver de uniform ♥️")
                    .setColor("Random")
                    .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                    .setTimestamp()
                    .setImage(body.images[0].url)
                    ]})

             }
            
          })//collector

          collector.on("end", async () => {

            msg.delete().catch((err) => {

                if (err.code !== 10008) return console.log(err)

            })

            await interaction.channel.send({embeds: [new EmbedBuilder()
                .setTitle("waifu")
                .setDescription(`${interaction.user} acabou o tempo de usar este menu para poder usá-lo novamente use o comando **/waifu**`)
                .setColor("Random")
                .setImage("https://i.imgur.com/Vs4b7EE.jpg")
                .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setTimestamp()
                ]})

        })
            
          })//.then

    },
};