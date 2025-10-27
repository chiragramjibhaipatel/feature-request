/**
 * Feature Request API Service
 * Handles all API calls related to feature requests
 */

const API_BASE_URL = 'http://localhost:5173/api';

export class FeatureRequestService {
  /**
   * Fetch all feature requests
   * @returns {Promise<Array>} Array of feature requests
   */
  static async getAllRequests() {
    try {
      const response = await fetch(`${API_BASE_URL}/features`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Ensure upvotes is always an array
      const features = data.features.map(feature => ({
        ...feature,
        upvotes: Array.isArray(feature.upvotes)
          ? feature.upvotes
          : (typeof feature.upvotes === 'string' ? JSON.parse(feature.upvotes) : []),
        tags: Array.isArray(feature.tags)
          ? feature.tags
          : (typeof feature.tags === 'string' ? JSON.parse(feature.tags) : []),
      }));
      return features;
    } catch (error) {
      console.error('Error fetching feature requests:', error);
      throw error;
    }
  }

  /**
   * Create a new feature request
   * @param {Object} requestData - The feature request data
   * @param {string} requestData.title - Title of the feature request
   * @param {string} requestData.description - Description of the feature request
   * @param {string[]} requestData.tags - Tags for the feature request
   * @param {string} requestData.customerId - Customer ID
   * @returns {Promise<Object>} Created feature request
   */
  static async createRequest(requestData) {
    try {
      const formData = new FormData();
      formData.append('action', 'create');
      formData.append('title', requestData.title);
      formData.append('description', requestData.description);
      formData.append('tags', JSON.stringify(requestData.tags || []));
      formData.append('customerId', requestData.customerId);

      const response = await fetch(`${API_BASE_URL}/features`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const feature = data.feature;
      // Ensure upvotes and tags are arrays
      return {
        ...feature,
        upvotes: Array.isArray(feature.upvotes)
          ? feature.upvotes
          : (typeof feature.upvotes === 'string' ? JSON.parse(feature.upvotes) : []),
        tags: Array.isArray(feature.tags)
          ? feature.tags
          : (typeof feature.tags === 'string' ? JSON.parse(feature.tags) : []),
      };
    } catch (error) {
      console.error('Error creating feature request:', error);
      throw error;
    }
  }

  /**
   * Toggle upvote for a feature request
   * @param {string} requestId - ID of the feature request
   * @param {boolean} hasUpvoted - Whether the user has already upvoted
   * @param {string} customerId - Customer ID
   * @returns {Promise<Object>} Updated feature with upvotes array
   */
  static async toggleUpvote(requestId, hasUpvoted, customerId) {
    try {
      const formData = new FormData();
      formData.append('action', hasUpvoted ? 'removeUpvote' : 'upvote');
      formData.append('featureId', requestId);
      formData.append('customerId', customerId);

      const response = await fetch(`${API_BASE_URL}/features`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Return the feature object which contains upvotes array
      return data.feature;
    } catch (error) {
      console.error('Error toggling upvote:', error);
      throw error;
    }
  }
}
