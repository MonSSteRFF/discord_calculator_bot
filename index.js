const dotenv = require('dotenv');
dotenv.config();

const { connect } = require('./src/connect');
const { Events } = require('discord.js');
const { mintCommands } = require('./src/mintCommands');

const start = async ({ config }) => {
  const client = await connect({ token: config.botToken });

  const commands = await mintCommands({
    client,
    token: config.botToken,
    clientId: config.applicationId,
    guildId: config.guildId,
  });
  console.log(commands);

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: 'There was an error while executing this command!',
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: 'There was an error while executing this command!',
          ephemeral: true,
        });
      }
    }
  });
};

const config = {
  botToken: process.env.BOT_TOKEN,
  applicationId: process.env.APPLICATION_ID,
  publicKey: process.env.PUBLIC_KEY,
  guildId: process.env.GUILD_ID,
};

start({ config })
  .then((data) => {
    if (data !== undefined) {
      console.log(data);
    }
  })
  .catch((e) => {
    if (e !== undefined) {
      console.error(e.message);
    }
  });
