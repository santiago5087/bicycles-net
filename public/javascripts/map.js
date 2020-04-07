var map = L.map('mainMap').setView([6.2603994,-75.5947649], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

/*
L.marker([6.2619358, -75.6042681]).addTo(map); //CS Santa Rosa de Lima
L.marker([6.256864, -75.5923187]).addTo(map); //Estadio
L.marker([6.2614712, -75.5793956]).addTo(map); //Unal Medellín
*/

//Corregir!
// $.ajax({
//     dataType: 'json', //Parsea la info resultado a json
//     url: 'api/bicycles',
//     success: function(result) {
//         console.log(result)
//         result.bicycles.forEach(e => {
//             L.marker(e.ubication, {title: e.id}).addTo(map);
//         });
//     }
// })