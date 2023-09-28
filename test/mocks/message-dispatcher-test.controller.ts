import { Controller, Get, HttpCode, Param, Req } from '@nestjs/common';
import { MessageEventEmitter } from '../../src/message-dispatcher.decorator';
import { ActionVerbEnum } from '@fagbokforlaget/edtech-interfaces';

@Controller('/test')
export class MessageDispatcherTestController {
  @MessageEventEmitter({
    objectIdGetter: (request) => request.params.id,
    action: ActionVerbEnum.CREATED,
  })
  @Get('/nodata')
  async testNotexistant(): Promise<{ id: null }> {
    return { id: null };
  }

  @MessageEventEmitter({
    objectIdGetter: (request) => request.params.id,
    action: ActionVerbEnum.CREATED,
  })
  @Get('/null')
  async testNoData(): Promise<object> {
    return {};
  }

  @MessageEventEmitter({
    objectIdGetter: (request) => request.params.id,
    action: ActionVerbEnum.CREATED,
  })
  @Get('/undefined')
  async testNull(): Promise<undefined> {
    return;
  }

  @MessageEventEmitter({
    objectIdGetter: (request) => request.obj,
    action: ActionVerbEnum.DELETED,
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
    action: ActionVerbEnum.CREATED,
  })
  @Get(':id')
  async test(@Param() params: { id: string }): Promise<{ id: string }> {
    return { id: params.id };
  }
}
