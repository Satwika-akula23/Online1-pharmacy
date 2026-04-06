const API = "http://localhost:8099/api";

async function apiRequest(endpoint, method = "GET", body = null) {

    const options = {
        method,
        headers: {
            "Content-Type": "application/json"
        }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(API + endpoint, options);

    if (!response.ok) {
        throw new Error("API Error");
    }

    return response.json();
}