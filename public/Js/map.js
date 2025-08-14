//     mapboxgl.accessToken = mapToken;

//     const map = new mapboxgl.Map({
//         container: 'map', // container ID
//         center: [77.2088, 28.6139], // starting position [lng, lat]. Note that lat must be set between -90 and 90
//         zoom: 9 // starting zoom
//     });

// console.log(coodrinates);

// //    const marker = new mapboxgl.Marker()
// //           .setLngLat(coodrinates)   //listing loc marker  //listing.body.geometry
// //         .addTo(map);

mapboxgl.accessToken = mapToken;

console.log("Coordinates in map.js:", listing.geometry.coordinates);

const map = new mapboxgl.Map({
    container: 'map', 
    style: 'mapbox://styles/mapbox/standard',
    center: listing.geometry.coordinates, // Use your listing's coordinates here
    zoom: 9
}) 
new mapboxgl.Marker({ color: 'black' })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(new mapboxgl.Popup({offset: 25})
    .setHTML(`<h3>${listing.title}</h3><p>Extact location will be provided after bookoing</p>`))
  .addTo(map);


//   const map = new mapboxgl.Map()
   