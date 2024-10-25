import type {
    Awaitable,
    ChatInputCommandInteraction,
    Collection,
    Message,
    RESTPostAPIChatInputApplicationCommandsJSONBody
} from "discord.js";

export type reloadAnyTypeCommandsFunctionType = <T extends { data: { name: string } }>(commandDirPath: string, commandsCollection: Collection<string, T>) => void;

export type SlashCommand = {
    data: RESTPostAPIChatInputApplicationCommandsJSONBody;
    handler: (interaction: ChatInputCommandInteraction) => Awaitable<void>;
};

export type MessageCommand = {
    data: {
        name: string;
    };
    handler: (message: Message) => Awaitable<void>;
};
