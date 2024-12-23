// @ts-check

"use strict";

const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { GuildMusicQueue } = require("../../../structures/GuildMusicQueue.js");
const { getEnv } = require("../../../util.js");

/** @type {import("../../../type.js").SlashCommand} */
module.exports = {
    data: new SlashCommandBuilder()
        .setName("unshuffle")
        .setDescription("シャッフルされたキューを元に戻します。")
        .setDMPermission(false)
        .toJSON(),
    handler: async interaction => {
        if (!interaction.inCachedGuild()) return;

        const channel = interaction.member.voice.channel;
        if (!channel) {
            const embed = new EmbedBuilder()
                .setTitle(getEnv("ERROR"))
                .setDescription(`\`\`\`先にボイスチャンネルに参加してください。\`\`\``)
                .setColor("#ff0000");
            await interaction.reply({ embeds: [embed] });
            return;
        }

        const queue = GuildMusicQueue.get(channel.guildId);
        if (!queue) {
            const embed = new EmbedBuilder()
                .setTitle(getEnv("ERROR"))
                .setDescription(`\`\`\`プレイリストが存在しません。\`\`\``)
                .setColor("#ff0000");
            await interaction.reply({ embeds: [embed] });
            return;
        }
        if (queue.voiceChannelId !== channel.id) {
            const embed = new EmbedBuilder()
                .setTitle(getEnv("ERROR"))
                .setDescription(
                    `\`\`\`プレイリストはそのチャンネルに属していません。\n<#${queue.voiceChannelId}>に参加してください。\`\`\``
                )
                .setColor("#ff0000");
            await interaction.reply({ embeds: [embed] });
            return;
        }

        queue.unshuffle();
        await interaction.reply(getEnv("SUCCESS"));
    }
};
