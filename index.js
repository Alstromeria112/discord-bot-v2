// @ts-check

"use strict";
Error.stackTraceLimit = Infinity;

const { Client, EmbedBuilder, GatewayIntentBits: IntentBits, Colors } = require("discord.js");
const { slashCommands, messageCommands, reloadCommands } = require("./commands-manager.js");
const { getEnv, sendEmbed } = require("./util.js");
require("dotenv/config.js");

const client = new Client({
    intents: [IntentBits.Guilds, IntentBits.GuildMessages, IntentBits.MessageContent, IntentBits.GuildVoiceStates]
});

client.on("interactionCreate", async interaction => {
    if (interaction.isChatInputCommand() || interaction.isButton()) {
        const commandName = interaction.isChatInputCommand()
            ? interaction.commandName
            : interaction.customId.slice(0, interaction.customId.indexOf("/"));
        const command = slashCommands.get(commandName);
        if (!command) {
            const err_embed = new EmbedBuilder()
                .setTitle(getEnv("ERROR"))
                .setDescription(`Unknown interaction: ${commandName}`)
                .setColor("#ff0000")
                .setFooter({ text: getEnv("POWERED"), iconURL: getEnv("ICON_URL") });
            interaction.reply({ embeds: [err_embed] });
            return;
        }
        try {
            await command.handler(interaction);
            return sendEmbed(interaction);
        } catch (e) {
            const embed = new EmbedBuilder()
                .setTitle(getEnv("ERROR"))
                .setDescription(`\`\`\`${e}\`\`\``)
                .setColor(Colors.Red)
                .setFooter({ text: getEnv("POWERED"), iconURL: getEnv("ICON_URL") });
            await interaction.followUp({ embeds: [embed] });
            console.error(e);
            return;
        }
    }
});

client.on("messageCreate", async message => {
    messageCommands.forEach(async command => {
        const prefix = `${getEnv("PREFIX")}${command.data.name}`;
        if (!message.content.startsWith(prefix)) return;
        if (!(message.content === prefix || message.content.slice(prefix.length).match(/^\s/))) return;
        try {
            await command.handler(message);
        } catch (e) {
            message.reply(`Unknown command: ${command.data.name}`);
        }
    });
});

client.on("voiceStateUpdate", (oldState, newState) => {
    // commands-manager.js がキャッシュを削除する影響により，
    // top level で GuildMusicQueue.js を require してはいけない。
    const { GuildMusicQueue } = require("./structures/GuildMusicQueue.js");

    if (oldState.channelId && !newState.channelId && oldState.id === client.user?.id) {
        GuildMusicQueue.get(oldState.guild.id)?.destroy();
    }
});

client.on("ready", client => {
    console.log(`[ CONSOLE ] <Slash> ${slashCommands.map(command => command.data.name).join(", ")} is loaded`);
    console.log(`[ CONSOLE ] <Text> ${messageCommands.map(command => command.data.name).join(", ")} is loaded`);
    console.log(`[ CONSOLE ] Logged in as ${client.user.tag}`);
});

~(async function () {
    await reloadCommands();

    client.login(getEnv("TOKEN"));
})();
