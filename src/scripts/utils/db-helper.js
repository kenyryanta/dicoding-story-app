const DATABASE_NAME = "dicoding-story-app-db";
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = "stories";

let dbPromise;

// Initialize database menggunakan native IndexedDB
const initDB = () => {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

      request.onerror = () => {
        reject(new Error("Failed to open database"));
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(OBJECT_STORE_NAME)) {
          const store = db.createObjectStore(OBJECT_STORE_NAME, {
            keyPath: "id",
          });
          store.createIndex("createdAt", "createdAt", { unique: false });
          store.createIndex("name", "name", { unique: false });
        }
      };
    });
  }
  return dbPromise;
};

const DbHelper = {
  async getAllStories() {
    try {
      const db = await initDB();
      const transaction = db.transaction([OBJECT_STORE_NAME], "readonly");
      const store = transaction.objectStore(OBJECT_STORE_NAME);

      return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(new Error("Failed to get stories"));
      });
    } catch (error) {
      console.error("Error getting all stories:", error);
      return [];
    }
  },

  async getStoryById(id) {
    try {
      const db = await initDB();
      const transaction = db.transaction([OBJECT_STORE_NAME], "readonly");
      const store = transaction.objectStore(OBJECT_STORE_NAME);

      return new Promise((resolve, reject) => {
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(new Error("Failed to get story"));
      });
    } catch (error) {
      console.error("Error getting story by id:", error);
      return null;
    }
  },

  async putStory(story) {
    if (!story || !story.id) {
      console.error("Story object must have an id property.");
      return null;
    }

    try {
      const db = await initDB();
      const transaction = db.transaction([OBJECT_STORE_NAME], "readwrite");
      const store = transaction.objectStore(OBJECT_STORE_NAME);

      return new Promise((resolve, reject) => {
        const request = store.put(story);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(new Error("Failed to put story"));
      });
    } catch (error) {
      console.error("Error putting story:", error);
      throw error;
    }
  },

  async putAllStories(stories) {
    if (!stories || !Array.isArray(stories)) {
      console.error("Input must be an array of stories.");
      return;
    }

    try {
      const db = await initDB();
      const transaction = db.transaction([OBJECT_STORE_NAME], "readwrite");
      const store = transaction.objectStore(OBJECT_STORE_NAME);

      const promises = stories.map((story) => {
        if (story && story.id) {
          return new Promise((resolve, reject) => {
            const request = store.put(story);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(new Error("Failed to put story"));
          });
        }
        return Promise.resolve();
      });

      await Promise.all(promises);
      console.log(`Successfully saved ${stories.length} stories to IndexedDB`);
    } catch (error) {
      console.error("Error putting all stories:", error);
      throw error;
    }
  },

  async deleteStory(id) {
    try {
      const db = await initDB();
      const transaction = db.transaction([OBJECT_STORE_NAME], "readwrite");
      const store = transaction.objectStore(OBJECT_STORE_NAME);

      return new Promise((resolve, reject) => {
        const request = store.delete(id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(new Error("Failed to delete story"));
      });
    } catch (error) {
      console.error("Error deleting story:", error);
      throw error;
    }
  },

  async clearAllStories() {
    try {
      const db = await initDB();
      const transaction = db.transaction([OBJECT_STORE_NAME], "readwrite");
      const store = transaction.objectStore(OBJECT_STORE_NAME);

      return new Promise((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => {
          console.log("All stories cleared from IndexedDB.");
          resolve(request.result);
        };
        request.onerror = () => reject(new Error("Failed to clear stories"));
      });
    } catch (error) {
      console.error("Error clearing all stories:", error);
      throw error;
    }
  },
};

export default DbHelper;
