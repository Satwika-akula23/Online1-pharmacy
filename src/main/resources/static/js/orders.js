console.log("Orders JS Loaded");

/* ================= LOAD ORDERS ================= */
function loadOrders() {

    const userId = localStorage.getItem("userId");

    if (!userId) {
        window.location.href = "/login";
        return;
    }

    const div = document.getElementById("orders");

    if (!div) {
        console.error("❌ orders div not found");
        return;
    }

    div.innerHTML = `<div class="loader"></div>`;

    fetch(API + "/orders/" + userId)
    .then(res => res.json())
    .then(data => {

        div.innerHTML = "";

        if (!data || data.length === 0) {
            div.innerHTML = "<p style='text-align:center;'>No orders yet 📦</p>";
            return;
        }

        data.forEach(o => {

            div.innerHTML += `
                <div class="order-card" style="
                    border:1px solid #ddd;
                    padding:15px;
                    margin:15px;
                    border-radius:10px;
                    box-shadow:0 2px 8px rgba(0,0,0,0.1);
                ">
                    <h3>Order #${o.id}</h3>

                    <p><b>Amount:</b> ₹${o.totalAmount}</p>

                    <p style="color:gray;">
                        ${formatDate(o.createdAt)}
                    </p>

                    <!-- Optional small button (does not break existing) -->
                    <button onclick="downloadInvoice()" 
                            style="margin-top:10px; padding:6px 10px; background:#2196f3; color:white; border:none; border-radius:5px;">
                        Invoice
                    </button>
                </div>
            `;
        });
    })
    .catch(() => {
        div.innerHTML = "<p style='text-align:center;'>Failed to load orders ❌</p>";
    });
}


/* ================= DATE FORMAT ================= */
function formatDate(date) {
    if (!date) return "";

    try {
        return new Date(date).toLocaleString();
    } catch {
        return date;
    }
}


/* ================= DOWNLOAD ================= */
function downloadInvoice() {

    const userId = localStorage.getItem("userId");

    fetch(API + "/invoice/" + userId)
    .then(res => res.blob())
    .then(blob => {

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "invoice.pdf";
        a.click();

        window.URL.revokeObjectURL(url);
    })
    .catch(() => {
        showToast("Download failed ❌");
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


/* ================= AUTO LOAD ================= */
window.onload = loadOrders;