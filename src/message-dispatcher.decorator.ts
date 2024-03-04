import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';
import { MessageDispatcherInterceptor } from './message-dispatcher.interceptor';

export enum Action {
  CREATED = 'created',
  UPDATED = 'updated',
  DELETED = 'deleted',
}

export const DispatcherParamsMetadata = 'dispatcher-options';

export interface DispatcherOptions {
  action: ((req: any, data: any) => Action) | string;
  objectIdGetter: (req: any, data: any) => string | string[];
}

export const MessageEventEmitter = (params: DispatcherOptions) =>
  applyDecorators(
    SetMetadata(DispatcherParamsMetadata, params),
    UseInterceptors(MessageDispatcherInterceptor),
  );
