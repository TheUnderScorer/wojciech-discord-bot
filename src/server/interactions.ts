import type { Collection, Interaction } from 'discord.js';
import {
  CommandDefinition,
  CommandHandlerContext,
} from '../lambdas/command.types';

interface Dependencies {
  ctx: CommandHandlerContext;
  commands: Collection<string, CommandDefinition>;
}

export const makeInteractionsHandler =
  ({ ctx, commands }: Dependencies) =>
  async (interaction: Interaction) => {
    if (!interaction.isCommand()) {
      return;
    }

    const handler = commands.get(interaction.commandName);

    if (handler) {
      await handler.execute(interaction, ctx);
    }
  };
