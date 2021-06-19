import { channeldisplay } from './channeldisplay';

export class broadcastinfo {
  constructor(message?: string, channel?: channeldisplay[]) {
    this.message = message;
    this.channel = channel;
  }
  message: string;
  channel: channeldisplay[];
}
