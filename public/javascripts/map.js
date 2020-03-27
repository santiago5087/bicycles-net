var map = L.map('mainMap').setView([6.2603994,-75.5947649], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.marker([6.2568693,-75.5923187]).addTo(map);
L.marker([6.2616365,-75.5931341]).addTo(map);
L.marker([6.2603994,-75.5947649,15]).addTo(map);