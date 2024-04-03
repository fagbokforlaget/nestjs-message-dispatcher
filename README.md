<h1> [DEPRECATED] </h1>

# NestJS interceptor for message dispatching

Library to facilitate message creation & sending

# Usecase

`module`

```
Module({
  controllers: [TestController],
  providers: [
    LoggerService,
    MessageDispatcherInterceptor,
    {
      provide: AsyncLoggerProvider,
      useExisting: LoggerService,
    },
    {
      provide: Options,
      useValue: <Options>{
        subject,
        messageData: <Partial<Message>>{
          service: {
            type: MsgServiceType.App,
            id: serviceId,
          },
          action: {
            type: MsgActionType.Object,
          },
          object: {
            type: MsgObjectType.ErudioNamespace,
          },
        },
      },
    },
  ],
}).compile();

```

`controller`

```
@Controller('/test')
export class TestController {
  @MessageEventEmitter({
    objectIdGetter: (request) => request.params.id,
    action: Action.CREATED,
  })
  @Get(':id')
  async test(@Param() params: { id: string }): Promise<{ id: string }> {
    // do some action
    // Message created and event emitted on success calls.
  }
}

```
