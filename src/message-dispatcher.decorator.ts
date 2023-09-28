import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';
import { MessageDispatcherInterceptor } from './message-dispatcher.interceptor';
import { ActionVerbEnum } from '@fagbokforlaget/edtech-interfaces';

export const DispatcherParamsMetadata = 'dispatcher-options';

export interface DispatcherOptions {
  action: ActionVerbEnum;
  objectIdGetter: (req: any, data: any) => string | string[];
}

export const MessageEventEmitter = (params: DispatcherOptions) =>
  applyDecorators(
    SetMetadata(DispatcherParamsMetadata, params),
    UseInterceptors(MessageDispatcherInterceptor),
  );
