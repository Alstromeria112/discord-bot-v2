// @ts-check

const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { getEnv } = require("../../../util.js");

/** @type {import("../../../type.js").SlashCommand} */
module.exports = {
    data: new SlashCommandBuilder().setName("ping").setDescription("Pong!").toJSON(),
    handler: async interaction => {
        const client = interaction.client;
        const embed = new EmbedBuilder()
            .setTitle(`Ping: ${client.ws.ping} ms`)
            .setFooter({ text: getEnv("POWERED"), iconURL: getEnv("ICON_URL") })
            .setColor("#00ffff");
        return interaction.reply({ embeds: [embed] });
    }
};
