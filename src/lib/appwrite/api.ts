import { ID, Query, Models } from "appwrite";

import {
  appwriteConfig,
  account,
  databases,
  storage,
  avatars,
  isAppwriteConfigured,
} from "./config";
import { IUpdatePost, INewPost, INewUser, IUpdateUser } from "@/types";

// ============================================================
// MOCK DATA STORE & LOCAL STORAGE PERSISTENCE (AI STUDIO)
// ============================================================

interface MockUserDoc extends Record<string, any> {
  $id: string;
  $collectionId: string;
  $databaseId: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  accountId: string;
  name: string;
  username: string;
  email: string;
  imageUrl: string;
  imageId?: string;
  bio: string;
  posts: any[];
  liked: any[];
  save: any[];
}

interface MockPostDoc extends Record<string, any> {
  $id: string;
  $collectionId: string;
  $databaseId: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  creator: any;
  caption: string;
  imageUrl: string;
  imageId: string;
  location: string;
  tags: string[];
  likes: { $id: string }[];
}

const INITIAL_MOCK_USERS: MockUserDoc[] = [
  {
    $id: "user_1",
    $collectionId: "users",
    $databaseId: "main",
    $createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    $updatedAt: new Date().toISOString(),
    $permissions: [],
    accountId: "acc_1",
    name: "Alex Morgan",
    username: "alexmorgan",
    email: "alex@snapgram.com",
    imageUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
    imageId: "img_alex",
    bio: "Photographer & digital artist 📸 | Exploring the world one snapshot at a time 🌿",
    posts: [],
    liked: [],
    save: [],
  },
  {
    $id: "user_2",
    $collectionId: "users",
    $databaseId: "main",
    $createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
    $updatedAt: new Date().toISOString(),
    $permissions: [],
    accountId: "acc_2",
    name: "Sophia Chen",
    username: "sophiac",
    email: "sophia@example.com",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80",
    imageId: "img_sophia",
    bio: "Traveler & coffee enthusiast ☕️ | Exploring hidden alleys and cafes around the globe",
    posts: [],
    liked: [],
    save: [],
  },
  {
    $id: "user_3",
    $collectionId: "users",
    $databaseId: "main",
    $createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    $updatedAt: new Date().toISOString(),
    $permissions: [],
    accountId: "acc_3",
    name: "Marcus Brody",
    username: "marcus_b",
    email: "marcus@example.com",
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    imageId: "img_marcus",
    bio: "Architectural visualizer & minimalist street photographer 🏢",
    posts: [],
    liked: [],
    save: [],
  },
  {
    $id: "user_4",
    $collectionId: "users",
    $databaseId: "main",
    $createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    $updatedAt: new Date().toISOString(),
    $permissions: [],
    accountId: "acc_4",
    name: "Elena Rostova",
    username: "elena_art",
    email: "elena@example.com",
    imageUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80",
    imageId: "img_elena",
    bio: "Visual storyteller, cinematographer, and golden hour lover 🎬🌅",
    posts: [],
    liked: [],
    save: [],
  },
];

