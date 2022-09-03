export type TimeSpent = TimeSpentChronograph | TimeSpentPlain;

export interface DailyReport {
  // Ex. 143
  day?: number;
  song?: DailyReportSong;
  timeSpentSeconds?: TimeSpent;
  mentalScore?: number;
}

export interface DailyReportSong {
  url?: string;
  name?: string;
}

export interface TimeSpentChronograph {
  netSeconds: number;
  // Brutto
  grossSeconds: number;
}

export interface TimeSpentPlain {
  seconds: number;
}

export function isTimeSpentChronograph(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  time: any
): time is TimeSpentChronograph {
  return (
    typeof time?.netSeconds === 'number' &&
    typeof time?.grossSeconds === 'number'
  );
}

export function isTimeSpentPlain(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  time: any
): time is TimeSpentPlain {
  return typeof time?.seconds === 'number';
}
