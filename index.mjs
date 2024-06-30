// index.mjs
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { Client, GatewayIntentBits, ChannelType } from 'discord.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Configuration des chemins
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Crée un client Discord
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const token = 'TOKEN'; // le token de votre bot
const channelId = 'ID'; // l'ID de votre canal

client.once('ready', async () => {
    console.log(`connecté en tant que ${client.user.tag}!`);

    // Récupération du canal
    const channel = await client.channels.fetch(channelId);

    if (channel.type === ChannelType.GuildText) {
        console.log(`Récupération des messages du canal : ${channel.name}`);
        await fetchMessagesAndDownloadFiles(channel);
    } else {
        console.error(`La chaîne avec ID ${channelId} n'est pas une chaîne de texte.`);
    }
});

client.on('messageCreate', async (message) => {
    if (message.channel.id === channelId && message.attachments.size > 0) {
        downloadFilesFromMessage(message);
    }
});

async function fetchMessagesAndDownloadFiles(channel) {
    let messages;
    let lastMessageId;
    
    do {
        messages = await channel.messages.fetch({ limit: 100, before: lastMessageId });
        messages.forEach(message => {
            downloadFilesFromMessage(message);
        });
        lastMessageId = messages.last()?.id;
    } while (messages.size > 0);
}

async function downloadFilesFromMessage(message) {
    message.attachments.forEach(async (attachment) => {
        if (attachment.contentType && (attachment.contentType.startsWith('image/') || attachment.contentType.startsWith('video/'))) {
            try {
                const response = await fetch(attachment.url);
                const arrayBuffer = await response.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                const filesDir = path.join(__dirname, 'images');
                if (!fs.existsSync(filesDir)) {
                    fs.mkdirSync(filesDir);
                }
                const fileName = path.join(filesDir, `${Date.now()}-${attachment.name}`);
                fs.writeFile(fileName, buffer, () => console.log(`enregistrée : ${fileName}`));
            } catch (error) {
                console.error(`Erreur de téléchargement de l'image : ${error}`);
            }
        }
    });
}

client.login(token);
