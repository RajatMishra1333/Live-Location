const socket = io();

const map = L.map("map").setView([20.5937, 78.9629], 5); // India center view initially

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Rajat"
}).addTo(map);

const markers = {};

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            console.log("Sending location:", latitude, longitude);
            socket.emit("send-location", { latitude, longitude });
        },
        (error) => {
            console.error(error);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        }
    );
}

socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;
    console.log("Received:", id, latitude, longitude);

    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }

    map.setView([latitude, longitude], 16);
});
