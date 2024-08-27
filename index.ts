import { Client, Events, GatewayIntentBits, GuildMember } from "discord.js";
import "dotenv/config";
import { handle_role_assignment } from "./handler/roleAssign";


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

// Normal mention
client.on(Events.MessageCreate, async (msg) => {
    if (msg.mentions.has(client.user!) && !msg.author.bot && (msg.content === null)) {
        await msg.reply('Did you just mention me?\nSo, Anything you need?');
    }
});

// Role add
client.on('messageCreate', async (msg) => {
    if (msg.author.bot) return;

    await handle_role_assignment(client, msg);
});


client.login(process.env.TOKEN);