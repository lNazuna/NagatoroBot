const { GuildMember, AttachmentBuilder } = require("discord.js");
const client = require("../../Client");
const Canvas = require('canvas');
const leaveSchema = require('../../database/models/LeaveDB');

    /**
     * @param {GuildMember} member
     */

client.on("guildMemberRemove", async (member) => {

    const data = await leaveSchema.findOne({
        guildid: member.guild.id,
      });
  
      if (!data) return;
  
      var leaveCanvas = {};
      leaveCanvas.create = Canvas.createCanvas(1024, 500);
      leaveCanvas.context = leaveCanvas.create.getContext("2d");
      leaveCanvas.context.font = "72px sans-serif";
      leaveCanvas.context.fillStyle = "#ffffff";
  
      await Canvas.loadImage("structures/imagens/guild/leave.jpg").then(async (img) => {
        leaveCanvas.context.drawImage(img, 0, 0, 1024, 500);
        leaveCanvas.context.fillText("Leave", 420, 360);
        leaveCanvas.context.beginPath();
        leaveCanvas.context.arc(512, 166, 128, 0, Math.PI * 2, true);
        leaveCanvas.context.stroke();
        leaveCanvas.context.fill();
      });
  
      let canvas = leaveCanvas;
      (canvas.context.font = "42px sans-serif"),
        (canvas.context.textAlign = "center");
      canvas.context.fillText(member.user.tag.toUpperCase(), 512, 410);
      canvas.context.font = "32px sans-serif";
      canvas.context.fillText(
        `Saiu do servidor e ficamos com ${member.guild.memberCount} membros`,
        512,
        455
      );
      canvas.context.beginPath();
      canvas.context.arc(512, 166, 119, 0, Math.PI * 2, true);
      canvas.context.closePath();
      canvas.context.clip();
      await Canvas.loadImage(
        member.user.displayAvatarURL({ extension: "jpg", size: 1024 })
      ).then((img) => {
        canvas.context.drawImage(img, 393, 47, 238, 238);
      });
  
      const attachment = new AttachmentBuilder(await canvas.create.toBuffer(), {
        name: "leave.png",
      })
  
      process.noDeprecation = true;
  
      member.guild.channels.cache.get(data.channel).send({
          content: data.message || `${member.user.username} deixou o servidor e ficamos ${member.guild.memberCount} membros`
          .replace(/\{mention\}/g, member.user.toString())
          .replace(/\{user\}/g, member.user.username)
          .replace(/\{server\}/g, member.guild.name)
          .replace(/\{members\}/g, member.guild.memberCount),
          files: [attachment]
      });

});