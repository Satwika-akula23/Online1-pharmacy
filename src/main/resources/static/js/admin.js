window.onload = loadMedicines;

/* ================= LOAD ================= */
async function loadMedicines() {

    try {
        const res = await fetch(API + "/medicines");
        const data = await res.json();

        console.log("Medicines:", data);

        const div = document.getElementById("medicinesList");

        if (!div) {
            console.error("❌ medicinesList div not found");
            return;
        }

        let html = "";

        data.forEach(m => {

            html += `
            <div class="card">

                <img src="${m.imageUrl}" 
                     style="width:100%; height:120px; object-fit:contain;"
                     onerror="this.src='/images/default-medicine.png'">

                <h4>${m.name}</h4>
                <p>₹ ${m.price}</p>
                <p style="color:gray;">Stock: ${m.quantity}</p>

                <div style="margin-top:10px;">
                    <button onclick="deleteMedicine(${m.id})" 
                            style="background:red;color:white;">
                        Delete
                    </button>

                    <button onclick="editMedicine(${m.id}, '${m.name}', ${m.price}, '${m.category}', ${m.quantity})">
                        Edit
                    </button>
                </div>

            </div>
            `;
        });

        div.innerHTML = html;

    } catch (err) {
        console.error("❌ Error loading medicines:", err);
    }
}


/* ================= ADD ================= */
async function addMedicine() {

    try {
        const med = {
            name: document.getElementById("name").value,
            price: parseFloat(document.getElementById("price").value),
            imageUrl: document.getElementById("imageUrl").value,
            category: document.getElementById("category").value,
            quantity: parseInt(document.getElementById("quantity").value),
            stock: parseInt(document.getElementById("quantity").value)
        };

        await fetch(API + "/medicines", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(med)
        });

        alert("Medicine added ✅");

        loadMedicines();

    } catch (err) {
        console.error("Error adding medicine:", err);
    }
}


/* ================= DELETE ================= */
async function deleteMedicine(id) {

    if (!confirm("Delete this medicine?")) return;

    try {
        await fetch(API + "/medicines/" + id, {
            method: "DELETE"
        });

        loadMedicines();

    } catch (err) {
        console.error("Error deleting:", err);
    }
}


/* ================= EDIT ================= */
function editMedicine(id, name, price, category, quantity) {

    const newName = prompt("Name:", name);
    const newPrice = prompt("Price:", price);

    if (!newName || !newPrice) return;

    fetch(API + "/medicines/" + id, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            name: newName,
            price: parseFloat(newPrice),
            imageUrl: "/images/default-medicine.png",
            category: category,
            quantity: quantity,
            stock: quantity
        })
    })
    .then(() => {
        alert("Updated ✅");
        loadMedicines();
    })
    .catch(err => console.error("Error updating:", err));
}


/* ================= LOGOUT ================= */
function logout() {
    localStorage.clear();
    window.location.href = "/login";
}