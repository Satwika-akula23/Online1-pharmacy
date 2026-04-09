console.log("Dashboard JS Loaded");

/* ================= GLOBAL ================= */
let allMedicines = [];

/* ================= INIT ================= */
window.onload = function () {
    checkAuth();
    loadUser();
    loadMedicines();
};

/* ================= USER ================= */
function loadUser() {
    const userId = localStorage.getItem("userId");

    if (!userId) {
        window.location.href = "/login";
        return;
    }

    const name = localStorage.getItem("userName") || "User";

    const welcome = document.getElementById("welcomeMsg");
    if (welcome) {
        welcome.innerText = "👋 Welcome, " + name;
    }
}

/* ================= LOAD MEDICINES ================= */
async function loadMedicines() {

    const container = document.getElementById("medicines");

    if (!container) {
        console.error("❌ medicines div not found");
        return;
    }

    container.innerHTML = "<p>Loading...</p>";

    try {
        const res = await fetch("http://localhost:8099/api/medicines");
        allMedicines = await res.json();

        renderMedicines(allMedicines);
        setupFilters();

    } catch (err) {
        console.error(err);
        container.innerHTML = "<h3>Error loading ❌</h3>";
    }
}

/* ================= RENDER ================= */
function renderMedicines(list) {

    const container = document.getElementById("medicines");

    let html = "";

    list.forEach(m => {

        html += `
        <div class="card">
            <img src="${m.imageUrl}" 
                 onerror="this.src='/images/default-medicine.png'">

            <h4>${m.name}</h4>
            <p>₹${m.price}</p>

            <!-- ✅ QUANTITY SELECTOR -->
            <div style="display:flex; justify-content:center; gap:5px; margin:10px;">
                <button onclick="changeQty(${m.id}, -1)">-</button>
                <input type="number" id="qty-${m.id}" value="1" min="1" style="width:50px; text-align:center;">
                <button onclick="changeQty(${m.id}, 1)">+</button>
            </div>

            <div style="display:flex; gap:10px; justify-content:center;">
                <button onclick="addToCart(${m.id})">Add to Cart</button>
                <button onclick="buyNow(${m.id})" style="background:#ff5722; color:white;">Buy Now</button>
            </div>
        </div>
        `;
    });

    container.innerHTML = html;
}

/* ================= CHANGE QTY ================= */
function changeQty(id, change) {
    const input = document.getElementById(`qty-${id}`);
    let value = parseInt(input.value) || 1;

    value += change;

    if (value < 1) value = 1;

    input.value = value;
}

/* ================= GET QTY ================= */
function getQty(id) {
    const input = document.getElementById(`qty-${id}`);
    return parseInt(input.value) || 1;
}

/* ================= FILTER ================= */
function setupFilters() {

    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");

    if (!searchInput || !categoryFilter) return;

    searchInput.addEventListener("input", filterMedicines);
    categoryFilter.addEventListener("change", filterMedicines);
}

function filterMedicines() {

    const search = document.getElementById("searchInput").value.toLowerCase();
    const category = document.getElementById("categoryFilter").value;

    const filtered = allMedicines.filter(m =>
        m.name.toLowerCase().includes(search) &&
        (category === "" || m.category === category)
    );

    renderMedicines(filtered);
}

/* ================= ADD TO CART ================= */
async function addToCart(medicineId) {

    const userId = localStorage.getItem("userId");

    try {
        await fetch(API + "/cart/add", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                userId: parseInt(userId),
                medicineId: medicineId,
                quantity: getQty(medicineId) // ✅ FIX
            })
        });

        showToast("Added to Cart ✅");

    } catch (err) {
        console.error(err);
    }
}

/* ================= BUY NOW ================= */
async function buyNow(medicineId) {

    const userId = localStorage.getItem("userId");

    try {
        await fetch(API + "/cart/add", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                userId: parseInt(userId),
                medicineId: medicineId,
                quantity: getQty(medicineId) // ✅ FIX
            })
        });

        await fetch(API + "/orders/place", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                userId: parseInt(userId)
            })
        });

        showToast("Order Confirmed ✅");

        setTimeout(() => {
            window.location.href = "/orders";
        }, 1200);

    } catch (err) {
        console.error(err);
    }
}

/* ================= TOAST ================= */
function showToast(message) {

    let toast = document.createElement("div");

    toast.innerText = message;
    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.right = "20px";
    toast.style.background = "#2e7d32";
    toast.style.color = "white";
    toast.style.padding = "10px 15px";
    toast.style.borderRadius = "5px";

    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 2000);
}

/* ================= LOGOUT ================= */
function logout() {
    localStorage.clear();
    window.location.href = "/login";
}