import storyApi from "../api/api.js";

class StoryModel {
  constructor() {
    this.stories = [];
    this.currentStory = null;
  }

  async fetchAllStories() {
    try {
      const response = await storyApi.getAllStories();

      if (response.error) {
        throw new Error(response.message);
      }

      this.stories = response.listStory || [];
      return this.stories;
    } catch (error) {
      console.error("Error fetching stories:", error);
      throw error;
    }
  }

  async fetchStoryDetail(id) {
    try {
      const response = await storyApi.getStoryDetail(id);

      if (response.error) {
        throw new Error(response.message);
      }

      this.currentStory = response.story;
      return this.currentStory;
    } catch (error) {
      console.error(`Error fetching story with id ${id}:`, error);
      throw error;
    }
  }

  async addStory(description, photoFile, lat, lon) {
    try {
      const response = await storyApi.addNewStory(
        description,
        photoFile,
        lat,
        lon
      );

      if (response.error) {
        throw new Error(response.message);
      }

      return response;
    } catch (error) {
      console.error("Error adding new story:", error);
      throw error;
    }
  }

  getStories() {
    return this.stories;
  }

  getCurrentStory() {
    return this.currentStory;
  }

  clearStories() {
    this.stories = [];
    this.currentStory = null;
  }
}

export default new StoryModel();
