/* eslint-disable @typescript-eslint/no-explicit-any */
import { createDailyReportReminder } from './dailyReportReminder';
import { messages } from '../../../../messages/messages';

const targetUserId = '#targetUserId';
const channelId = '#channelId';
const message = '{{MENTION}} kolego, ale pami臋taj o daily raporcie dzisiaj';

const createMockMessage = (date: Date) => ({
  createdAt: date,
  content:
    '馃弸[DZIE艃 6] - 16.04.2022r.\nCzas sp臋dzony na IT: 1h\nCo zosta艂o zrobione:\n- odnalaz艂em m贸j tutorialowy projekt z CSS i przejrza艂em\n- kilka zada艅 na Sololearn\n- kilka fiszek na AnkiDroid\n\nPrzemy艣lenia:\n- og贸艂em jeszcze badam teren, pr贸buj臋 po trochu r贸偶nych metod, 偶eby znale藕膰 optymalne dla siebie podej艣cie\n- na razie podchodz臋 do tego troch臋 jak pies do je偶a, czuj臋 potrzeb臋 wielu wi臋cej godzin i wi臋kszej koncentracji, ale na razie 艣wi臋ta troch臋 mnie rozpraszaj膮\n- przyda艂by si臋 ten tutorial gitowy od Przemka\n- og贸艂em mam pewn膮 wizj臋 utworzenia projektu sk艂adaj膮cego si臋 z wielu malutkich podprojekt贸w, tylko chcia艂bym go m膮drze zaprojektowa膰\n\nKr贸tko m贸wi膮c, na razie jestem na etapie konceptualnym. I zwykle w przesz艂o艣ci by艂 on dla mnie najtrudniejszy. Ale najwa偶niejszy.\n\nSONG dnia:\nMike Shinoda - Open Door',
  author: {
    id: targetUserId,
  },
});

const createMockChannel = (messages: any[]) => ({
  isText: () => true,
  send: jest.fn(),
  messages: {
    fetch: jest.fn().mockResolvedValue({
      values: () => messages,
    }),
  },
});

describe('dailyReportReminder', () => {
  it('should send message if daily report is missing', async () => {
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

    const schedule = createDailyReportReminder(
      channelId,
      targetUserId,
      message,
      ''
    );

    const channel = createMockChannel([createMockMessage(yesterday)]);

    const client = {
      channels: {
        cache: {
          get: () => channel,
        },
      },
    };

    await schedule.execute({
      client: client as any,
      date: new Date(),
      messages,
    });

    expect(channel.send).toHaveBeenCalledTimes(1);
    expect(channel.send).toHaveBeenCalledWith(
      '<@#targetUserId> kolego, ale pami臋taj o daily raporcie dzisiaj'
    );
  });

  it('should not send message if daily report is present for today', async () => {
    const today = new Date();

    const schedule = createDailyReportReminder(
      channelId,
      targetUserId,
      message,
      ''
    );

    const channel = createMockChannel([createMockMessage(today)]);

    const client = {
      channels: {
        cache: {
          get: () => channel,
        },
      },
    };

    await schedule.execute({
      client: client as any,
      date: new Date(),
      messages,
    });

    expect(channel.send).toHaveBeenCalledTimes(0);
  });
});
