import dotenv from 'dotenv';
import { Client } from 'discord.js';
import * as messages from '../messages/messages.json';
import { ChannelPlayerManager } from './commands/player/ChannelPlayerManager';
import express from 'express';
import { makeInteractionsHandler } from './commands/interactions';
import { commandsCollection, registerSlashCommands } from './commands/commands';
import { initScheduler } from './scheduler/scheduler';
import pkg from '../../package.json';

dotenv.config();

async function initBot(token: string) {
  const bot = new Client({
    intents: [
      'GUILDS',
      'GUILD_VOICE_STATES',
      'GUILD_MESSAGES',
      'GUILD_EMOJIS_AND_STICKERS',
      'GUILD_INTEGRATIONS',
      'GUILD_MESSAGE_TYPING',
    ],
  });

  await bot.login(token);

  return new Promise<Client<true>>(resolve => {
    bot.once('ready', async readyBot => {
      resolve(readyBot);
    });
  });
}

async function main() {
  const botToken = process.env.BOT_TOKEN as string;
  const appId = process.env.APP_ID as string;
  const guildId = process.env.GUILD_ID as string;
  const bot = await initBot(botToken);
  const channelPlayerManager = new ChannelPlayerManager(messages);

  await registerSlashCommands(botToken, appId, guildId);
  initScheduler(bot, messages);

  const app = express();
  const port = process.env.PORT || 3000;

  console.log('Bot is ready!');

  app.get('/', (req, res) => {
    res.json({
      result: true,
      version: pkg.version,
    });
  });

  app.listen(port, () => {
    console.log('Server is running on port ', port);
  });

  bot.on(
    'interactionCreate',
    makeInteractionsHandler({
      ctx: {
        bot,
        messages,
        channelPlayerManager,
      },
      commands: commandsCollection,
    })
  );
}

main().catch(console.error);
