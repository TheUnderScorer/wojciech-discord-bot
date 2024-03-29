import { Client } from 'discord.js';
import { isDailyReport, isValidAuthor } from './detect';
import { isMessageFromDate } from '../messages/isMessageFromDate';
import { isTextChannel } from '../utils/channel';

export async function getDailyReportForDay(
  channelId: string,
  targetUserId: string,
  client: Client<true>,
  date = new Date()
) {
  const channel = client.channels.cache.get(channelId);
  const channelMessages = isTextChannel(channel)
    ? await channel.messages
        .fetch({ limit: 100 })
        .then(res => Array.from(res.values()))
    : [];

  return channelMessages.find(
    message =>
      isValidAuthor(message, targetUserId) &&
      isDailyReport(message.content) &&
      isMessageFromDate(message, date)
  );
}
