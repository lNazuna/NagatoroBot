const { GuildMember } = require("discord.js");
const client = require("../../Client");
const memberCountSchema = require('../../database/models/MemberCountDB');
const botCountSchema = require('../../database/models/BotCountDB');

    /**
     * @param {GuildMember} member
     */

client.on("guildMemberAdd", async (member, err) => {

      // Contador de membros sem bots
      
      if (member.guild === null) return;
      const voiceMemberData = await memberCountSchema.findOne({ Guild: member.guild.id });
    
      if (!voiceMemberData) return;
      else {
    
          const memberVoiceChannel = member.guild.channels.cache.get(voiceMemberData.MemberChannel);
          if (!memberVoiceChannel || memberVoiceChannel === null) return;
          const memberMembers = member.guild.members.cache.filter(member => !member.user.bot).size
    
          memberVoiceChannel.setName(`• Total de Membros: ${memberMembers}`).catch(err);
    
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

});