import {
  ActionType,
  ObjectType,
  ServiceType,
} from '@fagbokforlaget/edtech-interfaces';

export interface ServiceMsg {
  type: ServiceType;
  id: string;
}

export interface ActionMsg {
  type: ActionType;
  verb: string;
}

export interface ObjectMsg {
  type: ObjectType;
  id: string;
}

export interface Message {
  service: ServiceMsg;
  action: ActionMsg;
  object: ObjectMsg;
  payload: Record<string, unknown>;
  timestamp: string;
}
