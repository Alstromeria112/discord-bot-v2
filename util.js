// @ts-check

"use strict";

const { ButtonInteraction, ChatInputCommandInteraction, ChannelType, EmbedBuilder } = require("discord.js");

/**
 * @param {string} name
 * @returns {string}
 */
function getEnv(name) {
    const value = process.env[name];
    if (typeof value !== "string") {
        console.log(`[ ERROR ] ${name} is not present in \`.env\`. exiting...`);
        process.exit(1);
    }
    return value;
}
exports.getEnv = getEnv;

/**
 * @param {Date | undefined} date
 * @returns {string}
 */
function getDateString(date = new Date()) {
    return (
        `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ` +
        `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    );
}
exports.getDateString = getDateString;

/**
 * @param { ButtonInteraction | ChatInputCommandInteraction } interaction
 */
async function sendEmbed(interaction) {
    let interactionType;
    let commandType;
    if (interaction.isChatInputCommand()) {
        commandType = interaction;
        interactionType = "Chat Input";
    } else if (interaction.isButton()) {
        commandType = interaction.customId;
        interactionType = "Button";
    } else return;

    const guild = await interaction.client.guilds.fetch(getEnv("GUILD_ID"));
    const channel = await guild?.channels.fetch(getEnv("CHANNEL_ID"));

    if (!channel || !interaction.guild) return;
    if (channel.type === ChannelType.GuildText) {
        const embed = new EmbedBuilder()
            .setTitle("Add Request")
            .setAuthor({
                name: interaction.user.tag + ` (${interaction.user.id})`,
                iconURL: interaction.user.displayAvatarURL()
            })
            .addFields(
                {
                    name: "Guild",
                    value: `\`\`\`${interaction.guild.name}\n${interaction.guild.id}\`\`\``,
                    inline: true
                },
                { name: "Type", value: `\`\`\`${interactionType}\`\`\``, inline: true },
                { name: "Command", value: `\`\`\`${commandType}\`\`\``, inline: false }
            )
            .setColor("#0000ff")
            .setFooter({ text: getEnv("POWERED"), iconURL: getEnv("ICON_URL") })
            .setTimestamp();
        return channel.send({ embeds: [embed] });
    }
}
exports.sendEmbed = sendEmbed;
