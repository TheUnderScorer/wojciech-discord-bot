import {
  RESTGetAPIChannelMessagesResult,
  RESTPostAPIApplicationCommandsJSONBody,
  RESTPostAPIApplicationGuildCommandsJSONBody,
  RESTPostAPIApplicationGuildCommandsResult,
  RESTPostAPIApplicationCommandsResult,
  RESTPostAPIChannelMessageJSONBody,
  RESTPostAPIChannelMessageResult,
  Routes,
} from 'discord-api-types/v10';
import axios, { AxiosInstance } from 'axios';

export class DiscordClient {
  private static baseUrl = 'https://discord.com/api/v10';

  constructor(
    token: string,
    protected httpClient: AxiosInstance = axios.create({
      baseURL: DiscordClient.baseUrl,
      headers: {
        Authorization: `Bot ${token}`,
      },
    })
  ) {}

  async getChannelMessages(channelId: string) {
    return await this.httpClient.get<RESTGetAPIChannelMessagesResult>(
      Routes.channelMessages(channelId)
    );
  }

  async sendMessageToChannel(
    channelId: string,
    body: RESTPostAPIChannelMessageJSONBody
  ) {
    return this.httpClient.post<RESTPostAPIChannelMessageResult>(
      Routes.channelMessages(channelId),
      body
    );
  }

  async registerGuildCommands(
    appId: string,
    guildId: string,
    body: RESTPostAPIApplicationGuildCommandsJSONBody[]
  ) {
    return Promise.all(
      body.map(command =>
        this.httpClient.post<RESTPostAPIApplicationGuildCommandsResult>(
          Routes.applicationGuildCommands(appId, guildId),
          command
        )
      )
    );
  }

  async deleteCommand(appId: string, commandId: string) {
    return this.httpClient.delete(Routes.applicationCommand(appId, commandId));
  }

  async listCommands(appId: string) {
    return this.httpClient.get(Routes.applicationCommands(appId));
  }

  async registerCommands(
    appId: string,
    body: RESTPostAPIApplicationCommandsJSONBody[]
  ) {
    return Promise.all(
      body.map(command =>
        this.httpClient.post<RESTPostAPIApplicationCommandsResult>(
          Routes.applicationCommands(appId),
          command
        )
      )
    );
  }
}
