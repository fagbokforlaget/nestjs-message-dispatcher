import { Controller, Get, Param } from '@nestjs/common';
import {
  Action,
  MessageEventEmitter,
} from '../../src/message-dispatcher.decorator';

@Controller('/test')
export class MessageDispatcherTestController {
  @MessageEventEmitter({
    objectIdGetter: (request) => request.params.id,
    action: Action.CREATED,
  })
  @Get('/nodata')
  async testNotexistant(): Promise<{ id: null }> {
    return { id: null };
  }

  @MessageEventEmitter({
    objectIdGetter: (request) => request.params.id,
    action: Action.CREATED,
  })
  @Get('/null')
  async testNoData(): Promise<object> {
    return {};
  }

  @MessageEventEmitter({
    objectIdGetter: (request) => request.params.id,
    action: Action.CREATED,
  })
  @Get('/undefined')
  async testNull(): Promise<undefined> {
    return;
  }

  @MessageEventEmitter({
    objectIdGetter: (request) => request.params.id,
    action: Action.CREATED,
  })
  @Get(':id')
  async test(@Param() params: { id: string }): Promise<{ id: string }> {
    return { id: params.id };
  }
}
