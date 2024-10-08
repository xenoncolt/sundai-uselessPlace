import { Client, Events, GatewayIntentBits } from "discord.js";
import "dotenv/config";
import { handle_role_assignment } from "./handler/roleAssign";
import { monitor_member } from "./handler/monitorMember";


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

// role add
client.on(Events.MessageCreate, async (msg) => {
    if (msg.author.bot) return;

    if (msg.mentions.has(client.user!) && (msg.content.replace(/<@!?[0-9]+>/, '') === '')) {
        await msg.reply('Did you just mention me?\nSo, Anything you need?');
    }

    await handle_role_assignment(client, msg);
});


// Monitor
client.on(Events.GuildMemberUpdate, async(old_member, new_member) => {
    await monitor_member(client, old_member, new_member);
})


client.login(process.env.TOKEN);