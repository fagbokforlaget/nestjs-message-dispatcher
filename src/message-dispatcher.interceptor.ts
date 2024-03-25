import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AsyncLoggerProvider } from './async-logger-provider.interface';
import {
  DispatcherOptions,
  DispatcherParamsMetadata,
} from './message-dispatcher.decorator';
import { Options } from './options.dto';

@Injectable()
export class MessageDispatcherInterceptor implements NestInterceptor {
  logger = new Logger(MessageDispatcherInterceptor.name);

  constructor(
    @Inject(AsyncLoggerProvider) private client: AsyncLoggerProvider,
    private options: Options,
    private reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const options = this.reflector.get<DispatcherOptions>(
      DispatcherParamsMetadata,
      context.getHandler(),
    );

    return next.handle().pipe(
      tap(async (data) => {
        const request =
          context.getType() === 'rpc'
            ? context.switchToRpc()
            : context.switchToHttp().getRequest();

        this.options.messageData.action.verb =
          typeof options.action === 'string'
            ? options.action
            : options.action(request, data);

        let ids = options.objectIdGetter(request, data);

        if (!Array.isArray(ids)) {
          ids = [ids];
        }
        for (const id of ids) {
          if (!id) continue;

          this.options.messageData.object.id = id;

          const sendData = {
            ...this.options.messageData,
            payload: data,
            timestamp: timestamp(),
          };

          if (this.options.debug) {
            this.logger.debug(this.options.subject, JSON.stringify(sendData));
          }

          await this.client.log(this.options.subject, sendData);
        }
      }),
    );
  }
}

function timestamp(): string {
  const dates: string[] = new Date().toISOString().split('.');
  const fractionFormat = dates[1].slice(0, -1);
  dates[1] = `${fractionFormat}000Z`;

  return dates.join('.');
}
