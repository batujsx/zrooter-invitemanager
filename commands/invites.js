const Discord = require("discord.js");
const {JsonDatabase} = require("wio.db");
module.exports = {
  name: "invites",
  aliases: ["davetlerim"],
  description: "Main Command",
  run: async(client, message, args) => {
    const db = new JsonDatabase({
      databasePath: "Database/inviteDB"
    })
    const basarisizEmbed = new Discord.MessageEmbed()
        .setTitle("InviteManager (Error)")
        .setColor("RED")
        .setFooter("zRooter ©")
    let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    
    if(user != null) {
      let invites = db.fetch(`${message.guild.id}.invites.${user.id}`) ? Object.keys(db.fetch(`${message.guild.id}.invites.${user.id}`)).length : 0;
      let fakeInvites = db.fetch(`${message.guild.id}.fakeInvites.${user.id}`) || 0;
      const embed = new Discord.MessageEmbed()
        .setTitle("InviteManager")
        .setAuthor(`${user.user.tag} (${user.id})`)
        .setColor("RED")
        .setFooter("zRooter ©")
        .setDescription(`

> Invites: ${invites + fakeInvites}
> Real Invites: ${invites}
> Fake Invites: ${fakeInvites}

        `)
      
      message.reply({embeds: [embed]})
    } else {
      basarisizEmbed.setDescription("Invalid User")
      message.reply({embeds: [basarisizEmbed]});
    }
    
  }
}