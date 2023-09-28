import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AsyncLoggerProvider } from '../src/async-logger-provider.interface';
import { MessageDispatcherInterceptor } from '../src/message-dispatcher.interceptor';
import { Options } from '../src/options.dto';
import { MessageDispatcherTestController } from './mocks/message-dispatcher-test.controller';
import {
  ActionEnum,
  ActionVerbEnum,
  MsgActionEnum,
  MsgObjectEnum,
  ObjectEnum,
  ServiceEnum,
  MutationMessage,
} from '@fagbokforlaget/edtech-interfaces';

describe('Message Dispatcher', () => {
  let app: INestApplication;
  let transport: AsyncLoggerProvider;
  const subject = 'mutation.test';
  const serviceId = 'test.service.id';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [MessageDispatcherTestController],
      providers: [
        MessageDispatcherInterceptor,
        {
          provide: AsyncLoggerProvider,
          useValue: { log: jest.fn() },
        },
        {
          provide: Options,
          useValue: <Options>{
            subject,
            messageData: <Partial<MutationMessage<Record<string, unknown>>>>{
              service: {
                type: ServiceEnum.App,
                id: serviceId,
              },
              action: {
                type: MsgActionEnum.Object,
              },
              object: {
                type: MsgObjectEnum.ErudioNamespace,
              },
            },
          },
        },
      ],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();

    transport = app.get<AsyncLoggerProvider>(AsyncLoggerProvider);
  });

  describe('interceptor', () => {
    beforeEach(async () => {
      jest.spyOn(transport, 'log');
    });

    describe('for existing object', () => {
      const id = '123-test';
      it('should create and send message', async () => {
        const res = await request(app.getHttpServer())
          .get(`/test/${id}`)
          .expect(200);
        expect(res.text).toEqual(JSON.stringify({ id: id }));
        expect(transport.log).toHaveBeenCalledTimes(1);
        expect(transport.log).toHaveBeenCalledWith(subject, {
          action: {
            type: ActionEnum.Object,
            verb: ActionVerbEnum.CREATED,
          },
          object: {
            id,
            type: ObjectEnum.ErudioNamespace,
          },
          payload: { id },
          service: {
            id: serviceId,
            type: ServiceEnum.App,
          },
          timestamp: expect.anything(),
        });
      });
    });

    describe('for nonexisting data object', () => {
      it('should not create nor send a message on nonexistant id', async () => {
        const res = await request(app.getHttpServer())
          .get(`/test/nodata`)
          .expect(200);

        expect(res.text).toEqual(JSON.stringify({ id: null }));
        expect(transport.log).not.toHaveBeenCalled();
      });

      it('should not create nor send a message on no data', async () => {
        const res = await request(app.getHttpServer())
          .get(`/test/null`)
          .expect(200);

        expect(res.text).toEqual(JSON.stringify({}));
        expect(transport.log).not.toHaveBeenCalled();
      });

      it('should not create nor send a message on undefined', async () => {
        const res = await request(app.getHttpServer())
          .get(`/test/undefined`)
          .expect(200);

        expect(res.text).toEqual('');
        expect(transport.log).not.toHaveBeenCalled();
      });

      it('should send message when no data returned but object is taken from request', async () => {
        const id = '123';
        const res = await request(app.getHttpServer())
          .get(`/test/noreturn/${id}`)
          .expect(204);

        expect(res.text).toEqual('');
        expect(transport.log).toHaveBeenCalledWith(subject, {
          action: {
            type: ActionEnum.Object,
            verb: ActionVerbEnum.DELETED,
          },
          object: {
            id,
            type: ObjectEnum.ErudioNamespace,
          },
          payload: undefined,
          service: {
            id: serviceId,
            type: ServiceEnum.App,
          },
          timestamp: expect.anything(),
        });
      });
    });
  });
});
