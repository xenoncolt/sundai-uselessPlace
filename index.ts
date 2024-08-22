import { Client, Events, GatewayIntentBits } from "discord.js";
import "dotenv/config";

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

    let statusIndex = 0;
    setInterval(() => {
        const sts = [
            { name: `custom`, type: 4, state: `🧐 Watching you all the time` },
            { name: `custom`, type: 4, state: `🙁 Pray for the Flood people` },
            { name: `custom`, type: 4, state: `🏂 Winter is coming` }
        ];
        client.user?.setPresence({
            activities: [sts[statusIndex]],
            status: 'dnd'
        });

        statusIndex = (statusIndex + 1) % sts.length;
    }, 60 * 1000 );
});

client.on(Events.MessageCreate, async (msg) => {
    if (msg.mentions.has(client.user!) && !msg.author.bot && (msg.content === null)) {
        await msg.reply('Did you just mention me?\nSo, Anything you need?');
    }
});


client.on(Events.MessageCreate, async (msg) => {
    if (msg.mentions.has(client.user!) && !msg.author.bot) {
        const usr_msg = msg.content.replace(/<@!?(\d+)>/g, '');

        if(usr_msg === null) return;



        await msg.reply("what? ummm.... ");
    } else if (msg.reference && msg.reference.messageId) {
        const replied_msg = await msg.channel.messages.fetch(msg.reference.messageId);
        if (replied_msg.author.bot) {
            const usr_msg = msg.content;

            if (usr_msg === null ) return;

            await msg.reply("What? ummmm....");
        }
    }
});


client.login(process.env.TOKEN);