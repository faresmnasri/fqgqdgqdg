const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');


const moment = require('moment');
       
 const dateFormat = require('dateformat');

var jimp = require('jimp')
const request = require('request');


const invites = {};

client.on('ready', () => {
   console.log(`----------------`);
      console.log(`By : FALLEGA TEAM.`);
        console.log(`---------------`);
      console.log(`ON ${client.guilds.size} Servers `);
    console.log(`---------------`);
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setGame(`FALLEGA TEAM`);
});
client.on('message', async message =>{
    var prefix = "*";
  
  const ms = require("ms");
  if (message.author.omar) return;
  if (!message.content.startsWith(prefix)) return;
  if(!message.channel.guild) return message.channel.send();
  if(!message.member.hasPermission('MANAGE_ROLES')) return message.channel.send().catch(console.error);{
  if(!message.guild.member(client.user).hasPermission("MANAGE_ROLES")) return message.reply("**I Don't Have `MANAGE_ROLES` Permission**").then(msg => msg.delete(6000)).catch(console.error);
  }
  var command = message.content.split(" ")[0];
  
  command = command.slice(prefix.length);
  var args = message.content.split(" ").slice(1);
      if(command == "mute") {
      let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
      if(!tomute) return message.reply("**يجب عليك المنشن اولاّ**:x: ") .then(m => m.delete(5000));
  if(tomute.hasPermission("ADMINISTRATOR"))return      message.channel.send("**لايمكن اعطاء  ميوت لاحد اعضاء الاداره**");
      let muterole = message.guild.roles.find(`name`, "muted");
      //start of create role
      if(!muterole){
        try{
          muterole = await message.guild.createRole({
            name: "muted",
            color: "#000000",
            permissions:[]
          })
          message.guild.channels.forEach(async (channel, id) => {
            await channel.overwritePermissions(muterole, {
              SEND_MESSAGES: false,
              ADD_REACTIONS: false
            });
          });
        }catch(e){
          console.log(e.stack);
        }
      }
      //end of create role
      let mutetime = args[1];
      if(!mutetime) return message.reply("**يرجى تحديد وقت الميوت**:x:");
    
      await(tomute.addRole(muterole.id));
      message.channel.send(`**<@${tomute.id}> تم اعطائه ميوت ومدة الميوت : ${ms(ms(mutetime))}:**`);
  setTimeout(function(){
        tomute.removeRole(muterole.id);
        message.channel.send(`<@${tomute.id}> **انقضى الوقت وتم فك الميوت عن الشخص**:white_check_mark: `);
      }, ms(mutetime));
    
    
    
  
    }  
  if(command === `unmute`) {
    if(!message.member.hasPermission("MANAGE_ROLES")) return message.channel.sendMessage("**ليس لديك صلاحية لفك عن الشخص ميوت**:x: ").then(m => m.delete(5000));
  if(!message.guild.member(client.user).hasPermission("MANAGE_ROLES")) return message.reply("**I Don't Have `MANAGE_ROLES` Permission**").then(msg => msg.delete(6000))
  
    let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
    if(!toMute) return message.channel.sendMessage("**:information_source:  `#unmute @! ΜคŘ` يجب تحديد شخص   **");
  
    let role = message.guild.roles.find (r => r.name === "muted");
    
    if(!role || !toMute.roles.has(role.id)) return message.channel.sendMessage("**لم يتم اعطاء هذه شخص ميوت من الأساس**:x:**")
  
    await toMute.removeRole(role)
    message.channel.sendMessage("**لقد تم فك الميوت عن شخص بنجاح**:white_check_mark:**");
  
    return;
  
    }
  
  });
  
  
  client.on("message", message => {
      var prefix = "*";
      var args = message.content.split(' ').slice(1); 
      var msg = message.content.toLowerCase();
      if( !message.guild ) return;
      if( !msg.startsWith( prefix + 'role' ) ) return;
      if( msg.toLowerCase().startsWith( prefix + 'roleremove' ) ){
  
          if(!message.member.hasPermission('ADMINISTRATOR')) return; 
          if( !args[0] ) return message.reply( '**:x: يرجى وضع الشخص المراد سحب منه الرتبة**' );
          if( !args[1] ) return message.reply( '**:x: يرجى وضع الرتبة المراد سحبها من الشخص**' );
          var role = msg.split(' ').slice(2).join(" ").toLowerCase(); 
          var role1 = message.guild.roles.filter( r=>r.name.toLowerCase().indexOf(role)>-1 ).first(); 
          if( !role1 ) return message.reply( '**:x: يرجى وضع الرتبة المراد سحبها من الشخص**' );if( message.mentions.members.first() ){
              message.mentions.members.first().removeRole( role1 );
              return message.reply('**:white_check_mark: [ '+role1.name+' ] رتبة [ '+args[0]+' ] تم سحب من **');
          }
          if( args[0].toLowerCase() == "all" ){
              if(!message.member.hasPermission('ADMINISTRATOR')) return;
              message.guild.members.forEach(m=>m.removeRole( role1 ))
              return	message.reply('**:white_check_mark: [ '+role1.name+' ] تم سحب من الكل رتبة**');
          } else if( args[0].toLowerCase() == "bots" ){
              message.guild.members.filter(m=>m.user.bot).forEach(m=>m.removeRole(role1))
              return	message.reply('**:white_check_mark: [ '+role1.name+' ] تم سحب من البوتات رتبة**');
          } else if( args[0].toLowerCase() == "humans" ){
              message.guild.members.filter(m=>!m.user.bot).forEach(m=>m.removeRole(role1))
              return	message.reply('**:white_check_mark: [ '+role1.name+' ] تم سحب من البشريين رتبة**');
          } 	
      } else {
          if(!message.member.hasPermission('ADMINISTRATOR')) return;
          if( !args[0] ) return message.reply( '**:x: يرجى وضع الشخص المراد اعطائها الرتبة**' );
          if( !args[1] ) return message.reply( '**:x: يرجى وضع الرتبة المراد اعطائها للشخص**' );
          var role = msg.split(' ').slice(2).join(" ").toLowerCase(); 
          var role1 = message.guild.roles.filter( r=>r.name.toLowerCase().indexOf(role)>-1 ).first(); 
          if( !role1 ) return message.reply( '**:x: يرجى وضع الرتبة المراد اعطائها للشخص**' );if( message.mentions.members.first() ){
              message.mentions.members.first().addRole( role1 );
              return message.reply('**:white_check_mark: [ '+role1.name+' ] رتبة [ '+args[0]+' ] تم اعطاء **');
          }
          if( args[0].toLowerCase() == "all" ){
              if(!message.member.hasPermission('ADMINISTRATOR')) return;
              message.guild.members.forEach(m=>m.addRole( role1 ))
              return	message.reply('**:white_check_mark: [ '+role1.name+' ] تم اعطاء الكل رتبة**');
          } else if( args[0].toLowerCase() == "bots" ){
              if(!message.member.hasPermission('ADMINISTRATOR')) return;
              message.guild.members.filter(m=>m.user.bot).forEach(m=>m.addRole(role1))
              return	message.reply('**:white_check_mark: [ '+role1.name+' ] تم اعطاء البوتات رتبة**');
          } else if( args[0].toLowerCase() == "humans" ){
              if(!message.member.hasPermission('ADMINISTRATOR')) return;
              message.guild.members.filter(m=>!m.user.bot).forEach(m=>m.addRole(role1))
              return	message.reply('**:white_check_mark: [ '+role1.name+' ] تم اعطاء البشريين رتبة**');
          } 
      } 
  });
  
  
    
    client.on("guildMemberAdd", member => {
    member.createDM().then(function (channel) {
    return channel.send(` welcome to server ${member} `) 
  }).catch(console.error)
  })
  
  
  
  
   client.on("message", message => {
      var prefix = "*";
      const command = message.content.split(" ")[0];
  
      if(command == prefix+"vc"){
  
          if (!message.guild.member(message.author).hasPermission('MOVE_MEMBERS') || !message.guild.member(message.author).hasPermission('ADMINISTRATOR')) {
              return message.reply('you do not have permission to perform this action!');
          }
  
          var member = message.guild.members.get(message.mentions.users.array()[0].id);
          if(!message.mentions.users){
              
             
               message.channel.send(`**please mention the member**`);
                return;
          }
  
      if(!member.voiceChannel){
      message.reply("i can't include voice channel for member!")
      return;
      }
                message.guild.createChannel('voicekick', 'voice').then(c => {
                  member.setVoiceChannel(c).then(() => {
                      c.delete(305).catch(console.log)
          
  
  
      
        });
       });
      }
  });  
  client.on('message', message => {
      if (message.content === "*server") {
          if (!message.channel.guild) return;
          const millis = new Date().getTime() - message.guild.createdAt.getTime();
          const now = new Date();
  
  
          const days = millis / 1000 / 60 / 60 / 24;
          let roles = client.guilds.get(message.guild.id).roles.map(r => r.name);
          var embed = new Discord.RichEmbed()
              .setAuthor(message.guild.name, message.guild.iconURL)
              .addField("**Server ID**", "**" + message.guild.id + "**", true)
              .addField("**Server Owner**", "**" + message.guild.owner + "**", true)
              .addField("**Server Location**", "**" + message.guild.region + "**", true)
              .addField('**Server Text Channels**', `**[ ${message.guild.channels.filter(m => m.type === 'text').size} ] Channel **`, true)
              .addField("**Server Voice Channels**", ` ** [ ${message.guild.channels.filter(m => m.type === 'voice').size} ] Channel ** `, true)
              .addField("**Date created**", ` ** [ ${days.toFixed(0)} ] ** Day `, true)
              .addField("**Roles**", `**[${message.guild.roles.size}]** Role `, true)
  
          .addField("Members", `
  **${message.guild.memberCount}**`)
              .setThumbnail(message.guild.iconURL)
              .setColor('RANDOM')
          message.channel.sendEmbed(embed)
  
      }
  });   
     
    client.on('message', function(message) {
         if(!message.channel.guild) return;
      if (!message.member.hasPermissions(['ADMINISTRATOR'])){ 
          
              let command = message.content.split(" ")[0];
          if(message.content.includes('discord.gg')){
          if(!message.channel.guild) return;
          message.delete()
          message.reply(`**no links pls**`).then(msg => msg.delete(1000));
           
          }
      }
  });     
     
   client.on('message' , message => {
    var prefix = "*";
    if(message.author.bot) return;
   
    if(message.content.startsWith(prefix + "xo")) {
   let array_of_mentions = message.mentions.users.array();
    let symbols = [':o:', ':heavy_multiplication_x:']
    var grid_message;
   
    if (array_of_mentions.length == 1 || array_of_mentions.length == 2) {
      let random1 = Math.floor(Math.random() * (1 - 0 + 1)) + 0;
      let random2 = Math.abs(random1 - 1);
      if (array_of_mentions.length == 1) {
        random1 = 0;
        random2 = 0;
      }
      var player1_id = message.author.id
      let player2_id = array_of_mentions[random2].id;
      var turn_id = player1_id;
      var symbol = symbols[0];
      let initial_message = `Game match between <@${player1_id}> and <@${player2_id}>!`;
      if (player1_id == player2_id) {
        initial_message += '\n_(What a loser, playing this game with yourself :joy:)_'
      }
      message.channel.send(`Xo ${initial_message}`)
      .then(console.log("Successful tictactoe introduction"))
      .catch(console.error);
      message.channel.send(':one::two::three:' + '\n' +
                           ':four::five::six:' + '\n' +
                           ':seven::eight::nine:')
      .then((new_message) => {
        grid_message = new_message;
      })
      .then(console.log("Successful tictactoe game initialization"))
      .catch(console.error);
      message.channel.send('Loading... Please wait for the :ok: reaction.')
      .then(async (new_message) => {
        await new_message.react('1⃣');
        await new_message.react('2⃣');
        await new_message.react('3⃣');
        await new_message.react('4⃣');
        await new_message.react('5⃣');
        await new_message.react('6⃣');
        await new_message.react('7⃣');
        await new_message.react('8⃣');
        await new_message.react('9⃣');
        await new_message.react('🆗');
        await new_message.edit(`It\'s <@${turn_id}>\'s turn! Your symbol is ${symbol}`)
        .then((new_new_message) => {
          require('./xo.js')(client, message, new_new_message, player1_id, player2_id, turn_id, symbol, symbols, grid_message);
        })
        .then(console.log("Successful tictactoe listener initialization"))
        .catch(console.error);
      })
      .then(console.log("Successful tictactoe react initialization"))
      .catch(console.error);
    }
    else {
      message.reply(`use *xo @uesr`)
      .then(console.log("Successful error reply"))
      .catch(console.error);
    }
  }
   });
      
  client.on('message', message => {
      var prefix = "*";
               if (!message.channel.guild) return;
        if (message.author.bot) return;
  
    if (!message.content.startsWith(prefix)) return;
    let command = message.content.split(" ")[0];
    command = command.slice(prefix.length);
    let args = message.content.split(" ").slice(1);
    
    if (command === 'inv') {
      message.guild.fetchInvites().then(invs => {
        let member = client.guilds.get(message.guild.id).members.get(message.author.id);
        let personalInvites = invs.filter(i => i.inviter.id === message.author.id);
        let inviteCount = personalInvites.reduce((p, v) => v.uses + p, 0);
  message.channel.send(`**you invite ${inviteCount} to this server**`);
  });
  }});
  
  client.on('message', message => {
      if (message.author.id === client.user.id) return;
  if(!message.channel.guild) return
     let embed = new Discord.RichEmbed()
      let args = message.content.split(' ').slice(1).join(' ');
  if(message.content.startsWith( '*' + 'bc')) {
          message.guild.members.forEach(member => {
     if(!message.member.hasPermission('ADMINISTRATOR')) return;
              member.send(`${member} ** ${args}** `);
  
          });
      }
  
  });
  
  
  
  
  client.on("message",  message => {
      var prefix = "*";
      let args = message.content.split(' ').slice(1);
  if(message.content.startsWith(prefix + 'nic')) {
     if (!message.member.hasPermission("MANAGE_NICKNAMES")) {
         message.channel.send("ضع الاسم")
     } else {
         if (!message.guild.member(client.user).hasPermission('MANAGE_NICKNAMES')) return message.reply(' ❌البوت ما عنده خاصية MANAGE_NICKNAMES.').catch(console.error);
         let changenick = message.mentions.users.first();
         let username = args.slice(1).join(' ')
         if (username.length < 1) return message.reply('ضع الاسم').catch(console.error);
         if (message.mentions.users.size < 1) return message.author.send('You must mention a user to change their nickname. ❌').catch(console.error);
         message.guild.member(changenick.id).setNickname(username);
         message.channel.send("تم تغيير الاسم الى: " + changenick + "")
     }
  }});
  
  client.on("message", (message) => {
      if (message.content.startsWith("*kick")) {
        if(!message.member.hasPermission('KICK_MEMBERS')) return message.reply('? :warning: you dont have a Permission sory');
            if (message.mentions.users.size < 1) return message.reply("**؟ Choose a person**");
          var member= message.mentions.members.first();
          member.kick().then((member) => {
              message.channel.send(member.displayName + " bye :wave: ");
          }).catch(() => {
              message.channel.send("Error -_-");
          });
      }
  });
  client.on("message", (message) => {
      if (message.content.startsWith("*ban")) {
        if(!message.member.hasPermission('BAN_MEMBERS')) return message.reply(':warning: you dont have a Permission sory');
          var member= message.mentions.members.first();
           if (message.mentions.users.size < 1) return message.reply("**؟ Choose a person**");
          member.ban().then((member) => {
              message.channel.send(member.displayName + " bye :wave: ");
          }).catch(() => {
              message.channel.send("Error -_-");
          });
      }
  });
  
  client.on("message", message => {
      var prefix = "**";
   
              var args = message.content.substring(prefix.length).split(" ");
              if (message.content.startsWith(prefix + "clear")) {
     if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.reply('⚠ | **ليس لديك صلاحيات**');
          var lmt = message.content.split(' ')[1]
      var msg;
            msg = parseInt();
          
         
        
        message.channel.fetchMessages({limit: msg}).then(messages => message.channel.bulkDelete(messages)).catch(console.error);
        message.channel.send('`done`').then(m => m.delete(1000));
      }
  });
  var prefix = "*"
  client.on('message', msg => {
    if (msg.author.bot) return;
    if (!msg.content.startsWith(prefix)) return;
    let command = msg.content.split(" ")[0];
    command = command.slice(prefix.length);
    let args = msg.content.split(" ").slice(1);
  
      if(command === "clear") {
          const emoji = client.emojis.find("name", "wastebasket")
      let textxt = args.slice(0).join("");
      if(msg.member.hasPermission("MANAGE_MESSAGES")) {
      if (textxt == "") {
          msg.delete().then
     
  } else {
      msg.delete().then
      msg.delete().then
      msg.channel.bulkDelete(textxt);
          msg.channel.send("```php\nعدد الرسائل التي تم مسحها: " + textxt + "\n```").then(m => m.delete(3000));
          }    
      }
  }
  });
  client.on('message', message => {
    if (message.content.startsWith ("*in")) {
     if(!message.channel.guild) return message.reply('** This command only for servers **');
         var mentionned = message.mentions.users.first();
        var os;
      if(mentionned){
          var os = mentionned.id;
      } else {
          var os = message.author.id;
          
      }
          var oss;
      if(mentionned){
          var oss = mentionned;
      } else {
          var oss = message.author;
          
      }
  message.guild.fetchInvites()
  .then(invites =>{
  if(!invites.find(invite => invite.inviter.id === `${os}`)) return message.channel.send(`**${oss.username}, Does't Have Invites :x:**`);
  message.channel.send(`**__${invites.find(invite => invite.inviter.id === `${os}`).uses}__ Member Joined By ${oss.username} !** :chart_with_upwards_trend: `)
  
  })
  
  
  
  }
  
  });
  
  
  
  
  client.on("message", message => {
      var prefix = "**";
              var args = message.content.substring(prefix.length).split(" ");
              if (message.content.startsWith(prefix + "clear")) {
   if (!args[1]) {
                                 
                                
                     } else {
                              let messagecount = parseInt(args[1]);
                              message.channel.fetchMessages({limit: messagecount}).then(messages => message.channel.bulkDelete(messages));
                                                            message.channel.fetchMessages({limit: messagecount}).then(messages => message.channel.bulkDelete(messages));
                              message.channel.fetchMessages({limit: messagecount}).then(messages => message.channel.bulkDelete(messages));
                              message.channel.fetchMessages({limit: messagecount}).then(messages => message.channel.bulkDelete(messages));
                                                            message.channel.fetchMessages({limit: messagecount}).then(messages => message.channel.bulkDelete(messages));
                              message.channel.fetchMessages({limit: messagecount}).then(messages => message.channel.bulkDelete(messages));
                              message.channel.fetchMessages({limit: messagecount}).then(messages => message.channel.bulkDelete(messages));
                                                            message.channel.fetchMessages({limit: messagecount}).then(messages => message.channel.bulkDelete(messages));
                                  message.channel.send("***:white_check_mark: | Delete " + args[1] + " Message!***").then(m => m.delete(3000));
                                  
                                                                                        
  
                              }
                            }
  });
                      
                      
        
  
  client.on('message', message => {
  
         if(message.content === prefix + "mutechannel") {
                             if(!message.channel.guild) return message.reply('** This command only for servers**');
  
     if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.reply(' **__ليس لديك صلاحيات__**');
                message.channel.overwritePermissions(message.guild.id, {
              SEND_MESSAGES: false
  
                }).then(() => {
                    message.reply("**__تم تقفيل الشات__ :white_check_mark: **")
                });
                  }
  //viper
      if(message.content === prefix + "unmutechannel") {
                          if(!message.channel.guild) return message.reply('** This command only for servers**');
  
     if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.reply('**__ليس لديك صلاحيات__**');
                message.channel.overwritePermissions(message.guild.id, {
              SEND_MESSAGES: true
  
                }).then(() => {
                    message.reply("**__تم فتح الشات__:white_check_mark:**")
                });
                  }
                  
           
         
  });
  
  const translate = require('google-translate-api');
  const Langs = ['afrikaans','albanian','amharic','arabic','armenian','azerbaijani','bangla','basque','belarusian','bengali','bosnian','bulgarian','burmese','catalan','cebuano','chichewa','chinese simplified','chinese traditional','corsican','croatian','czech','danish','dutch','english','esperanto','estonian','filipino','finnish','french','frisian','galician','georgian','german','greek','gujarati','haitian creole','hausa','hawaiian','hebrew','hindi','hmong','hungarian','icelandic','igbo','indonesian','irish','italian','japanese','javanese','kannada','kazakh','khmer','korean','kurdish (kurmanji)','kyrgyz','lao','latin','latvian','lithuanian','luxembourgish','macedonian','malagasy','malay','malayalam','maltese','maori','marathi','mongolian','myanmar (burmese)','nepali','norwegian','nyanja','pashto','persian','polish','portugese','punjabi','romanian','russian','samoan','scottish gaelic','serbian','sesotho','shona','sindhi','sinhala','slovak','slovenian','somali','spanish','sundanese','swahili','swedish','tajik','tamil','telugu','thai','turkish','ukrainian','urdu','uzbek','vietnamese','welsh','xhosa','yiddish','yoruba','zulu'];
  
  client.on('message' , async (message) => {
         if(message.content.startsWith(prefix + "translate")) {
                let args = message.content.split(" ").slice(1);
  
    if (args[0] === undefined) {
  
      const embed = new Discord.RichEmbed()
      .setColor("FFFFFF")
      .setDescription("**Provide a language and some text for bot to translate.**\nUsage: `PREFIXX translate <language> <text>`");
  
      return message.channel.send(embed);
  
    } else {
  
      if (args[1] === undefined) {
  
        return message.channel.send('**Please give me something to translate.** `PREFIX translate <language> <text>`');
  
      } else {
  
        let transArg = args[0].toLowerCase();
  
        args = args.join(' ').slice(prefix.length);
        let translation;
  
        if (!Langs.includes(transArg)) return message.channel.send(`**Language not found.**`);
        args = args.slice(transArg.length);
  
        translate(args, {to: transArg}).then(res => {
  
          const embed = new Discord.RichEmbed()
          .setDescription(res.text)
          .setFooter(`english -> ${transArg}`)
          .setColor(`RANDOM`);
          return message.channel.send(embed);
  
        });
  
      }
  
    }
  
  }
  });
  
  client.on("message", message => {
   if (message.content === prefix + "***help") {
    const embed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setThumbnail(message.author.avatarURL)
        .setDescription(`
  
  ** Bot ${client.user.username} Commands **
  ● ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ ●
  ** -    [ ${prefix}invites ]  [ لمعرفة عدد الدعوات الخاصة بك في السيرفر ]
  
  -    [ ${prefix}ping ]  [ لمعرفة سرعة الاتصال ]
  
  -    [ ${prefix}clear ]  [ لحذف الرسائل ]
  
  -    [ ${prefix}Date ]  [ لمعرفة الوقت في مصر و مكة والامارات ]
  
  -    [ ${prefix}mute ]  [ لعطاء العضو ميوت معا ذكر السبب  ]
  
  -    [ ${prefix}unmute ]  [ لازالة الميوت عن العضو  ]
  
  -    [ ${prefix}broadcast ]  [ لارسال رسالة لجميع اعضاء السيرفر  ]
  
  -    [ ${prefix}avatar ]  [ لظهار الصورة الخاص بـ العضو  ]
  
  -    [ ${prefix}users ]  [ لظهار عدد اعضاء السيرفر بشكل مطور  ]
  
  -    [ ${prefix}server ]  [ لمعرفة معلومات عن السيرفر ]  **
  
  ● ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ ●
  
  `)
  
  
  message.author.sendEmbed(embed)
  
  }
  });
  client.on('message', message => {
                      var prefix = "*";
  
             if (message.content.startsWith(prefix + "id")) {
                       if(!message.channel.guild) return message.reply(`هذا الأمر فقط ل السيرفرات ❌`);
  
                  message.guild.fetchInvites().then(invs => {
        let member = client.guilds.get(message.guild.id).members.get(message.author.id);
        let personalInvites = invs.filter(i => i.inviter.id === message.author.id);
        let inviteCount = personalInvites.reduce((p, v) => v.uses + p, 0);
        var moment = require('moment');
        var args = message.content.split(" ").slice(1);
  let user = message.mentions.users.first();
  var men = message.mentions.users.first();
   var heg;
   if(men) {
       heg = men
   } else {
       heg = message.author
   }
  var mentionned = message.mentions.members.first();
    var h;
   if(mentionned) {
       h = mentionned
   } else {
       h = message.member
   }
          moment.locale('ar-TN');
        var id = new  Discord.RichEmbed()
         
      .setColor("#0a0909")
      .setAuthor(message.author.username, message.author.avatarURL) 
  .addField(': you join discord at', `${moment(heg.createdTimestamp).format('YYYY/M/D HH:mm:ss')} **\n** \`${moment(heg.createdTimestamp).fromNow()}\`` ,true) 
  .addField(': you yoin this server at', `${moment(h.joinedAt).format('YYYY/M/D HH:mm:ss')} \n \`${moment(h.joinedAt).fromNow()}\``, true)
  .addField(': you invite', inviteCount,false)
  .setFooter("lg bot")  
      message.channel.sendEmbed(id);
  })
  }
      
  
           
       });
  client.on('message', msg => {
    if (msg.author.bot) return;
    if (!msg.content.startsWith(prefix)) return;
    let command = msg.content.split(" ")[0];
    command = command.slice(prefix.length);
    let args = msg.content.split(" ").slice(1);
  
      if(command === "purge") {
          const emoji = client.emojis.find("name", ":wastebasket:")
      let textxt = args.slice(0).join("");
      if(msg.member.hasPermission("MANAGE_MESSAGES")) {
      if (textxt == "") {
      msg.channel.send("ضع عددا من الرسائل التي تريد مسحها");
  } else {
      msg.delete().then
      msg.delete().then
      msg.channel.bulkDelete(textxt);
      msg.channel.send(`${emoji} Deleted ` + "`" + textxt + "` messages");
          }    
      }
  }
  });
  
  client.on('message', message => {
             if (message.content.startsWith("id2")) {
       var args = message.content.split(" ").slice(1);
       let user = message.mentions.users.first();
       var men = message.mentions.users.first();
          var heg;
          if(men) {
              heg = men
          } else {
              heg = message.author
          }
        var mentionned = message.mentions.members.first();
           var h;
          if(mentionned) {
              h = mentionned
          } else {
              h = message.member
          }
                 moment.locale('ar-TN');
        var id = new  Discord.RichEmbed()
      .setColor("RANDOM")
      .addField(': انضمامك لسيرفر قبل', `${moment(h.joinedAt).format('YYYY/M/D HH:mm:ss')} \n \`${moment(h.joinedAt).fromNow()}\``, true)
      .addField(': دخولك لديسكورد قبل', `${moment(heg.createdTimestamp).format('YYYY/M/D HH:mm:ss')} **\n** \`${moment(heg.createdTimestamp).fromNow()}\`` ,true)
     .setThumbnail(message.author.avatarURL)
      message.channel.send(id)
  }      
            });
            
            client.on('message', message => {
      if (message.content.startsWith("*invites")) {
      message.guild.fetchInvites()
      .then(invites => message.channel.send(`you invite   ${invites.find(invite => invite.inviter.id === message.author.id).uses}to this server `))
  
  
  
       
      }
  });
  
  
  client.on('message', message => {
                if (!message.channel.guild) return;
        if(message.content =='*member')
        var IzRo = new Discord.RichEmbed()
        .setThumbnail(message.author.avatarURL)
        .setFooter(message.author.username, message.author.avatarURL) 
        .setTitle('🌷| Members info')
        .addBlankField(true)
        .addField('📗| Online',
        `${message.guild.members.filter(m=>m.presence.status == 'online').size}`)
        .addField('📕| DND',`${message.guild.members.filter(m=>m.presence.status == 'dnd').size}`)
        .addField('📙| Idle',`${message.guild.members.filter(m=>m.presence.status == 'idle').size}`)
        .addField('📓| Offline',`${message.guild.members.filter(m=>m.presence.status == 'offline').size}`)
        .addField('➡| Server Members',`${message.guild.memberCount}`)
        message.channel.send(IzRo);
      
      });
  
   let PREFIX = '*' //Prefix Can Be Any 
  
  client.on('message', message => { 
  
      if (message.content.startsWith(PREFIX + 'emojilist')) {
  
          const List = message.guild.emojis.map(e => e.toString()).join(" ");
  
          const EmojiList = new Discord.RichEmbed()
              .setTitle('➠ Emoji\'s') //Title
              .setAuthor(message.guild.name, message.guild.iconURL) 
              .setColor('RANDOM')
              .setDescription(List) 
              .setTimestamp() 
              .setFooter(message.guild.name)
          message.channel.send(EmojiList) 
  
          //------------------------------------------------------------------------------
         
           
      }
  });
  
  
  const yourID = "373892191791087617";
  
  
  const setupCMD = "*FLG bro"
  let initialMessage = `**@everyone  _ @here  welcome to lg role react**
  **React to the messages below to get role. If you would like to remove the role remove your reaction!** `;
  const roles = ["GAY", "KID", "+18", "16-17", "funny", "zamel", "3nab", "bitch", "m3wa9", "singel"];
  const reactions = ["👬", "👶", "😊", "🔞", "😂", "😘", "🍇", "💋", "🙅", "💔"];
  
  if (roles.length !== reactions.length) throw "Roles list and reactions list are not the same length!";
  
  
  function generateMessages(){
      var messages = [];
      messages.push(initialMessage);
      for (let role of roles) messages.push(`React below to get the **"${role}"** role!`); 
      return messages;
  }
  
  
  client.on("message", message => {
      if (message.author.id == yourID && message.content.toLowerCase() == setupCMD){
          var toSend = generateMessages();
          let mappedArray = [[toSend[0], false], ...toSend.slice(1).map( (message, idx) => [message, reactions[idx]])];
          for (let mapObj of mappedArray){
              message.channel.send(mapObj[0]).then( sent => {
                  if (mapObj[1]){
                    sent.react(mapObj[1]);  
                  } 
              });
          }
      }
  })
  
  
  client.on('raw', event => {
      if (event.t === 'MESSAGE_REACTION_ADD' || event.t == "MESSAGE_REACTION_REMOVE"){
          
          let channel = client.channels.get(event.d.channel_id);
          let message = channel.fetchMessage(event.d.message_id).then(msg=> {
          let user = msg.guild.members.get(event.d.user_id);
          
          if (msg.author.id == client.user.id && msg.content != initialMessage){
         
              var re = `\\*\\*"(.+)?(?="\\*\\*)`;
              var role = msg.content.match(re)[1];
          
              if (user.id != client.user.id){
                  var roleObj = msg.guild.roles.find('name', role);
                  var memberObj = msg.guild.members.get(user.id);
                  
                  if (event.t === "MESSAGE_REACTION_ADD"){
                      memberObj.addRole(roleObj)
                  } else {
                      memberObj.removeRole(roleObj);
                  }
              }
          }
          })
   
      }   
  });
          
  client.on('message', message => {
      if (message.content.startsWith("*avatar")) {
          var mentionned = message.mentions.users.first();
      var x5bzm;
        if(mentionned){
            var x5bzm = mentionned;
        } else {
            var x5bzm = message.author;
            
        }
          const embed = new Discord.RichEmbed()
          .setColor("RANDOM")
          .setImage(`${x5bzm.avatarURL}`)
        message.channel.sendEmbed(embed);
      }
  });
  
      
  client.on('message', message => {
    if (message.content.startsWith("**avatar")) {
  
        var mentionned = message.mentions.users.first();
    var mar;
      if(mentionned){
          var mar = mentionned;
      } else {
          var mar = message.author;
          
      }
        const embed = new Discord.RichEmbed()
        .setColor("RANDOM")
          .setAuthor(message.author.username, message.author.avatarURL)
        .setImage(`${mar.avatarURL}`)
      message.channel.sendEmbed(embed);
  
    }
  });
  
      
    client.on('voiceStateUpdate', (old, now) => {
    const channel = client.channels.get('458244745693757453');
    const currentSize = channel.guild.members.filter(m => m.voiceChannel).size;
    const size = channel.name.match(/\[\s(\d+)\s\]/);
    if (!size) return channel.setName(`-lg Voice Online -[${currentSize}]`);
    if (currentSize !== size) channel.setName(`-lg Voice Online -[${currentSize}]`);
  });      
  
    
  
  
  
     client.on('message', message =>{
      if(message.author.bot) return;
      if(!message.content == (prefix+'*clear'))
  if(!true) return;
      if(message.content.split(' ')[0] == (prefix+'*clear')){
      var lmt = message.content.split(' ')[1]
      ,  hang = 0
      ,  max  = 0;
      
      if(!lmt) lmt = 200;
      if(typeof lmt !== 'number') return;
      if(lmt > 100){
          for(;lmt > 100;){
          lmt--;
          hang++;
          }
          }
       message.channel.fetchMessages({limite:lmt}).then(msgs=>{
       msgs.channel.bulkDelete(msgs);
       });
       if(hang > 100){
           hang = 100;
       }
          message.channel.fetchMessages({limite:hang}).then(msgs=>{
          message.channel.bulkDelete(msgs);
       });
       
      max= hang+lmt;
      message.reply(` **Done, i have delete ${max} messages!**.`).catch(()=>{
          message.reply(` **Sorry, i can only bulk delete messages that are under 14 days old**.`)
      });
      }
  });
  
 
  
  client.on('message' , async (message) => {
      if (message.content.startsWith(prefix + 'dog')) {
  
      
      const { body } = await superagent
      .get('https://dog.ceo/api/breeds/image/random');
      const embed = new Discord.RichEmbed()
      .setColor(0x954D23)
      .setTitle("Woof :dog2:")
      .setImage(body.message)
      message.channel.send({embed})
      
  
  
  }
  }); 
  
  client.on('message' , async (message) => {
         if(message.content.startsWith("*مسح")) {
             let args = message.content.split(" ").slice(1);
   if (isNaN(args[0])) return message.channel.send('**Please supply a valid amount of messages to purge**');
    if (args[0] > 100) return message.channel.send('**Please supply a number less than 100**');
    message.channel.bulkDelete,message.channel.bulkDelete,message.channel.bulkDelete(args[0])
      .then(messages => message.channel.send(`**Successfully deleted \`${messages.size}/${args[0]}\` messages**`).then(message => message.delete({
        timeout: 10000
      }))) 
  }
  });
  
  
  
  const math = require('math-expression-evaluator');
  client.on('message' , async (message) => {
         if(message.content.startsWith(prefix + "mh")) {
            let args = message.content.split(" ").slice(1);
      const embed = new  Discord.RichEmbed()
          .setColor(0xffffff);
      if (!args[0]) {
          embed.setFooter('Please input an expression.');
          return message.channel.send(embed);
      }
      let result;
      try {
          result = math.eval(args.join(' '));
      } catch (e) { 
          result = 'Error: "Invalid Input"';
      }
      embed.addField('Input', `\`\`\`js\n${args.join(' ')}\`\`\``)
           .addField('Output', `\`\`\`js\n${result}\`\`\``);
      message.channel.send(embed);
      
  }
  });	
  const ms = require("ms");
  client.on('message' , async (message) => {
      if (message.content.startsWith(prefix + 'time')) {
           let args = message.content.split(" ").slice(1);
  let Timer = args[0];
  if(!args[0]){
    return message.channel.send("Please enter a period of time, with either `s,m or h` at the end!");
  }
  if(args[0] <= 0){
    return message.channel.send("Please enter a period of time, with either `s,m or h` at the end!");
  }
  message.channel.send(":white_check_mark: Timer has been set for: " + `${ms(ms(Timer), {long: true})}`)
  
  setTimeout(function(){
    message.channel.send(`Timer has ended, it lasted: ${ms(ms(Timer), {long: true})}` + message.author.toString())
  }, ms(Timer));
  } 
  }); 
  const arraySort = require('array-sort'),
        table = require('table');
  
  client.on('message' , async (message) => {
  
      if(message.content.startsWith(prefix + "top")) {
  
    let invites = await message.guild.fetchInvites();
  
      invites = invites.array();
  
      arraySort(invites, 'uses', { reverse: true });
  
      let possibleInvites = [['User', 'Uses']];
      invites.forEach(i => {
        possibleInvites.push([i.inviter.username , i.uses]);
      })
      const embed = new Discord.RichEmbed()
      .setColor(0x7289da)
      .setTitle("Invites")
      .addField(' Top !' , `\`\`\`${table.table(possibleInvites)}\`\`\``)
  
      message.channel.send(embed)
      }
  });
  
  const ownerid = '439187325503930369'
  client.colors = {}
  
  //let rainbow = 0;
  
   client.on("ready", async () => {
      console.log(`Logged in as ${client.user.tag}!`);
  
      client.user.setGame(`☆ Store Games ☆`, {type: "2"});
  
    });
      client.setInterval(() =>{
  
          //adding this so it doesnt start doing weird stuff
          //try to change role color for every server
          for(let i in client.colors) {
              let guildId = client.colors[i].guild;
              let guild = client.guilds.get(guildId);
              let date = client.colors[i].date;
  
  
              //if 72 hours have passed, remove from config
              if(date < new Date().getTime() - 259200000) {
                   delete client.colors[i];
                  return;
              }
  
              //if server gets deleted or bot gets kicked, remove from config
              if(guild === null) {
                  delete client.colors[i];
                  return;
              }
              //try to change the role
              try{
                  guild.roles.find("name", client.colors[i].role).setColor(rainbow[place])
                  
                  .catch(err => { 
                      delete client.colors[i]
                     
                      return;
                  });
              }catch(err){
                  delete client.colors[i]
                  return;
              }
          }
              if(place == (size - 1)) {
              place = 0;
          } else {
              place++;
          }
          //Every 10 seconds change it
      }, 500)
  
  
  client.on('message', message => {
      var prefix = "*"
    if (message.author.x5bz) return;
    if (!message.content.startsWith(prefix)) return;
  
    let command = message.content.split(" ")[0];
    command = command.slice(prefix.length);
  
    let args = message.content.split(" ").slice(1);
      if(command === "stats") {
          var time = process.uptime();
          var uptime = (time + "").toHHMMSS();
  
          const embed = new Discord.RichEmbed()
          .setTitle(":tools: Stats")
          .setColor(0x009688)
          .setDescription( 
          ":crown: " +              "Servers: " + client.guilds.size + "\n" + 
          ":bust_in_silhouette: " + "Users: " + client.users.size + "\n" + 
          ":clock12: " +            "Uptime: " + uptime)
          message.channel.send({embed});
      }
      if(command === "rainbow") {
          if(!message.member.hasPermission("ADMINISTRATOR")) {
              const embed = new Discord.RichEmbed()
              .setAuthor("Rainbow", client.user.avatarURL)
              .setColor(0xF44336)
              .setDescription("You must have the administrator permission!")
              message.channel.send({embed});
              return;
          }
  
          if(!message.guild.me.hasPermission("ADMINISTRATOR")) {
              const embed = new Discord.RichEmbed()
              .setAuthor("Rainbow", client.user.avatarURL)
              .setColor(0xF44336)
              .setDescription("I must have the administrator permission!")
              message.channel.send({embed});
              return;
          }
          
          if(!message.member.guild.roles.find("name", args.join(" "))) {
              const embed = new Discord.RichEmbed()
              .setAuthor("Rainbow", client.user.avatarURL)
              .setColor(0xF44336)
              .setDescription("Usage: **`*rainbow (role name)`**")
              message.channel.send({embed});
              return;
          }
  
          if(message.member.guild.roles.find("name", args.join(" ")) === null) {
              const embed = new Discord.RichEmbed()
              .setAuthor("Rainbow", client.user.avatarURL)
              .setColor(0xF44336)
              .setDescription("Something went wrong.")
              message.channel.send({embed});
              return;
          }
  
  
          if(message.member.guild.roles.find("name", args.join(" ")).position >= message.guild.me.highestRole.position) {
              const embed = new Discord.RichEmbed()
              .setAuthor("Rainbow", client.user.avatarURL)
              .setColor(0xF44336)
              .setDescription("My **RainColor** role must be higher than the mentioned role!")
              message.channel.send({embed});
              return;
          }
  
  
          const embed = new Discord.RichEmbed()
          .setAuthor("Rainbow", client.user.avatarURL)
          .setColor(0x4CAF50)
          .setDescription("Successfully applied rainbow colors to **`" + args.join(" ") + "`**" + "\n" +
          "Note: this only lasts 72 hours, then it will stop. You can still apply it whenever you'd like!")
          message.channel.send({embed});
  
          client.colors[message.guild.name] = {
              guild: message.guild.id,
              role: args.join(" "),
              date: new Date().getTime()
          }
  
      }
  });
  
  
  const size    = 12
  const rainbow = new Array(size);
  
  for (var i=0; i<size; i++) {
      var red   = sin_to_hex(i, 0 * Math.PI * 2/3); // 0   deg
      var blue  = sin_to_hex(i, 1 * Math.PI * 2/3); // 120 deg
      var green = sin_to_hex(i, 2 * Math.PI * 2/3); // 240 deg
      rainbow[i] = '#'+ red + green + blue;
  }
  function sin_to_hex(i, phase) {
      var sin = Math.sin(Math.PI / size * 2 * i + phase);
      var int = Math.floor(sin * 127) + 128;
      var hex = int.toString(16);
  
      return hex.length === 1 ? '0'+hex : hex;
  }
  let place = 0;
  
  client.login('NDY2MTQwNTEzMTU0NzYwNzE0.DrZ-Cw.zXSVuaWOfZjmJHIjPNEylmTgA4I'); 
  