import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AsyncLoggerProvider } from '../src/async-logger-provider.interface';
import { MessageDispatcherInterceptor } from '../src/message-dispatcher.interceptor';
import {
  Message,
  MsgActionType,
  MsgObjectType,
  MsgServiceType,
} from '../src/message.dto';
import { Options } from '../src/options.dto';
import { MessageDispatcherTestController } from './mocks/message-dispatcher-test.controller';

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
          action: { type: 'urn:forlagshuset:action:object', verb: 'created' },
          object: {
            id,
            type: 'urn:forlagshuset:object:erudio:namespace',
          },
          payload: { id },
          service: {
            id: serviceId,
            type: 'urn:forlagshuset:service:app',
          },
          timestamp: expect.anything(),
        });
      });
    });

    describe('for nonexisting object', () => {
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
    });
  });
});
