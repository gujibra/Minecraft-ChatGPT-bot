const { Client, GatewayIntentBits, EmbedBuilder, PermissionBitField, Permissions } = require('discord.js')
const mineflayer = require('mineflayer')
const { accessToken ,apiReverseProxy ,host , Port, token, username, discordChannelId }= require("./config/config.json")

//abri chatgpt :D

const { ChatGPTUnofficialProxyAPI } = await import('chatgpt')
let ativarprefix = true

let MineBot
const prefix = '.';

const client = new Client({
    intents: [
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.Guilds,
      GatewayIntentBits.MessageContent]
  });



  client.on('ready', ()=>{
    client.user.setActivity('SSN.GG');
    console.log(`Conectado como ${client.user.tag}`)

    MineBot = mineflayer.createBot({
        username: username,
        host: host,
       // port: Port,
        auth: 'offline'

        
 })

  initBot(MineBot)
    
  })

  client.on("messageCreate", (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase();

    //comandos discord
    if (cmd === "ping") {
        message.channel.send('vai se fuder');
        console.log('message:', message.content);
    }
    if (cmd === "say") {
        SendMessage(message.content.slice(5));
    }
    if (cmd === "playerlist") {
      message.channel.send(`${PlayerList().length} Players estão online no momento: ${PlayerList()}`)
  }
    if (cmd === "kill"){
        SendMessage('/kill')
    }
    
    if (cmd === "prefixo"){
        ativarprefix = !ativarprefix
        if(ativarprefix){
            SendMessage('prefixo ativo')
            message.channel.send('## prefixo para conversar comigo ativo! envie sua mensagem com chatgpt no inicio para ser respondido')
        }else{SendMessage('prefixo desativado')
            message.channel.send('## prefixo para conversar comigo desativado')}
    }


    if (cmd === "commands"){
      message.channel.send('Os comandos são ping, say, playerlist, prefixo, kill e commands')
    }

});

client.login(token)

//setup bot Minecraft


const initBot =(bot)=>{
  const discordChannel = client.channels.cache.get(discordChannelId);
  // Logs
  bot.on('kicked', ()=>{
      discordChannel.send('disconect')
      reconect()
  })
  bot.on('end', ()=>{
      discordChannel.send('disconect')
      reconect()
  })
  bot.on('error', (err)=>{
      if(err.code === 'ECONNREFUSED'){
          discordChannel.send(`Failed to connect to ${err.addres}:${err.port}`)
      }
      else{
          discordChannel.send('CRASHEI')
      }
  })
  bot.on('login', ()=>{
      
      discordChannel.send(`${username} entrou em ${host}`)
          
      })

      


      //funções

      
      //essa função so envia mensagens de players
      bot.on('chat', (username, message) => {
          if (username === bot.username || username === "mrrowfication" || username === "3arth4ck2") return
        
          if(message.toLowerCase().startsWith('chatgpt') && ativarprefix){
           InteligenciaGPT(message.slice(7))
           //discordChannel.send(`${username}: ${message}`)
          }
          if(!ativarprefix){
            InteligenciaGPT(message.slice(7))
           discordChannel.send(`${username}: ${message}`)
          }
          else{
            discordChannel.send(`${username}: ${message}`)
          }
        })

        


        //essa envia todas as mensagens
        bot.on('messagestr', (message) => {
          if (message.includes("[+]") || message.includes("[-]")) {
              discordChannel.send(`### ${message.slice(4)}`);
          }
          if(message.includes('diz:')){
              discordChannel.send(`### tell de ${message}`)
          }
          if (message.includes('died') || message.includes('blew up') || message.includes('fell from a high place')|| message.includes('was') || message.includes('by') || message.includes('was by') || message.includes('tried to swim in lava')|| message.includes('while fighting')|| message.includes('tried to swim in lava') || message.includes('went up in flames')){
              discordChannel.send(`### ${message}`)
          }
          else if (message.startsWith("https://")) {
              discordChannel.send(`### Faça login em: [ssn](${message})`);
          } 
      });




      async function InteligenciaGPT(message) {
            const api = new ChatGPTUnofficialProxyAPI({
              accessToken: accessToken,
              apiReverseProxyUrl: apiReverseProxy
            })
        
            const res = await api.sendMessage(`responda essa mensagem com no maximo 250 caracteres: ${message}`)
            console.log(res.text)
            SendMessage(res.text)
            discordChannel.send(`### Chatgpt respondeu: ${res.text}`)
      }
    
      
      

    
}


//funções minecraft


function PlayerList(){
  return Object.keys(MineBot.players)
}

const reconect = () => {
    console.log(`Tentando reconectar ao servidor de Minecraft...`);
    setTimeout(() => initBot(MineBot), 5000);
}

// enviar mensagem sem spam obrigado cherosin coffofin pelo codigo
const cd = 3800;
let lastMsg = 0;


function SendMessage(msg) {
    let sent;
    const currentTime = Date.now();

    if ((currentTime - lastMsg <= cd) && lastMsg != 0) {
        const delay = cd - (currentTime - lastMsg);

        console.log(`cooldown. tentando novamente em ${delay} ms (?)`)
        setTimeout(() => {
            MineBot.chat(msg);
            lastMsg = Date.now();
        }, delay);

        sent = true;

    }
    else {
        MineBot.chat(msg)

        sent = true;
        lastMsg = Date.now();
    }

    return sent;
}