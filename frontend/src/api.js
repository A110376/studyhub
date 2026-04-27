import axios from "axios";

const API_ROOT = import.meta.env.VITE_API_ROOT || "http://localhost:8000/api/accounts";

// Get token from localStorage (or wherever you store JWT)
const getAuthHeader = () => {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Start a test by slug
export const startTest = (slug) =>
  axios.post(`${API_ROOT}/mocktest/${slug}/start/`, null, { headers: getAuthHeader() });

// Fetch test questions by slug
export const fetchQuestions = (slug) =>
  axios.get(`${API_ROOT}/mocktest/${slug}/questions/`, { headers: getAuthHeader() });

// Submit attempt with answers
export const submitAttempt = (attemptId, answersPayload) => {
  if (!attemptId) throw new Error("Attempt ID is required (must be UUID)");
  return axios.post(
    `${API_ROOT}/mocktest/attempts/${attemptId}/submit/`,
    answersPayload,
    { headers: getAuthHeader() }
  );
};

// Get attempt result by UUID
export const getResult = (attemptId) => {
  if (!attemptId) throw new Error("Attempt ID is required (must be UUID)");
  return axios.get(`${API_ROOT}/mocktest/attempts/${attemptId}/result/`, { headers: getAuthHeader() });
};
