/* ================= LOGIN ================= */
function loginUser(event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        showToast("Please enter email and password ❌");
        return;
    }

    fetch(`${API}/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    })
    .then(res => {
        if (!res.ok) {
            throw new Error("Invalid credentials");
        }
        return res.json();
    })
    .then(data => {
        console.log("Login Response:", data);

        // ✅ FIXED: use userId from backend
        if (!data || !data.userId) {
            showToast("Invalid server response ❌");
            return;
        }

        localStorage.setItem("userId", data.userId);
        localStorage.setItem("userName", data.fullName || "");

        showToast("Login Successful ✅");

        setTimeout(() => {
            window.location.href = "/dashboard";
        }, 800);
    })
    .catch(err => {
        console.error(err);
        showToast("Login Failed ❌");
    });
}


/* ================= REGISTER ================= */
function registerUser(event) {
    event.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const phone = document.getElementById("phone").value.trim();

    if (!fullName || !email || !password || !phone) {
        showToast("Please fill all fields ❌");
        return;
    }

    const btn = event.target.querySelector("button");
    btn.innerText = "Registering...";
    btn.disabled = true;

    fetch(`${API}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password, phone })
    })
    .then(res => {
        if (!res.ok) {
            throw new Error("Registration failed");
        }
        return res.json();
    })
    .then(() => {
        showToast("Registered Successfully ✅");

        setTimeout(() => {
            window.location.href = "/login";
        }, 1000);
    })
    .catch(err => {
        console.error(err);
        showToast("Registration Failed ❌");
    })
    .finally(() => {
        btn.innerText = "Register";
        btn.disabled = false;
    });
}


/* ================= LOGOUT ================= */
function logout() {
    localStorage.clear();
    showToast("Logged out successfully 👋");

    setTimeout(() => {
        window.location.href = "/login";
    }, 800);
}


/* ================= CHECK LOGIN ================= */
function checkAuth() {
    const userId = localStorage.getItem("userId");

    if (!userId) {
        showToast("Please login first ❌");

        setTimeout(() => {
            window.location.href = "/login";
        }, 800);
    }
}

function togglePassword() {

    const input = document.getElementById("password");

    if (input.type === "password") {
        input.type = "text";
    } else {
        input.type = "password";
    }
}

/* ================= TOAST ================= */
function showToast(message) {
    let toast = document.createElement("div");
    toast.innerText = message;

    toast.style.position = "fixed";
    toast.style.bottom = "30px";
    toast.style.right = "30px";
    toast.style.background = "#333";
    toast.style.color = "#fff";
    toast.style.padding = "12px 20px";
    toast.style.borderRadius = "8px";
    toast.style.boxShadow = "0 5px 15px rgba(0,0,0,0.2)";
    toast.style.zIndex = "9999";
    toast.style.fontSize = "14px";

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 2500);
}