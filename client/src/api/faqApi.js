import axios from "axios";

const API_URL = "http://localhost:4000/api/faq";

// ✅ Fetch FAQs with Pagination, Search, and Language
export const fetchFAQs = async ({ page = 1, limit = 10, search = "", category = "", language = "en" } = {}) => {
  try {
    const response = await axios.get(API_URL, {
      params: { page, limit, search, category, language },  // Pass language to the backend
    });

    // ✅ Ensure response contains a valid array
    if (!Array.isArray(response.data.faqs)) {
      return { faqs: [], totalPages: 1 };
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching FAQs:", error.response?.data || error.message);
    return { faqs: [], totalPages: 1 }; // ✅ Fallback to prevent crashes
  }
};

// ✅ Fetch Single FAQ by ID
export const fetchFAQById = async (faqId) => {
  try {
    const response = await axios.get(`${API_URL}/${faqId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching FAQ with ID ${faqId}:`, error.response?.data || error.message);
    return null; // ✅ Return null if not found
  }
};

// ✅ Add FAQ
export const addFAQ = async (faqData) => {
  try {
    const response = await axios.post(API_URL, faqData);
    return response.data;
  } catch (error) {
    console.error("Error adding FAQ:", error.response?.data || error.message);
    throw error; // ✅ Let caller handle error (e.g., showing UI message)
  }
};

// ✅ Update FAQ by ID
export const updateFAQ = async (faqId, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/${faqId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error(`Error updating FAQ ID ${faqId}:`, error.response?.data || error.message);
    throw error; // ✅ Allow frontend to handle errors
  }
};

// ✅ Soft Delete FAQ by ID
export const deleteFAQ = async (faqId) => {
  try {
    const response = await axios.delete(`${API_URL}/${faqId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting FAQ ID ${faqId}:`, error.response?.data || error.message);
    throw error; // ✅ Let UI handle the error
  }
};
