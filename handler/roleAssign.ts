import { Client, GuildMember, Message } from "discord.js";

interface role_assignment{
    users: GuildMember[];
    originalMessage: Message;
}

const role_assignment: Map<string, role_assignment> = new Map();

export async function handle_role_assignment(client: Client, msg: Message) {
    if (!msg.author.bot && msg.mentions.has(client.user!) && msg.content.toLowerCase().includes('give') && msg.content.toLowerCase().includes('role')) {
        const mentioned_users = msg.mentions.members;
        const mentioned_role = msg.mentions.roles;


        if (mentioned_users && mentioned_role.size === 1) {
            const role_to_give = mentioned_role.first();

            let reply_msg = `Give the role ${role_to_give} to`;

            mentioned_users.forEach(async (member: GuildMember) => {
                try {
                    await member.roles.add(role_to_give!);
                    reply_msg += ` **${member.displayName}**`;
                } catch (error) {
                    console.error(`Failed to assign role to ${member.displayName}`, error);
                    reply_msg = `Couldn't give the role to ${member.displayName}`;
                }
                msg.reply(reply_msg);
            });
        } else if (mentioned_role.size !== 1) {
            if (mentioned_users!.size > 0) {
                role_assignment.set(msg.author.id, {
                    users: [...mentioned_users!.values()],
                    originalMessage: msg,
                });
                msg.reply(`Bro... At least mention one role..`);
            } else {
                msg.reply(`Bro... At least mention one role..`);
            }
            
        } else {
            msg.reply(`You did not mention any user..`);
        }
    }

    if (msg.reference && msg.reference.messageId) {
        const original_msg_id = msg.reference.messageId;
        const original_msg = await msg.channel.messages.fetch(original_msg_id);

        if (original_msg.author.id === client.user?.id) {
            const context = role_assignment.get(original_msg.mentions.repliedUser!.id || '');
            if (context && msg.mentions.roles.size === 1) {
                const role_to_give = msg.mentions.roles.first();
                const { users } = context;

                let reply_msg = `Give the role ${role_to_give} to`;

                users.forEach(async (member: GuildMember) => {
                    try {
                        await member.roles.add(role_to_give!);
                        reply_msg += ` **${member.displayName}**`
                    } catch (error) {
                        console.error(`Failed to assign role to ${member.displayName}`, error);
                        reply_msg = `Couldn't give the role to ${member.displayName}`;
                    }
                    msg.reply(reply_msg);
                });

                role_assignment.delete(original_msg.mentions.repliedUser!.id || '');
            } else if (context && msg.mentions.roles.size !== 1) {
                msg.reply(`I though u gonna reply with at least one role.. nvm..`);
            }
        }
    }
}