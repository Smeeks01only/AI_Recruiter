import API_BASE_URL from "../config";
// After receiving token:
localStorage.setItem("accessToken", data.access);

// Fetch user profile using access token
const res = await fetch(`${API_BASE_URL}/api/users/me/`, {
  method: "GET",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    "Content-Type": "application/json",
  },
});

const userData = await res.json();

// Save role in localStorage
localStorage.setItem("userRole", userData.role);
