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

// Crée un client Discord avec les intents nécessaires
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ]
});

const token = 'Token'; // Remplace par le token de ton bot
const guildId = 'ID'; // Remplace par l'ID de ton serveur

client.once('ready', async () => {
    console.log(`✅ Connecté en tant que ${client.user.tag}`);

    try {
        // Récupération de la guilde (serveur)
        const guild = await client.guilds.fetch(guildId);
        const channels = await guild.channels.fetch();

        for (const [, channel] of channels) {
            if (channel.type === ChannelType.GuildText) {
                console.log(`📂 Traitement du salon : ${channel.name}`);

                // Création du dossier du salon (remplacement des caractères spéciaux)
                const channelDir = path.join(__dirname, 'images', channel.name.replace(/[^a-zA-Z0-9_-]/g, '_'));
                if (!fs.existsSync(channelDir)) {
                    fs.mkdirSync(channelDir, { recursive: true });
                }

                // Récupérer et télécharger les images du salon
                await fetchMessagesAndDownloadFiles(channel, channelDir);
            }
        }

        console.log("✅ Tous les fichiers ont été récupérés !");
    } catch (error) {
        console.error("❌ Erreur :", error);
    } finally {
        client.destroy(); // Déconnecte le bot après exécution
    }
});

async function fetchMessagesAndDownloadFiles(channel, channelDir) {
    let lastMessageId;
    let messages;

    do {
        messages = await channel.messages.fetch({ limit: 100, before: lastMessageId });
        messages.forEach(message => {
            downloadFilesFromMessage(message, channelDir);
        });
        lastMessageId = messages.last()?.id;
    } while (messages.size > 0);
}

async function downloadFilesFromMessage(message, channelDir) {
    message.attachments.forEach(async (attachment) => {
        if (attachment.contentType && attachment.contentType.startsWith('image/')) {
            try {
                const response = await fetch(attachment.url);
                const arrayBuffer = await response.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                const fileName = path.join(channelDir, `${Date.now()}-${attachment.name}`);
                fs.writeFile(fileName, buffer, () => console.log(`📥 Image enregistrée : ${fileName}`));
            } catch (error) {
                console.error(`❌ Erreur de téléchargement de l'image : ${error}`);
            }
        }
    });
}

client.login(token);
