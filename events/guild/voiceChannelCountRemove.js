const { Events, GuildMember } = require("discord.js")
const { CustomClient } = require("../../structures/classes/CustomClient")
const memberCountSchema = require('../../schemas/MemberCountDB');
const botCountSchema = require('../../schemas/BotCountDB');
  
  module.exports = {
    name: Events.GuildMemberRemove,
  
    /**
     * @param {GuildMember} member
     * @param {ChatInputCommandInteraction} interaction
     * @param {CustomClient} client
     */

    async execute(member, client, err) {

        // Contador de membros sem bots

        if (member.guild === null) return;
        const voiceMemberData = await memberCountSchema.findOne({ Guild: member.guild.id });
      
        if (!voiceMemberData) return;
        else {
      
            const memberVoiceChannel = member.guild.channels.cache.get(voiceMemberData.MemberChannel);
            if (!memberVoiceChannel || memberVoiceChannel === null) return;
            const memberMembers = member.guild.members.cache.filter(member => !member.user.bot).size
      
            memberVoiceChannel.setName(`• Total de Membros: ${memberMembers}`);
        
        }

        // Contador de bots

        if (member.guild === null) return;
        const voiceBotData = await botCountSchema.findOne({ Guild: member.guild.id });
      
        if (!voiceBotData) return;
        else {
      
            const botVoiceChannel = member.guild.channels.cache.get(voiceBotData.BotChannel);
            if (!botVoiceChannel || botVoiceChannel === null) return;
            const botslist = member.guild.members.cache.filter(member => member.user.bot).size;
      
            botVoiceChannel.setName(`• Total de Bots: ${botslist}`).catch(err);
      
        }

    },
  };