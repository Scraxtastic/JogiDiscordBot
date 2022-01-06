import * as Discord from 'discord.js';

export interface IDiscordClient {
    client: Discord.Client;
    onReady: (callback: () => Promise<void>) => void;
    onMessage: (callback: (msgCtx: any) => Promise<void>) => void;
    sendMessage: (guildId: string, channelId: string, message: string) => Promise<Boolean>;
    sendEmbeds: (guildId: string, channelId: string, embeds: Discord.MessageEmbed[]) => Promise<Boolean>;
    editOrSendEmbeds: (guildId: string, channelId: string, embeds: Discord.MessageEmbed[], messageId?: string) => Promise<Discord.Message<boolean>>;
    editMessage: (guildId: string, channelId: string, messageId: string, updatedMessage: string) => Promise<Discord.Message<boolean>>;
    getChannel: (guildId: string, channelId: string) => Promise<Discord.TextChannel | Discord.VoiceChannel | Discord.CategoryChannel | Discord.NewsChannel | Discord.StoreChannel | Discord.StageChannel>;
    getLastMessage: (guildId: string, channelId: string) => Promise<Discord.Message<boolean>>;
    createChannel: (guildId: string, categoryId: string, channelName: string) => Promise<Discord.TextChannel>;
    clearChannel: (guildId: string, channelId: string) => Promise<void>;
    clearChannelSync: (guildId: string, channelId: string) => Promise<void>;
    clearChannelSyncExceptOf: (guildId: string, channelId: string, productMessageId: string) => Promise<void>;
}

export const DiscordClient = async (client_token: string) => {
    const client = new Discord.Client({
        intents: ['GUILDS', 'GUILD_MESSAGES', 'DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS'],
    }); //create new client
    const init = async () => {
        await client.login(client_token);
    };

    const onReady = (callback: () => Promise<void>) => {
        client.on('ready', callback);
    };

    const onMessage = (callback: (msgCtx: any) => Promise<void>) => {
        client.on('messageCreate', callback);
    };

    const sendMessage = async (guildId: string, channelId: string, message: string): Promise<Boolean> => {
        const channel = await getChannel(guildId, channelId);
        if (!(channel instanceof Discord.TextChannel)) {
            return false;
        }
        const textchannel = channel as Discord.TextChannel;
        const sentMessage = await textchannel.send(message);
        return !!sentMessage;
    };

    const sendEmbeds = async (guildId: string, channelId: string, embeds: Discord.MessageEmbed[]): Promise<Boolean> => {
        const channel = await getChannel(guildId, channelId);
        if (!(channel instanceof Discord.TextChannel)) {
            return false;
        }
        const textchannel = channel as Discord.TextChannel;
        const sentMessage = await textchannel.send({ embeds });
        return !!sentMessage;
    };

    const editOrSendEmbeds = async (guildId: string, channelId: string, embeds: Discord.MessageEmbed[], messageId?: string): Promise<Discord.Message<boolean>> => {
        const channel = await getChannel(guildId, channelId);
        if (!(channel instanceof Discord.TextChannel)) {
            return null;
        }
        const textchannel = channel as Discord.TextChannel;
        if (messageId) {
            const msg = await textchannel.messages.fetch(messageId);
            return await msg.edit({embeds});
        } else {
            return await textchannel.send({ embeds });
        }
    };

    const editMessage = async (guildId: string, channelId: string, messageId: string, updatedMessage: string) => {
        const channel: Discord.TextChannel = (await (await client.guilds.fetch(guildId)).channels.fetch(channelId)) as Discord.TextChannel;
        const message = await channel.messages.fetch({
            around: messageId,
            limit: 1,
        });
        return await message.at(0).edit(updatedMessage);
    };

    const getChannel = async (guildId: string, channelId: string) => {
        return await (await client.guilds.fetch(guildId)).channels.fetch(channelId);
    };

    const getLastMessage = async (guildId: string, channelId: string) => {
        const channel: Discord.TextChannel = (await (await client.guilds.fetch(guildId)).channels.fetch(channelId)) as Discord.TextChannel;
        return (await channel.messages.fetch({ limit: 1 })).at(0);
    };

    const createChannel = async (guildId: string, categoryId: string, channelName: string) => {
        const guild = await client.guilds.fetch(guildId);
        const categoryChannel = (await client.channels.fetch(categoryId)) as Discord.CategoryChannel;
        ('Obtainment Suggestions');
        return guild.channels.create(channelName, {
            type: 'GUILD_TEXT',
            parent: categoryChannel,
        });
    };

    const clearChannel = async (guildId: string, channelId: string) => {
        const channel: Discord.TextChannel = (await (await client.guilds.fetch(guildId)).channels.fetch(channelId)) as Discord.TextChannel;
        const messages = await channel.messages.fetch({ limit: 100 });
        messages.forEach((currentMsg: Discord.Message<boolean>) => {
            currentMsg.delete();
        });
    };

    const clearChannelSync = async (guildId: string, channelId: string) => {
        const channel: Discord.TextChannel = (await (await client.guilds.fetch(guildId)).channels.fetch(channelId)) as Discord.TextChannel;
        const messages = await channel.messages.fetch({ limit: 100 });
        messages.map((currentMsg: Discord.Message<boolean>) => {
            return currentMsg.delete();
        });
        //Waiting for the deletion of all messages.
        await Promise.allSettled(messages);
    };

    const clearChannelSyncExceptOf = async (guildId: string, channelId: string, productMessageId: string) => {
        const channel: Discord.TextChannel = (await (await client.guilds.fetch(guildId)).channels.fetch(channelId)) as Discord.TextChannel;
        const messages = await channel.messages.fetch({ limit: 100 });
        messages.map((currentMsg: Discord.Message<boolean>) => {
            if (currentMsg.id == productMessageId) return null;
            return currentMsg.delete();
        });
        //Waiting for the deletion of all messages.
        await Promise.allSettled(messages);
    };

    await init();
    const self: IDiscordClient = {
        client,
        onReady,
        onMessage,
        sendMessage,
        sendEmbeds,
        editOrSendEmbeds,
        editMessage,
        getChannel,
        getLastMessage,
        createChannel,
        clearChannel,
        clearChannelSync,
        clearChannelSyncExceptOf,
    };
    return self;
};
