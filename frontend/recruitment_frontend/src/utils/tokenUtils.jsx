// After receiving token:
localStorage.setItem("accessToken", data.access);

// Fetch user profile using access token
const res = await fetch("http://127.0.0.1:8000/api/users/me/", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    "Content-Type": "application/json",
  },
});

const userData = await res.json();

// Save role in localStorage
localStorage.setItem("userRole", userData.role);
