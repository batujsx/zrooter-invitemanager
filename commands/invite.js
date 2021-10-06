const Discord = require("discord.js");
const {JsonDatabase} = require("wio.db");
module.exports = {
  name: "invite",
  aliases: ["invitemanager"],
  description: "Main Command",
  run: async(client, message, args) => {
    
    const db = new JsonDatabase({
      databasePath: "Database/inviteDB"
    })
    
    const error = new Discord.MessageEmbed()
      .setTitle("InviteManager")
      .setColor("RED")
      .setDescription(`
❌

> **Invalid args!**

 -&- \`${client.config.prefix}invite log set [<channel>]\` → **Sets the Invite log channel**
 -&- \`${client.config.prefix}invite log clear\` → **Clears the Invite log channel**
 -&- \`${client.config.prefix}invite add [<user/everyone>] [<integer>]\` → **Adds invites to user or everyone**
 -&- \`${client.config.prefix}invite remove [<user/everyone>] [<integer>]\` → **Removes invites from user or everyone**
 -&- \`${client.config.prefix}invite clear [<user/everyone>]\` → **Clears invites of user or everyone**
      `)
      .setFooter("zRooter ©")
      const basariliEmbed = new Discord.MessageEmbed()
        .setTitle("InviteManager (Success)")
        .setColor("GREEN")
        .setFooter("zRooter ©")
      const basarisizEmbed = new Discord.MessageEmbed()
        .setTitle("InviteManager (Error)")
        .setColor("RED")
        .setFooter("zRooter ©")
    
    if(args.length <= 1) {
      message.reply({ embeds: [error] });
    } else {
      
      if(String(args[0]).toLowerCase() == "log") {
        if(String(args[1]).toLowerCase() == "set") {
          let channel = client.getChannel(args[2]);
          if(channel != null && channel.type == "GUILD_TEXT" && channel.guild.id == message.guild.id) {
            
            db.set(message.guild.id + ".logChannel", channel.id);
            
            basariliEmbed.setDescription(`
The log channel is succesfully edited.

**İnfo:**
> Channel: ${channel}
> Channel name: **${channel.name}**
            `)
            
            message.reply({ embeds: [basariliEmbed] })            
          } else {
            message.reply({ content: "**Error:** Invalid Channel", embeds: [error] });
          }
        } else if(String(args[1]).toLowerCase() == "clear") {
          if(db.fetch(message.guild.id + ".logChannel") != null) {
            db.delete(message.guild.id + ".logChannel");

            basariliEmbed.setDescription(`
The log channel is succesfully deleted.
            `)
            message.reply({ embeds: [basariliEmbed] })
          } else {
            basarisizEmbed.setDescription(`
The log channel is not set.
            `)
            
            message.reply({embeds: [basarisizEmbed]});
          }
        }
      } else if(String(args[0]).toLowerCase() == "add") {
        if(String(args[1]).toLowerCase() == "everyone") {
           
          let invites = parseInt(args[2]);
          if(invites) {
            client.addInvites(message.guild, invites, "everyone")
            basariliEmbed.setDescription(`
Succesfully gived \`${invites}\` invites to everyone.
            `)
            message.reply({ embeds: [basariliEmbed] })
          } else {
            message.reply({ content: "**Error:** Please give an invite count", embeds: [error]})
          }
        } else if(client.getUser(args[1]) != null) {
          let user = client.getUser(args[1]);
          let invites = parseInt(args[2]);
          if(invites) {
            client.addInvites(message.guild, invites, user)
            basariliEmbed.setDescription(`
Succesfully gived \`${invites}\` invites to ${user}.
            `)
            message.reply({ embeds: [basariliEmbed] })
          } else {
            message.reply({ content: "**Error:** Please give an invite count", embeds: [error]})
          }
        } else {
          message.reply({ content: "**Error:** Invalid User", embeds: [error]})
        }
      } else if(String(args[0]).toLowerCase() == "remove") {
        if(String(args[1]).toLowerCase() == "everyone") {
           
          let invites = parseInt(args[2]);
          if(invites) {
            client.removeInvites(message.guild, invites, "everyone")
            basariliEmbed.setDescription(`
Succesfully removed \`${invites}\` invites from everyone.
            `)
            message.reply({ embeds: [basariliEmbed] })
          } else {
            message.reply({ content: "**Error:** Please give an invite count", embeds: [error]})
          }
        } else if(client.getUser(args[1]) != null) {
          let user = client.getUser(args[1]);
          let invites = parseInt(args[2]);
          if(invites) {
            client.removeInvites(message.guild, invites, user)
            basariliEmbed.setDescription(`
Succesfully removed \`${invites}\` invites from ${user}.
            `)
            message.reply({ embeds: [basariliEmbed] })
          } else {
            message.reply({ content: "**Error:** Please give an invite count", embeds: [error]})
          }
        } else {
          message.reply({ content: "**Error:** Invalid User", embeds: [error]})
        }
      } else if(String(args[0]).toLowerCase() == "clear") {
        if(String(args[1]).toLowerCase() == "everyone") {
           
          client.clearInvites(message.guild, "everyone")
          basariliEmbed.setDescription(`
Succesfully removed \`all\` invites from everyone.
          `)
          message.reply({ embeds: [basariliEmbed] })
          
        } else if(client.getUser(args[1]) != null) {
          let user = client.getUser(args[1]);
         
          client.clearInvites(message.guild, user)
          basariliEmbed.setDescription(`
Succesfully removed \`all\` invites from ${user}.
          `)
          message.reply({ embeds: [basariliEmbed] })
        } else {
          message.reply({ content: "**Error:** Invalid User", embeds: [error]})
        }
      }
    }
  }
}