const INITIAL_MOCK_POSTS: MockPostDoc[] = [
  {
    $id: "post_1",
    $collectionId: "posts",
    $databaseId: "main",
    $createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    $updatedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    $permissions: [],
    creator: INITIAL_MOCK_USERS[0],
    caption:
      "Golden rays piercing through the Swiss Alps. Woke up at 4:30 AM for this shot and it was absolutely worth every freezing second. 🏔️✨",
    imageUrl:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80",
    imageId: "img_post_1",
    location: "Zermatt, Switzerland",
    tags: ["mountains", "alps", "travel", "nature"],
    likes: [{ $id: "user_2" }, { $id: "user_3" }, { $id: "user_4" }],
  },
  {
    $id: "post_2",
    $collectionId: "posts",
    $databaseId: "main",
    $createdAt: new Date(Date.now() - 8 * 3600000).toISOString(),
    $updatedAt: new Date(Date.now() - 8 * 3600000).toISOString(),
    $permissions: [],
    creator: INITIAL_MOCK_USERS[1],
    caption:
      "Lost in neon reflections after an evening drizzle in Shinjuku. The rhythm of Tokyo never truly sleeps. 🌧️🍣",
    imageUrl:
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&auto=format&fit=crop&q=80",
    imageId: "img_post_2",
    location: "Tokyo, Japan",
    tags: ["tokyo", "cyberpunk", "streetphotography", "citylights"],
    likes: [{ $id: "user_1" }, { $id: "user_3" }],
  },
  {
    $id: "post_3",
    $collectionId: "posts",
    $databaseId: "main",
    $createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    $updatedAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    $permissions: [],
    creator: INITIAL_MOCK_USERS[2],
    caption:
      "Clean lines and organic curves. Scandinavian architecture continually reminds us that simplicity is the ultimate sophistication. 📐",
    imageUrl:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&auto=format&fit=crop&q=80",
    imageId: "img_post_3",
    location: "Copenhagen, Denmark",
    tags: ["architecture", "minimalism", "design", "interior"],
    likes: [{ $id: "user_1" }, { $id: "user_4" }],
  },
  {
    $id: "post_4",
    $collectionId: "posts",
    $databaseId: "main",
    $createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
    $updatedAt: new Date(Date.now() - 48 * 3600000).toISOString(),
    $permissions: [],
    creator: INITIAL_MOCK_USERS[3],
    caption:
      "Pacific coast highway breeze. Sunset shades painting the California coastline in warm amber and violet. 🌊🚗",
    imageUrl:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80",
    imageId: "img_post_4",
    location: "Big Sur, California",
    tags: ["sunset", "pacific", "coast", "roadtrip"],
    likes: [{ $id: "user_1" }, { $id: "user_2" }],
  },
];

// In-memory / localStorage storage helpers
const STORAGE_KEY_POSTS = "snapgram_mock_posts";
const STORAGE_KEY_USERS = "snapgram_mock_users";
const STORAGE_KEY_ACTIVE_USER = "snapgram_active_user_id";

function getStoredUsers(): MockUserDoc[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Failed to read stored users:", e);
  }
  return INITIAL_MOCK_USERS;
}

function saveStoredUsers(users: MockUserDoc[]) {
  try {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  } catch (e) {
    console.warn("Failed to save users:", e);
  }
}

function getStoredPosts(): MockPostDoc[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_POSTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Failed to read stored posts:", e);
  }
  return INITIAL_MOCK_POSTS;
}

function saveStoredPosts(posts: MockPostDoc[]) {
  try {
    localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
  } catch (e) {
    console.warn("Failed to save posts:", e);
  }
}

function getActiveUserId(): string {
  try {
    const id = localStorage.getItem(STORAGE_KEY_ACTIVE_USER);
    if (id) return id;
  } catch (e) {
    console.warn("Failed to read active user:", e);
  }
  return "user_1";
}

function setActiveUserId(id: string) {
  try {
    localStorage.setItem(STORAGE_KEY_ACTIVE_USER, id);
    localStorage.setItem("cookieFallback", JSON.stringify([`session_${id}`]));
  } catch (e) {
    console.warn("Failed to set active user:", e);
  }
}

// In-memory cache for uploaded file data URLs
const fileBlobMap = new Map<string, string>();

function buildFullUser(user: MockUserDoc, posts: MockPostDoc[]): MockUserDoc {
  const userPosts = posts.filter(
    (p) => p.creator?.$id === user.$id || p.creator === user.$id
  );
  const userLikedPosts = posts.filter((p) =>
    p.likes?.some((l) => (typeof l === "string" ? l === user.$id : l?.$id === user.$id))
  );

  return {
    ...user,
    posts: userPosts,
    liked: userLikedPosts,
    save: user.save || [],
  };
}

// ============================================================
// AUTH
// ============================================================

