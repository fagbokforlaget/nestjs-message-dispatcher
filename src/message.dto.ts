export enum MsgServiceType {
  App = 'urn:forlagshuset:service:app',
  Batch = 'urn:forlagshuset:service:batch',
}

export interface ServiceMsg {
  type: MsgServiceType;
  id: string;
}

export enum MsgActionType {
  IamAuthentication = 'urn:forlagshuset:action:iam:authentication',
  IamAuthenticationCallback = 'urn:forlagshuset:action:iam:authentication:callback',
  IamAuthorization = 'urn:forlagshuset:action:iam:authorization',
  IamImpersonation = 'urn:forlagshuset:action:iam:impersonation',
  IamCredential = 'urn:forlagshuset:action:iam:credential',
  IamCredentialRecovery = 'urn:forlagshuset:action:iam:credential:recovery',
  IamUser = 'urn:forlagshuset:action:iam:user',
  IamInstitution = 'urn:forlagshuset:action:iam:institution',
  IamRole = 'urn:forlagshuset:action:iam:role',
  Object = 'urn:forlagshuset:action:object',
}

export interface ActionMsg {
  type: MsgActionType;
  verb: string;
}

export enum MsgObjectType {
  AzureadUser = 'urn:forlagshuset:object:azuread:user',
  DbokBook = 'urn:forlagshuset:object:dbok:book',
  DpmBook = 'urn:forlagshuset:object:dpm:book',
  DpmUser = 'urn:forlagshuset:object:dpm:user',
  EportalGroup = 'urn:forlagshuset:object:eportal:group',
  EportalProduct = 'urn:forlagshuset:object:eportal:product',
  EportalUser = 'urn:forlagshuset:object:eportal:user',
  ErudioActivityData = 'urn:forlagshuset:object:erudio:activity-data',
  ErudioAsset = 'urn:forlagshuset:object:erudio:asset',
  ErudioContent = 'urn:forlagshuset:object:erudio:content',
  ErudioLearningPath = 'urn:forlagshuset:object:erudio:learning-path',
  ErudioLearningPathElement = 'urn:forlagshuset:object:erudio:learning-path-element',
  ErudioLocalization = 'urn:forlagshuset:object:erudio:localization',
  ErudioNamespace = 'urn:forlagshuset:object:erudio:namespace',
  ErudioStructure = 'urn:forlagshuset:object:erudio:structure',
  ErudioTagData = 'urn:forlagshuset:object:erudio:tag-store',
  ErudioUserAsset = 'urn:forlagshuset:object:erudio:user-asset',
  FacebookUser = 'urn:forlagshuset:object:facebook:user',
  FeideUser = 'urn:forlagshuset:object:feide:user',
  PortfolioCourse = 'urn:forlagshuset:object:portfolio:course',
  PortfolioGroup = 'urn:forlagshuset:object:portfolio:group',
  PortfolioUser = 'urn:forlagshuset:object:portfolio:user',
  ErudioRoleAssignment = 'urn:forlagshuset:object:erudio:role-assignment',
}

export interface ObjectMsg {
  type: MsgObjectType;
  id: string;
}

export interface Message {
  service: ServiceMsg;
  action: ActionMsg;
  object: ObjectMsg;
  payload: Record<string, unknown>;
  timestamp: string;
}
