import { Client, Embed, EmbedBuilder, GuildMember, PartialGuildMember, TextChannel } from "discord.js";

const { monitor_channel_id } = require('./../config/config.json');


export async function monitor_member(client: Client, old_member: GuildMember | PartialGuildMember, new_member: GuildMember | PartialGuildMember) {
    const channel = client.channels.cache.get(monitor_channel_id) as TextChannel;

    if (!channel) return;

    const embed = new EmbedBuilder()
        .setColor('Random')
        .setAuthor({
            name: new_member.user.tag,
            iconURL: new_member.user.displayAvatarURL()
        })
        .setTimestamp();

    let change_detected = false;

    // 1. UserName Change
    if (old_member.displayName !== new_member.displayName) {
        embed.setTitle('Display Name Changed').addFields({
            name: 'Old Display Name',
            value: old_member.displayName,
            inline: true
        },{
            name: 'New Display Name',
            value: new_member.displayName,
            inline: true
        });

        change_detected = true;
            
    }

    // 2. Avatar Change
    if (old_member.user.avatar !== new_member.user.avatar) {
        embed.setTitle('Profile Picture Changed').setImage(new_member.user.displayAvatarURL({ size: 512 }));

        change_detected = true;
    }

    // 3. Avatar Decoration Change
    if (old_member.user.avatarDecoration !== new_member.user.avatarDecoration) {
        embed.setTitle('Profile Picture Decoration Changed').setImage(new_member.user.avatarDecorationURL());

        change_detected = true;
    }

    // 4. Role Changes
    const old_roles = old_member.roles.cache;
    const new_roles = new_member.roles.cache;
    const added_roles = new_roles.filter(role => !old_roles.has(role.id));
    const removed_roles = old_roles.filter(role => !new_roles.has(role.id));

    if (added_roles.size > 0 || removed_roles.size > 0) {
        let role_change_text = '';
        if (added_roles.size > 0) {
            role_change_text += `**Added Roles**: ${added_roles.map(role => role.name).join(', ')}\n`;
        }

        if (removed_roles.size > 0) {
            role_change_text += `**Removed Roles: ${removed_roles.map(role => role.name).join(', ')}\n`;
        }

        embed.setFields({
            name: 'Role Changes',
            value: role_change_text
        });

        change_detected = true;
    }

    // 4. Boosting Status Change
    if (old_member.premiumSince !== new_member.premiumSince) {
        const boosting_status = new_member.premiumSince ? 'Started Boosting' : 'Stopped Boosting';
        embed.addFields({
            name: 'Boosting Status',
            value: boosting_status
        });

        change_detected = true;
    }

    // 5. Timeout Status Change
    if (old_member.communicationDisabledUntilTimestamp !== new_member.communicationDisabledUntilTimestamp) {
        if (new_member.communicationDisabledUntilTimestamp) {
            embed.addFields({
                name: 'Timeout Applied',
                value: `User has been timeout until <t:${Math.floor(new_member.communicationDisabledUntilTimestamp / 1000)}:F>.`
            });
        } else {
            embed.addFields({
                name: 'Timeout Removed',
                value: 'User is no longer timeout.'
            });
        }

        change_detected = true;
    }

    // 6. Membership Screening
    if (old_member.pending !== new_member.pending) {
        const pending_status = new_member.pending ? 'Membership Screening incomplete' : 'Membership Screening complete';
        embed.addFields({
            name: 'Pending Status',
            value: pending_status
        });

        change_detected = true;
    }

    if (change_detected) {
        await channel.send({ embeds: [embed] });
    }
}