const { Client, GatewayIntentBits, Events } = require('discord.js');

const delay = (ms) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });

const connect = async ({ token }) => {
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });

  client.once(Events.ClientReady, (c) => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
  });

  await client.login(token);

  await delay(500);

  console.log('bot successfully connect to discord');

  return client;
};

module.exports = { connect };
