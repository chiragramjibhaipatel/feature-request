/**
 * Feature Request API Service
 * Handles all API calls related to feature requests
 */

const API_BASE_URL = 'https://marie-rewards-asia-quit.trycloudflare.com/api';


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
      return data.features;
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
   * @returns {Promise<Object>} Created feature request
   */
  static async createRequest(requestData) {
    try {
      const formData = new FormData();
      formData.append('action', 'create');
      formData.append('title', requestData.title);
      formData.append('description', requestData.description);
      formData.append('tags', JSON.stringify(requestData.tags || []));
      formData.append('customerId', requestData.customerId)

      const response = await fetch(`${API_BASE_URL}/features`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.feature;
    } catch (error) {
      console.error('Error creating feature request:', error);
      throw error;
    }
  }

  /**
   * Toggle upvote for a feature request
   * @param {string} requestId - ID of the feature request
   * @param {boolean} hasUpvoted - Whether the user has already upvoted
   * @returns {Promise<Object>} Updated feature request
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

      return await response.json();
    } catch (error) {
      console.error('Error toggling upvote:', error);
      throw error;
    }
  }

  /**
   * Update feature request status
   * @param {string} requestId - ID of the feature request
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated feature request
   */
  static async updateStatus(requestId, status) {
    try {
      const response = await fetch(`${API_BASE_URL}/feature-requests/${requestId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating status:', error);
      throw error;
    }
  }

  /**
   * Delete a feature request
   * @param {string} requestId - ID of the feature request
   * @returns {Promise<void>}
   */
  static async deleteRequest(requestId) {
    try {
      const response = await fetch(`${API_BASE_URL}/feature-requests/${requestId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting feature request:', error);
      throw error;
    }
  }
}
