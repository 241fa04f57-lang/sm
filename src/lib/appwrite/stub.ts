/* eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/no-unused-vars */
// Safe local stub for Appwrite to eliminate cross-fetch browser conflicts

export namespace Models {
  export interface Document {
    $id: string;
    $collectionId: string;
    $databaseId: string;
    $createdAt: string;
    $updatedAt: string;
    $permissions: string[];
    [key: string]: any;
  }

  export interface User<T = any> {
    $id: string;
    $createdAt: string;
    $updatedAt: string;
    name: string;
    email: string;
    phone: string;
    status: boolean;
    labels: string[];
    passwordUpdate: string;
    emailVerification: boolean;
    phoneVerification: boolean;
    prefs: T;
    [key: string]: any;
  }

  export interface Session {
    $id: string;
    $createdAt: string;
    userId: string;
    expire: string;
    provider: string;
    providerUid: string;
    providerAccessToken: string;
    providerAccessTokenExpiry: string;
    providerRefreshToken: string;
    ip: string;
    osCode: string;
    osName: string;
    osVersion: string;
    clientType: string;
    clientCode: string;
    clientName: string;
    clientVersion: string;
    clientEngine: string;
    clientEngineVersion: string;
    deviceName: string;
    deviceBrand: string;
    deviceModel: string;
    countryCode: string;
    countryName: string;
    current: boolean;
  }

  export interface File {
    $id: string;
    bucketId: string;
    $createdAt: string;
    $updatedAt: string;
    $permissions: string[];
    name: string;
    signature: string;
    mimeType: string;
    sizeOriginal: number;
    chunksTotal: number;
    chunksUploaded: number;
  }

  export interface Preferences {
    [key: string]: any;
  }
}

export const ID = {
  unique: (_length?: number): string =>
    "id_" +
    Math.random().toString(36).substring(2, 9) +
    Date.now().toString(36),
  custom: (id: string): string => id,
};

export const Query = {
  equal: (attribute: string, value: any) => ({
    method: "equal",
    attribute,
    values: [value],
  }),
  notEqual: (attribute: string, value: any) => ({
    method: "notEqual",
    attribute,
    values: [value],
  }),
  lessThan: (attribute: string, value: any) => ({
    method: "lessThan",
    attribute,
    values: [value],
  }),
  lessThanEqual: (attribute: string, value: any) => ({
    method: "lessThanEqual",
    attribute,
    values: [value],
  }),
  greaterThan: (attribute: string, value: any) => ({
    method: "greaterThan",
    attribute,
    values: [value],
  }),
  greaterThanEqual: (attribute: string, value: any) => ({
    method: "greaterThanEqual",
    attribute,
    values: [value],
  }),
  search: (attribute: string, value: string) => ({
    method: "search",
    attribute,
    values: [value],
  }),
  orderDesc: (attribute: string) => ({ method: "orderDesc", attribute }),
  orderAsc: (attribute: string) => ({ method: "orderAsc", attribute }),
  cursorAfter: (documentId: string) => ({
    method: "cursorAfter",
    values: [documentId],
  }),
  cursorBefore: (documentId: string) => ({
    method: "cursorBefore",
    values: [documentId],
  }),
  limit: (limit: number) => ({ method: "limit", values: [limit] }),
  offset: (offset: number) => ({ method: "offset", values: [offset] }),
};

export class Client {
  endpoint = "";
  project = "";
  setEndpoint(endpoint: string) {
    this.endpoint = endpoint;
    return this;
  }
  setProject(project: string) {
    this.project = project;
    return this;
  }
}

export class Account {
  constructor(public client?: any) {}
  async create(..._args: any[]): Promise<any> {
    return { $id: ID.unique() };
  }
  async createEmailSession(..._args: any[]): Promise<any> {
    return { $id: ID.unique() };
  }
  async get(): Promise<any> {
    return null;
  }
  async deleteSession(..._args: any[]): Promise<any> {
    return { status: "ok" };
  }
}

export class Databases {
  constructor(public client?: any) {}
  async listDocuments(..._args: any[]): Promise<any> {
    return { total: 0, documents: [] };
  }
  async getDocument(..._args: any[]): Promise<any> {
    return null;
  }
  async createDocument(..._args: any[]): Promise<any> {
    return null;
  }
  async updateDocument(..._args: any[]): Promise<any> {
    return null;
  }
  async deleteDocument(..._args: any[]): Promise<any> {
    return { status: "ok" };
  }
}

export class Storage {
  constructor(public client?: any) {}
  async createFile(..._args: any[]): Promise<any> {
    return { $id: ID.unique() };
  }
  getFilePreview(..._args: any[]): string {
    return "";
  }
  async deleteFile(..._args: any[]): Promise<any> {
    return { status: "ok" };
  }
}

export class Avatars {
  constructor(public client?: any) {}
  getInitials(name: string): string {
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
      name
    )}`;
  }
}
