require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

const commands = [
    new SlashCommandBuilder()
        .setName('worklight')
        .setDescription('Turn on your worklight')
        .addStringOption(option =>
            option.setName('Project')
                .setDescription('What are you working on?')
                .setRequired(true)
        )
].map(command => command.toJSON());

// Register slash command on bot startup
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    try {
        const CLIENT_ID = client.user.id;
        const GUILD_ID = '697214274803859487';
        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands }
        );
        console.log('✅ Slash command registered.');
    } catch (err) {
        console.error(err);
    }
});

// Listen for the slash command
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === 'worklight') {
        const project = interaction.options.getString('project');
        console.log(`${interaction.user.username} is working on ${project}`);

        const fs = require('fs');
        const path = './worklight.json';

        const newEntry = {
            user: interaction.user.username,
            project: project,
            timestamp: new Date().toISOString()
        };

        // Load existing data
        let data = [];
        if (fs.existsSync(path)) {
            const raw = fs.readFileSync(path);
            data = JSON.parse(raw);
        }

        // Add new entry (and optionally remove old entries from same user)
        data = data.filter(entry => entry.user !== interaction.user.username);
        data.push(newEntry);

        // Save to file
        fs.writeFileSync(path, JSON.stringify(data, null, 2));

        const { MessageFlags } = require('discord.js');

        await interaction.reply({
            content: `💡 Your worklight is ON for: **${project}**`,
            flags: MessageFlags.Ephemeral
        });


    }
});

client.login(process.env.DISCORD_TOKEN);
require('./server.js');