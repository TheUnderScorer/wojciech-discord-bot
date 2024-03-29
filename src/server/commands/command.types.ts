import type { Client, CommandInteraction } from 'discord.js';
import type { Messages } from '../../messages/messages';
import type {
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from '@discordjs/builders';
import { ChannelPlayerManager } from './player/ChannelPlayerManager';
import { OpenAIApi } from 'openai';

export enum Commands {
  Kolego = 'kolego',
  Dj = 'dj',
}

export enum KolegoSubcommand {
  Question = 'pytanie',
  Insult = 'obraź',
  CoTam = 'cotam',
  Player = 'dj',
  Pogadajmy = 'pogadajmy',
}

export enum KolegoQuestionOptions {
  Question = 'pytanie',
}

export enum KolegoInsultOptions {
  User = 'użytkownik',
}

export interface CommandHandlerResult {
  content: string;
}

export interface CommandHandlerContext {
  bot: Client<true>;
  messages: Messages;
  channelPlayerManager: ChannelPlayerManager;
  openAiClient: OpenAIApi;
}

export type CommandHandler = (
  interaction: CommandInteraction,
  context: CommandHandlerContext
) => Promise<void>;

export interface CommandDefinition {
  data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
  execute: CommandHandler;
}
