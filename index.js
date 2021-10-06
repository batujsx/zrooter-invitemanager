const Discord = require("discord.js");
const fs = require("fs");

const client = new Discord.Client({
  disableMentions: "everyone",
  intents: [32767],
  shards: "auto"
})
const {JsonDatabase} = require("wio.db");
client.commands = new Discord.Collection();

client.config = {
  "sahip": ["SAHİP"],
  "token": "TOKEN",
  "prefix": "!"
}

client.login(client.config.token);


// InviteManager

const guildInvites = new Map();
client.on("inviteCreate", async (invite) =>
  guildInvites.set(invite.guild.id, await invite.guild.invites.fetch())
);
client.on("ready", () => {
  client.guilds.cache.forEach((guild) => {
    guild.invites
      .fetch()
      .then((invites) => guildInvites.set(guild.id, invites))
      .catch((err) => {});
    console.log("Loaded invites for guild: " + guild.name)
  });
  console.log("Loginned as " + client.user.tag)
});

client.on('guildMemberAdd', async (member) => {
  const db = new JsonDatabase({
    databasePath: "Database/inviteDB"
  })
  
  let getInvites = guildInvites.get(member.guild.id);
  let newInvites = await member.guild.invites.fetch();
  guildInvites.set(member.guild.id, newInvites);
  const getInviteCode = newInvites.find((inv) =>
    getInvites.get(inv.code)
  );
    
    if(getInviteCode.inviter != null) {
      let logChannel = member.guild.channels.cache.get(db.fetch(member.guild.id + ".logChannel"));
      db.set(`${member.guild.id}.invites.${getInviteCode.inviter.id}.${member.id}`, true);
      if(logChannel != null) {
        let invites = db.fetch(`${member.guild.id}.invites.${getInviteCode.inviter.id}`) ? Object.keys(db.fetch(`${member.guild.id}.invites.${getInviteCode.inviter.id}`)).length : 0;
        let fakeInvites = db.fetch(`${member.guild.id}.fakeInvites.${getInviteCode.inviter.id}`) || 0;
        const embed = new Discord.MessageEmbed()
          .setTitle("InviteManager")
          .setAuthor(`${member.user.tag} (${member.id})`)
          .setDescription(`

Welcome ${member}!

> Invited by: ${getInviteCode.inviter}
> Invites: \`${invites+ fakeInvites}\`
          `)
         .setColor("GREEN")
         .setFooter("zRooter ©")
        logChannel.send({embeds: [embed]});
        
      }
    } else if(getInviteCode.inviter.id == member.id) {
      let logChannel = member.guild.channels.cache.get(db.fetch(member.guild.id + ".logChannel"));
      if(logChannel != null) {
        let invites = db.fetch(`${member.guild.id}.invites.${getInviteCode.inviter.id}`) ? Object.keys(db.fetch(`${member.guild.id}.invites.${getInviteCode.inviter.id}`)).length : 0;
        let fakeInvites = db.fetch(`${member.guild.id}.fakeInvites.${getInviteCode.inviter.id}`) || 0;
        const embed = new Discord.MessageEmbed()
          .setTitle("InviteManager")
          .setAuthor(`${member.user.tag} (${member.id})`)
          .setDescription(`

Welcome ${member}!

> Invited by: \`Self Invite\`
> Invites: \`${invites + fakeInvites}\`
          `)
         .setColor("GREEN")
         .setFooter("zRooter ©")
        logChannel.send({embeds: [embed]});
        
      }
    } else {
      let logChannel = member.guild.channels.cache.get(db.fetch(member.guild.id + ".logChannel"));
      if(logChannel != null) {
        const embed = new Discord.MessageEmbed()
          .setTitle("InviteManager")
          .setAuthor(`${member.user.tag} (${member.id})`)
          .setDescription(`

Welcome ${member}!

> Invited by: \`No one#0000\`
> Invites: \`0\`
          `)
          .setColor("GREEN")
          .setFooter("zRooter ©")
        logChannel.send({ embeds: [embed] });
        
      } 
    }
});
client.on('guildMemberRemove', async (member) => {
  
  const db = new JsonDatabase({
    databasePath: "Database/inviteDB"
  })
  let blndu = false;
  const invites = db.fetch(`${member.guild.id}.invites`) ? Object.keys(db.fetch(`${member.guild.id}.invites`)) : {};
  await invites.map(async(inviter) => {
    console.log(inviter)
    const invitesOfinviter = db.fetch(`${member.guild.id}.invites.${inviter}`) ? Object.keys(db.fetch(`${member.guild.id}.invites.${inviter}`)) : {};
    invitesOfinviter.map((user) => {
      console.log(user)
      if(user == member.id) {
        db.delete(`${member.guild.id}.invites.${inviter}.${user}`);
        let logChannel = member.guild.channels.cache.get(db.fetch(member.guild.id + ".logChannel"));
        if(logChannel != null) {
          let invitesss = db.fetch(`${member.guild.id}.invites.${inviter}`) ? Object.keys(db.fetch(`${member.guild.id}.invites.${inviter}`)).length : 0;
          let invitedBy = client.users.cache.get(inviter);
          let fakeInvites = db.fetch(`${member.guild.id}.fakeInvites.${inviter}`) || 0;
          const embed = new Discord.MessageEmbed()
            .setTitle("InviteManager")
            .setAuthor(`${member.user.tag} (${member.id})`)
            .setDescription(`

Good Bye ${member}!

> Invited by: ${invitedBy}
> Invites: \`${invitesss + fakeInvites}\`
          `)
            .setColor("RED")
            .setFooter("zRooter ©")
          logChannel.send({ embeds: [embed] });
          
        } 
        blndu = true;
      }
    })
  })
  if(blndu = false) {
    let logChannel = member.guild.channels.cache.get(db.fetch(member.guild.id + ".logChannel"));
    if(logChannel != null) {
      const embed = new Discord.MessageEmbed()
        .setTitle("InviteManager")
        .setAuthor(`${member.user.tag} (${member.id})`)
        .setDescription(`

Good Bye ${member}!

> Invited by: \`No one#0000\`
> Invites: \`0\`
        `)
        .setColor("RED")
        .setFooter("zRooter ©")
      logChannel.send({ embeds: [embed] });
        
      }
  }
  
})

