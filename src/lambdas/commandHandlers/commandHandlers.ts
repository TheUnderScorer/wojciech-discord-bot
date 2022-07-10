import { CommandHandler, Commands } from '../../server/commands/command.types';
import { kolegoHandler } from './kolego/kolego.handler';
import { coTamHandler } from './coTam/coTam.handler';

export const commandHandlers: Record<Commands, CommandHandler> = {
  [Commands.Kolego]: kolegoHandler,
  [Commands.CoTam]: coTamHandler,
};
