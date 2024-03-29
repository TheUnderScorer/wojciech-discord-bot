import { BotError } from '../../../shared/errors/BotError';
import { PlayerQueueOptions, PlayerSubcommands } from './player.types';
import { applyTokens } from '../../../shared/tokens';
import { getRandomArrayElement } from '../../../shared/utils/array';
import { CommandDefinition, Commands } from '../command.types';
import { SlashCommandBuilder } from '@discordjs/builders';
import { GuildMember } from 'discord.js';
import { deferredReply } from '../../../shared/utils/interaction';
import { isVoiceChannel } from '../../../shared/utils/channel';

export const playerCommand: CommandDefinition = {
  data: new SlashCommandBuilder()
    .setName(Commands.Dj)
    .setDescription('Pobaw się w DJa!')
    .addSubcommand(subcommand =>
      subcommand
        .setName(PlayerSubcommands.List)
        .setDescription('Pokaż listę utworów')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName(PlayerSubcommands.Next)
        .setDescription('Zagraj następny utwór')
    )
    .addSubcommand(subcommand =>
      subcommand.setName(PlayerSubcommands.Play).setDescription('Zagraj utwór')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName(PlayerSubcommands.Pause)
        .setDescription('Zatrzymaj odtwarzanie')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName(PlayerSubcommands.ClearQueue)
        .setDescription('Wyczyść kolejkę')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName(PlayerSubcommands.Queue)
        .setDescription('Dodaj utwór do kolejki')
        .addStringOption(option =>
          option
            .setName(PlayerQueueOptions.song)
            .setDescription('URL do utworu z youtube')
            .setRequired(true)
        )
    ),
  execute: async (interaction, ctx) => {
    if (!interaction.isChatInputCommand()) {
      return;
    }

    const subcommand = interaction.options.getSubcommand();

    const channel =
      (interaction.member as GuildMember)?.voice?.channel ?? undefined;

    if (!isVoiceChannel(channel)) {
      throw new BotError(ctx.messages.mustBeInVoiceChannel);
    }

    const player = await ctx.channelPlayerManager.getOrCreateChannelPlayer(
      channel
    );

    switch (subcommand) {
      case PlayerSubcommands.Queue: {
        await interaction.deferReply();

        const song = interaction.options.getString(PlayerQueueOptions.song);

        if (song) {
          const { entryIndex, isPlaying } = await player.queue(song);

          if (!isPlaying) {
            const reply =
              entryIndex > 0
                ? applyTokens(
                    getRandomArrayElement(ctx.messages.player.addedToQueue),
                    {
                      INDEX: (entryIndex + 1).toString(),
                    }
                  )
                : ctx.messages.player.addedToQueueAsNext;

            await interaction.editReply(reply);
          } else {
            await interaction.deleteReply();
          }
        }

        break;
      }

      case PlayerSubcommands.Pause:
        await deferredReply(interaction, async () => {
          await player.pause();
        });
        break;

      case PlayerSubcommands.Play:
        await deferredReply(interaction, async () => {
          await player.play();
        });
        break;

      case PlayerSubcommands.Next:
        await deferredReply(interaction, async () => {
          await player.next();
        });

        break;

      case PlayerSubcommands.ClearQueue:
        await player.clearQueue();

        await interaction.reply(ctx.messages.player.clearedQueue);

        break;

      case PlayerSubcommands.List: {
        await interaction.deferReply();

        const songs = player.songQueue;

        if (!songs.length) {
          await interaction.editReply(ctx.messages.player.noMoreSongs);

          return;
        }

        await interaction.editReply({
          content: songs
            .map((song, index) => `${index + 1}. ${song.name}`)
            .join('\n'),
        });

        break;
      }

      default:
        throw new BotError(ctx.messages.unknownCommand);
    }
  },
};