client.loadCommands = fs.readdir("./commands", function(err, files) {
  files.forEach(cmd => {
    const properties = require("./commands/"+cmd);
    
    client.commands.set(properties.name, properties);
    if(properties.aliases.length > 0) {
      properties.aliases.forEach(alias => {
        client.commands.set(alias, properties);
      })
    }
    console.log("Loaded command " + properties.name)
  })
})

// Events

client.on("messageCreate", async(message) => {
  
  const args = message.content.split(" ").slice(client.config.prefix.length);
  const cmd = message.content.split(" ")[0].slice(client.config.prefix.length);
  
  const command = client.commands.get(cmd);
  if(command != null) {
    
    command.run(client, message, args);
    
  }
})

// Functions

client.getChannel = (string) => {
  
  var id = null;
  
  if(string.startsWith("<#") && string.endsWith(">")) {
    id = string
      .replace("<", "")
      .replace("#", "")
      .replace("!", "")
      .replace(">", "");
  } else if(client.channels.cache.get(string) != null) {
    id = string;
  } else {
    id = null;
  }
  
  if(id != null) {
    return client.channels.cache.get(id);
  } else {
    return null;
  }
}
client.addInvites = (guild, count, user) => {
  const db = new JsonDatabase({
    databasePath: "Database/inviteDB"
  })
  if(user == "everyone") {
    guild.members.cache.map((u) => {
      db.add(guild.id + ".fakeInvites." + u.id, count);
    })
  } else if(guild.members.cache.get(user.id) != null) {
    db.add(guild.id + ".fakeInvites." + user.id, count);
  } 
}

client.removeInvites = (guild, count, user) => {
  const db = new JsonDatabase({
    databasePath: "Database/inviteDB"
  })
  if(user == "everyone") {
    guild.members.cache.map((u) => {
      db.substr(guild.id + ".fakeInvites." + u.id, count);
    })
  } else if(guild.members.cache.get(user.id) != null) {
    db.substr(guild.id + ".fakeInvites." + user.id, count);
  } 
}
client.clearInvites = (guild, user) => {
  const db = new JsonDatabase({
    databasePath: "Database/inviteDB"
  })
  if(user == "everyone") {
    guild.members.cache.map((u) => {
      db.delete(guild.id + ".fakeInvites." + u.id);
      db.delete(guild.id + ".invites." + user.id);
    })
  } else if(guild.members.cache.get(user.id) != null) {
    db.delete(guild.id + ".fakeInvites." + user.id);
    db.delete(guild.id + ".invites." + user.id);
  } 
}
client.getUser = (string) => {
  
  var id = null;
  
  if(string.startsWith("<@") && string.endsWith(">")) {
    id = string
      .replace("<", "")
      .replace("@", "")
      .replace("!", "")
      .replace(">", "");
  } else if(client.users.cache.get(string) != null) {
    id = string;
  } else {
    id = null;
  }
  
  if(id != null) {
    return client.users.cache.get(id);
  } else {
    return null;
  }
}