// ============================== SIGN UP
export async function createUserAccount(user: INewUser) {
  if (isAppwriteConfigured) {
    try {
      const newAccount = await account.create(
        ID.unique(),
        user.email,
        user.password,
        user.name
      );

      if (!newAccount) throw Error("Failed to create account");

      const avatarUrl = avatars.getInitials(user.name);

      const newUser = await saveUserToDB({
        accountId: newAccount.$id,
        name: newAccount.name,
        email: newAccount.email,
        username: user.username,
        imageUrl: avatarUrl,
      });

      return newUser;
    } catch (error) {
      console.warn("Appwrite createUserAccount failed, using mock:", error);
    }
  }

  // Fallback Mock Sign Up
  const users = getStoredUsers();
  const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
    user.name
  )}`;
  const newUserId = "user_" + Date.now();
  const newAccountId = "acc_" + Date.now();

  const newUserDoc: MockUserDoc = {
    $id: newUserId,
    $collectionId: "users",
    $databaseId: "main",
    $createdAt: new Date().toISOString(),
    $updatedAt: new Date().toISOString(),
    $permissions: [],
    accountId: newAccountId,
    name: user.name,
    username: user.username || user.email.split("@")[0],
    email: user.email,
    imageUrl: avatarUrl,
    bio: "",
    posts: [],
    liked: [],
    save: [],
  };

  users.push(newUserDoc);
  saveStoredUsers(users);
  setActiveUserId(newUserId);

  return newUserDoc as unknown as Models.Document;
}

// ============================== SAVE USER TO DB
export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: URL | string;
  username?: string;
}) {
  if (isAppwriteConfigured) {
    try {
      const newUser = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        ID.unique(),
        user
      );

      return newUser;
    } catch (error) {
      console.warn("Appwrite saveUserToDB failed, using mock:", error);
    }
  }

  const users = getStoredUsers();
  const existing = users.find((u) => u.accountId === user.accountId);
  if (existing) return existing as unknown as Models.Document;

  const newDoc: MockUserDoc = {
    $id: "user_" + Date.now(),
    $collectionId: "users",
    $databaseId: "main",
    $createdAt: new Date().toISOString(),
    $updatedAt: new Date().toISOString(),
    $permissions: [],
    accountId: user.accountId,
    name: user.name,
    username: user.username || user.email.split("@")[0],
    email: user.email,
    imageUrl: String(user.imageUrl),
    bio: "",
    posts: [],
    liked: [],
    save: [],
  };

  users.push(newDoc);
  saveStoredUsers(users);
  return newDoc as unknown as Models.Document;
}

// ============================== SIGN IN
export async function signInAccount(user: { email: string; password: string }) {
  if (isAppwriteConfigured) {
    try {
      const session = await account.createEmailSession(
        user.email,
        user.password
      );
      return session;
    } catch (error) {
      console.warn("Appwrite signInAccount failed, using mock:", error);
    }
  }

  // Mock Sign In
  const users = getStoredUsers();
  let matched = users.find(
    (u) => u.email.toLowerCase() === user.email.toLowerCase()
  );

  if (!matched) {
    // If not found, use first user or create one on the fly
    matched = users[0];
  }

  if (matched) {
    setActiveUserId(matched.$id);
    return {
      $id: `session_${matched.$id}`,
      userId: matched.$id,
    } as unknown as Models.Session;
  }

  return null;
}

// ============================== GET ACCOUNT
export async function getAccount() {
  if (isAppwriteConfigured) {
    try {
      const currentAccount = await account.get();
      return currentAccount;
    } catch (error) {
      console.warn("Appwrite getAccount failed, using mock:", error);
    }
  }

  const users = getStoredUsers();
  const activeId = getActiveUserId();
  const current = users.find((u) => u.$id === activeId) || users[0];

  return {
    $id: current.accountId,
    name: current.name,
    email: current.email,
  } as unknown as Models.User<Models.Preferences>;
}

// ============================== GET CURRENT USER
export async function getCurrentUser() {
  if (isAppwriteConfigured) {
    try {
      const currentAccount = await getAccount();
      if (currentAccount) {
        const currentUser = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.userCollectionId,
          [Query.equal("accountId", currentAccount.$id)]
        );

        if (currentUser && currentUser.documents.length > 0) {
          return currentUser.documents[0];
        }
      }
    } catch (error) {
      console.warn("Appwrite getCurrentUser failed, using mock:", error);
    }
  }

  // Fallback Mock User
  const users = getStoredUsers();
  const posts = getStoredPosts();
  const activeId = getActiveUserId();
  const user = users.find((u) => u.$id === activeId) || users[0];

  if (!user) return null;
  return buildFullUser(user, posts) as unknown as Models.Document;
}

// ============================== SIGN OUT
export async function signOutAccount() {
  if (isAppwriteConfigured) {
    try {
      const session = await account.deleteSession("current");
      return session;
    } catch (error) {
      console.warn("Appwrite signOutAccount failed, using mock:", error);
    }
  }

  try {
    localStorage.removeItem("cookieFallback");
    localStorage.removeItem(STORAGE_KEY_ACTIVE_USER);
  } catch (e) {
    console.warn("Failed to clear session:", e);
  }

  return { status: "ok" };
}

// ============================================================
// POSTS
// ============================================================

// ============================== CREATE POST
export async function createPost(post: INewPost) {
  if (isAppwriteConfigured) {
    try {
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw Error("File upload failed");

      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error("Failed to get preview URL");
      }

      const tags = post.tags?.replace(/ /g, "").split(",") || [];

      const newPost = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        ID.unique(),
        {
          creator: post.userId,
          caption: post.caption,
          imageUrl: fileUrl,
          imageId: uploadedFile.$id,
          location: post.location,
          tags: tags,
        }
      );

      if (!newPost) {
        await deleteFile(uploadedFile.$id);
        throw Error("Failed to save post");
      }

      return newPost;
    } catch (error) {
      console.warn("Appwrite createPost failed, using mock:", error);
    }
  }

  // Mock Create Post
  const posts = getStoredPosts();
  const users = getStoredUsers();
  const activeUser =
    users.find((u) => u.$id === post.userId) ||
    users.find((u) => u.$id === getActiveUserId()) ||
    users[0];

  let fileUrl =
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80";
  const imageId = "file_" + Date.now();

  if (post.file && post.file[0]) {
    try {
      fileUrl = URL.createObjectURL(post.file[0]);
      fileBlobMap.set(imageId, fileUrl);
    } catch (e) {
      console.warn("Error creating file object URL:", e);
    }
  }

  const tags = post.tags?.replace(/ /g, "").split(",").filter(Boolean) || [];

  const newPostDoc: MockPostDoc = {
    $id: "post_" + Date.now(),
    $collectionId: "posts",
    $databaseId: "main",
    $createdAt: new Date().toISOString(),
    $updatedAt: new Date().toISOString(),
    $permissions: [],
    creator: activeUser,
    caption: post.caption,
    imageUrl: fileUrl,
    imageId: imageId,
    location: post.location || "",
    tags: tags,
    likes: [],
  };

  posts.unshift(newPostDoc);
  saveStoredPosts(posts);

  return newPostDoc as unknown as Models.Document;
}

// ============================== UPLOAD FILE
export async function uploadFile(file: File) {
  const fileId = "file_" + Date.now();
  return new Promise<Models.File>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      fileBlobMap.set(fileId, dataUrl);
      try {
        localStorage.setItem(`snapgram_img_${fileId}`, dataUrl);
      } catch (e) {
        console.warn("LocalStorage image store limit exceeded:", e);
      }
      resolve({ $id: fileId } as unknown as Models.File);
    };
    reader.onerror = () => {
      const fallbackUrl = URL.createObjectURL(file);
      fileBlobMap.set(fileId, fallbackUrl);
      resolve({ $id: fileId } as unknown as Models.File);
    };
    reader.readAsDataURL(file);
  });
}

// ============================== GET FILE URL
export function getFilePreview(fileId: string) {
  if (fileBlobMap.has(fileId)) {
    return fileBlobMap.get(fileId);
  }

  const cached = localStorage.getItem(`snapgram_img_${fileId}`);
  if (cached) {
    fileBlobMap.set(fileId, cached);
    return cached;
  }

  return "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80";
}

// ============================== DELETE FILE
export async function deleteFile(fileId: string) {
  if (isAppwriteConfigured) {
    try {
      await storage.deleteFile(appwriteConfig.storageId, fileId);
      return { status: "ok" };
    } catch (error) {
      console.warn("Appwrite deleteFile failed:", error);
    }
  }

  fileBlobMap.delete(fileId);
  return { status: "ok" };
}

// ============================== SEARCH POSTS
export async function searchPosts(searchTerm: string) {
  if (isAppwriteConfigured) {
    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        [Query.search("caption", searchTerm)]
      );
      if (posts) return posts;
    } catch (error) {
      console.warn("Appwrite searchPosts failed, using mock:", error);
    }
  }

  const posts = getStoredPosts();
  const lower = searchTerm.toLowerCase();
  const matched = posts.filter(
    (p) =>
      p.caption.toLowerCase().includes(lower) ||
      p.location?.toLowerCase().includes(lower) ||
      p.tags?.some((t) => t.toLowerCase().includes(lower))
  );

  return {
    total: matched.length,
    documents: matched as unknown as Models.Document[],
  };
}

// ============================== GET INFINITE POSTS
export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
  if (isAppwriteConfigured) {
    try {
      const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(9)];
      if (pageParam) {
        queries.push(Query.cursorAfter(pageParam.toString()));
      }
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        queries
      );
      if (posts) return posts;
    } catch (error) {
      console.warn("Appwrite getInfinitePosts failed, using mock:", error);
    }
  }

  const posts = getStoredPosts();
  const offset = pageParam ? Number(pageParam) : 0;
  const paged = posts.slice(offset, offset + 9);

  return {
    total: posts.length,
    documents: paged as unknown as Models.Document[],
  };
}

// ============================== GET POST BY ID
export async function getPostById(postId?: string) {
  if (!postId) return undefined;

  if (isAppwriteConfigured) {
    try {
      const post = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        postId
      );
      if (post) return post;
    } catch (error) {
      console.warn("Appwrite getPostById failed, using mock:", error);
    }
  }

  const posts = getStoredPosts();
  const found = posts.find((p) => p.$id === postId);
  if (!found) return undefined;

  return found as unknown as Models.Document;
}

// ============================== UPDATE POST
export async function updatePost(post: IUpdatePost) {
  if (isAppwriteConfigured) {
    try {
      const hasFileToUpdate = post.file.length > 0;
      let image = {
        imageUrl: post.imageUrl,
        imageId: post.imageId,
      };

      if (hasFileToUpdate) {
        const uploadedFile = await uploadFile(post.file[0]);
        if (!uploadedFile) throw Error("Upload failed");

        const fileUrl = getFilePreview(uploadedFile.$id);
        if (!fileUrl) {
          await deleteFile(uploadedFile.$id);
          throw Error("Preview URL failed");
        }

        image = { imageUrl: fileUrl as any, imageId: uploadedFile.$id };
      }

      const tags = post.tags?.replace(/ /g, "").split(",") || [];

      const updatedPost = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        post.postId,
        {
          caption: post.caption,
          imageUrl: image.imageUrl,
          imageId: image.imageId,
          location: post.location,
          tags: tags,
        }
      );

      if (!updatedPost) {
        if (hasFileToUpdate) await deleteFile(image.imageId);
        throw Error("Failed to update post");
      }

      if (hasFileToUpdate && post.imageId) {
        await deleteFile(post.imageId);
      }

      return updatedPost;
    } catch (error) {
      console.warn("Appwrite updatePost failed, using mock:", error);
    }
  }

  // Mock Update Post
  const posts = getStoredPosts();
  const index = posts.findIndex((p) => p.$id === post.postId);
  if (index === -1) return null;

  let imageUrl = String(post.imageUrl);
  let imageId = post.imageId;

  if (post.file && post.file[0]) {
    imageId = "file_" + Date.now();
    try {
      imageUrl = URL.createObjectURL(post.file[0]);
      fileBlobMap.set(imageId, imageUrl);
    } catch (e) {
      console.warn("Failed to create blob url for update:", e);
    }
  }

  const tags = post.tags?.replace(/ /g, "").split(",").filter(Boolean) || [];

  const updated: MockPostDoc = {
    ...posts[index],
    caption: post.caption,
    location: post.location || "",
    tags: tags,
    imageUrl: imageUrl,
    imageId: imageId,
    $updatedAt: new Date().toISOString(),
  };

  posts[index] = updated;
  saveStoredPosts(posts);

  return updated as unknown as Models.Document;
}

// ============================== DELETE POST
export async function deletePost(postId?: string, imageId?: string) {
  if (!postId) return;

  if (isAppwriteConfigured) {
    try {
      const statusCode = await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        postId
      );
      if (imageId) await deleteFile(imageId);
      if (statusCode) return { status: "Ok" };
    } catch (error) {
      console.warn("Appwrite deletePost failed, using mock:", error);
    }
  }

  const posts = getStoredPosts();
  const filtered = posts.filter((p) => p.$id !== postId);
  saveStoredPosts(filtered);

  if (imageId) fileBlobMap.delete(imageId);
  return { status: "Ok" };
}

// ============================== LIKE / UNLIKE POST
export async function likePost(postId: string, likesArray: string[]) {
  if (isAppwriteConfigured) {
    try {
      const updatedPost = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        postId,
        {
          likes: likesArray,
        }
      );
      if (updatedPost) return updatedPost;
    } catch (error) {
      console.warn("Appwrite likePost failed, using mock:", error);
    }
  }

  const posts = getStoredPosts();
  const index = posts.findIndex((p) => p.$id === postId);
  if (index === -1) return null;

  // Format likes so post.likes.map((u) => u.$id) always works
  const formattedLikes = likesArray.map((id) => ({ $id: id }));

  posts[index] = {
    ...posts[index],
    likes: formattedLikes,
    $updatedAt: new Date().toISOString(),
  };

  saveStoredPosts(posts);
  return posts[index] as unknown as Models.Document;
}

// ============================== SAVE POST
export async function savePost(userId: string, postId: string) {
  if (isAppwriteConfigured) {
    try {
      const updatedPost = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.savesCollectionId,
        ID.unique(),
        {
          user: userId,
          post: postId,
        }
      );
      if (updatedPost) return updatedPost;
    } catch (error) {
      console.warn("Appwrite savePost failed, using mock:", error);
    }
  }

  const users = getStoredUsers();
  const posts = getStoredPosts();
  const userIndex = users.findIndex((u) => u.$id === userId);
  const targetPost = posts.find((p) => p.$id === postId);

  if (userIndex !== -1 && targetPost) {
    const saveRecord = {
      $id: "save_" + Date.now(),
      $collectionId: "saves",
      $databaseId: "main",
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
      $permissions: [],
      user: userId,
      post: targetPost,
    };

    const currentSaves = users[userIndex].save || [];
    users[userIndex].save = [...currentSaves, saveRecord];
    saveStoredUsers(users);

    return saveRecord as unknown as Models.Document;
  }

  return null;
}

// ============================== DELETE SAVED POST
export async function deleteSavedPost(savedRecordId: string) {
  if (isAppwriteConfigured) {
    try {
      const statusCode = await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.savesCollectionId,
        savedRecordId
      );
      if (statusCode) return { status: "Ok" };
    } catch (error) {
      console.warn("Appwrite deleteSavedPost failed, using mock:", error);
    }
  }

  const users = getStoredUsers();
  for (const user of users) {
    if (user.save && user.save.some((s: any) => s.$id === savedRecordId)) {
      user.save = user.save.filter((s: any) => s.$id !== savedRecordId);
    }
  }
  saveStoredUsers(users);

  return { status: "Ok" };
}

// ============================== GET USER'S POSTS
export async function getUserPosts(userId?: string) {
  if (!userId) return;

  if (isAppwriteConfigured) {
    try {
      const post = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
      );
      if (post) return post;
    } catch (error) {
      console.warn("Appwrite getUserPosts failed, using mock:", error);
    }
  }

  const posts = getStoredPosts();
  const filtered = posts.filter(
    (p) => p.creator?.$id === userId || p.creator === userId
  );

  return {
    total: filtered.length,
    documents: filtered as unknown as Models.Document[],
  };
}

// ============================== GET POPULAR / RECENT POSTS
export async function getRecentPosts() {
  if (isAppwriteConfigured) {
    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        [Query.orderDesc("$createdAt"), Query.limit(20)]
      );
      if (posts) return posts;
    } catch (error) {
      console.warn("Appwrite getRecentPosts failed, using mock:", error);
    }
  }

  const posts = getStoredPosts();
  return {
    total: posts.length,
    documents: posts.slice(0, 20) as unknown as Models.Document[],
  };
}

// ============================================================
// USERS
// ============================================================

// ============================== GET USERS
export async function getUsers(limit?: number) {
  if (isAppwriteConfigured) {
    try {
      const queries: any[] = [Query.orderDesc("$createdAt")];
      if (limit) queries.push(Query.limit(limit));

      const users = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        queries
      );
      if (users) return users;
    } catch (error) {
      console.warn("Appwrite getUsers failed, using mock:", error);
    }
  }

  const users = getStoredUsers();
  const selected = limit ? users.slice(0, limit) : users;

  return {
    total: selected.length,
    documents: selected as unknown as Models.Document[],
  };
}

// ============================== GET USER BY ID
export async function getUserById(userId: string) {
  if (isAppwriteConfigured) {
    try {
      const user = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        userId
      );
      if (user) return user;
    } catch (error) {
      console.warn("Appwrite getUserById failed, using mock:", error);
    }
  }

  const users = getStoredUsers();
  const posts = getStoredPosts();
  const target = users.find((u) => u.$id === userId);

  if (!target) return null;
  return buildFullUser(target, posts) as unknown as Models.Document;
}

// ============================== UPDATE USER
export async function updateUser(user: IUpdateUser) {
  if (isAppwriteConfigured) {
    try {
      const hasFileToUpdate = user.file.length > 0;
      let image = {
        imageUrl: user.imageUrl,
        imageId: user.imageId,
      };

      if (hasFileToUpdate) {
        const uploadedFile = await uploadFile(user.file[0]);
        if (!uploadedFile) throw Error("File upload failed");

        const fileUrl = getFilePreview(uploadedFile.$id);
        if (!fileUrl) {
          await deleteFile(uploadedFile.$id);
          throw Error("Failed preview url");
        }

        image = { imageUrl: fileUrl as any, imageId: uploadedFile.$id };
      }

      const updatedUser = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        user.userId,
        {
          name: user.name,
          bio: user.bio,
          imageUrl: image.imageUrl,
          imageId: image.imageId,
        }
      );

      if (!updatedUser) {
        if (hasFileToUpdate) await deleteFile(image.imageId);
        throw Error("Update user failed");
      }

      if (user.imageId && hasFileToUpdate) {
        await deleteFile(user.imageId);
      }

      return updatedUser;
    } catch (error) {
      console.warn("Appwrite updateUser failed, using mock:", error);
    }
  }

  // Mock Update User
  const users = getStoredUsers();
  const posts = getStoredPosts();
  const index = users.findIndex((u) => u.$id === user.userId);
  if (index === -1) return null;

  let imageUrl = String(user.imageUrl);
  let imageId = user.imageId;

  if (user.file && user.file[0]) {
    imageId = "file_" + Date.now();
    try {
      imageUrl = URL.createObjectURL(user.file[0]);
      fileBlobMap.set(imageId, imageUrl);
    } catch (e) {
      console.warn("Failed to create blob for updated user avatar:", e);
    }
  }

  const updated: MockUserDoc = {
    ...users[index],
    name: user.name,
    bio: user.bio,
    imageUrl: imageUrl,
    imageId: imageId,
    $updatedAt: new Date().toISOString(),
  };

  users[index] = updated;
  saveStoredUsers(users);

  // Also update creator object in posts created by this user
  for (let i = 0; i < posts.length; i++) {
    if (posts[i].creator?.$id === user.userId) {
      posts[i].creator = {
        ...posts[i].creator,
        name: user.name,
        imageUrl: imageUrl,
      };
    }
  }
  saveStoredPosts(posts);

  return buildFullUser(updated, posts) as unknown as Models.Document;
}
