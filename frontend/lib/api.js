
import axios from 'axios';

const API_BASE_URL = 'https://goalbreaker-2-x8yy.onrender.com/api/v1';

export const goalAPI = {
  async createGoal(goalText) {
    const response = await axios.post(`${API_BASE_URL}/goals/`, {
      goal_text: goalText,
    });
    return response.data;
  },

  async getGoals() {
    const response = await axios.get(`${API_BASE_URL}/goals/`);
    return response.data;
  },

  async getGoalById(id) {
    const response = await axios.get(`${API_BASE_URL}/goals/${id}`);
    return response.data;
  },
};