// src/services/auth.js
const API_BASE = "http://localhost:8000/api"; // Update if hosted

export async function loginUser(credentials) {
  const response = await fetch(`${API_BASE}/users/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return response.json();
}

export async function registerUser(data) {
  const response = await fetch(`${API_BASE}/users/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}
