import { Client, Account, Databases, Storage, Avatars } from "appwrite";

export const appwriteConfig = {
  url: "",
  projectId: "",
  databaseId: "",
  storageId: "",
  userCollectionId: "",
  postCollectionId: "",
  savesCollectionId: "",
};

export const client = new Client();

// 100% self-contained local engine: no external service or keys required
export const isAppwriteConfigured = false;

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
