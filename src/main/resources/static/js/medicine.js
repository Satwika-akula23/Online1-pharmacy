const userId = localStorage.getItem("userId");
let allMedicines = [];

/* ================= LOAD ================= */
function loadMedicines() {

    if (typeof API === "undefined") {
        console.error("API not defined");
        return;
    }

    const container = document.getElementById("medicineList");
    if (!container) return;

    fetch(API + "/medicines")
        .then(res => res.json())
        .then(data => {
            allMedicines = data;
            renderMedicines(data);
        })
        .catch(() => {
            container.innerHTML = "<h3>Error loading medicines ❌</h3>";
        });
}

/* ================= RENDER ================= */
function renderMedicines(data) {

    const container = document.getElementById("medicineList");
    if (!container) return;

    let html = "";

    data.forEach(med => {

        html += `
            <div class="card">

                <img src="${med.imageUrl || '/images/default-medicine.png'}"
                     loading="lazy"
                     style="height:150px; object-fit:contain; background:#f5f5f5;"
                     onerror="this.onerror=null; this.src='/images/default-medicine.png';">

                <h3>${med.name}</h3>

                <p>₹${med.price}</p>

                <p>Stock: ${med.quantity}</p>

                <small>${med.category || ""}</small>

                <button class="btn btn-primary" onclick="addToCart(${med.id})">
                    🛒 Add to Cart
                </button>

                <button class="btn btn-secondary" onclick="buyNow(${med.id})">
                    ⚡ Buy Now
                </button>

            </div>
        `;
    });

    container.innerHTML = html;
}

/* ================= SEARCH + FILTER ================= */
document.addEventListener("DOMContentLoaded", () => {

    const search = document.getElementById("searchInput");
    const category = document.getElementById("categoryFilter");

    if (search) {
        search.addEventListener("input", function () {

            const value = this.value.toLowerCase();

            const filtered = allMedicines.filter(m =>
                (m.name || "").toLowerCase().includes(value)
            );

            renderMedicines(filtered);
        });
    }

	if (category) {
	    category.addEventListener("change", function () {

	        const value = this.value;

	        if (!value) {
	            renderMedicines(allMedicines);
	            return;
	        }

	        const filtered = allMedicines.filter(m =>
	            (m.category || "").toLowerCase() === value.toLowerCase()
	        );

	        renderMedicines(filtered);
	    });
	}
});

/* ================= ADD TO CART ================= */
function addToCart(id) {

    if (!userId) {
        showToast("Please login first ❌");
        setTimeout(() => window.location.href = "/login", 1200);
        return;
    }

    fetch(API + "/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userId: parseInt(userId),
            medicineId: id,
            quantity: 1
        })
    })
    .then(res => {
        if (!res.ok) throw new Error();
        showToast("Added to cart ✅");
    })
    .catch(() => {
        showToast("Error adding to cart ❌");
    });
}

/* ================= BUY NOW ================= */
function buyNow(id) {

    if (!userId) {
        showToast("Please login first ❌");
        setTimeout(() => window.location.href = "/login", 1200);
        return;
    }

    fetch(API + "/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userId: parseInt(userId),
            medicineId: id,
            quantity: 1
        })
    })
    .then(() => {
        return fetch(API + "/order/place/" + userId, {
            method: "POST"
        });
    })
    .then(res => {
        if (!res.ok) throw new Error();
        showToast("Order placed successfully ✅");
    })
    .catch(() => {
        showToast("Order failed ❌");
    });
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

    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 2500);
}

/* ================= INIT ================= */
window.onload = loadMedicines;