import { Controller, Get, HttpCode, Param, Req } from '@nestjs/common';
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
    objectIdGetter: (request) => request.obj,
    action: Action.DELETED,
  })
  @Get('/noreturn/:id')
  @HttpCode(204)
  async testNoReturn(
    @Param() params: { id: string },
    @Req() req: any,
  ): Promise<void> {
    req.obj = params.id;
  }

  @MessageEventEmitter({
    objectIdGetter: (request) => request.params.id,
    action: (request) => request.action as Action,
  })
  @Get('dynamic-action/:id/')
  async testWithDynamicAction(
    @Param() params: { id: string },
    @Req() req,
  ): Promise<{ id: string }> {
    req.action = Action.UPDATED;
    return { id: params.id };
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
