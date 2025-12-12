/**
 * API Client for Product Review Analyzer
 * Centralized module for all backend API calls
 */

import axios from 'axios';

const API_BASE_URL = '/api';

/**
 * Analyze a product review
 * @param {string} reviewText - The review text to analyze
 * @returns {Promise<Object>} Analysis result with sentiment and key points
 */
export const analyzeReview = async (reviewText) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/analyze-review`, {
      review_text: reviewText
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error analyzing review:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Failed to analyze review'
    };
  }
};

/**
 * Get all reviews with pagination
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Items per page (default: 10)
 * @returns {Promise<Object>} List of reviews with pagination info
 */
export const getReviews = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/reviews`, {
      params: { page, limit }
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Failed to fetch reviews'
    };
  }
};

/**
 * Check API health status
 * @returns {Promise<Object>} Health status
 */
export const checkHealth = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error checking health:', error);
    return {
      success: false,
      error: error.message || 'API is not responding'
    };
  }
};
