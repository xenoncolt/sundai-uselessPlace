import { Client, Events, GatewayIntentBits } from "discord.js";
import "dotenv/config";
import { generateAIResponse } from "./handler/ai-sys";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ]
});

client.once("ready", async () => {
    console.log(`${client.user?.tag} Bot is ready!`);

    // let statusIndex = 0;
    // setInterval(() => {
    //     const sts = [
    //         {
                
    //         }
    //     ]
    // })
})

client.on(Events.MessageCreate, async (msg) => {
    if (msg.mentions.has(client.user!) && !msg.author.bot && (msg.content === null)) {
        await msg.reply('Yo, Did you just mention me?\nSo, Anything you need?');
    }
});


client.on(Events.MessageCreate, async (msg) => {
    if (msg.mentions.has(client.user!) && !msg.author.bot) {
        const usr_msg = msg.content.replace(/<@!?(\d+)>/g, '');

        if(usr_msg === null) return;

        const ai_response = await generateAIResponse(usr_msg);

        await msg.reply(ai_response);
    } else if (msg.reference && msg.reference.messageId) {
        const replied_msg = await msg.channel.messages.fetch(msg.reference.messageId);
        if (replied_msg.author.bot) {
            const usr_msg = msg.content;

            if (usr_msg === null ) return;

            const ai_response = await generateAIResponse(usr_msg);

            await msg.reply(ai_response);
        }
    }
});


client.login(process.env.TOKEN);