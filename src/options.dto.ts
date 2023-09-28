import { MutationMessage } from '@fagbokforlaget/edtech-interfaces';

export class Options {
  subject: string;
  messageData: MutationMessage<Record<string, unknown>>;
}
