// Creating the map object
let myMap = L.map("map", {
    center: [39.000, -98.000],
    zoom: 5
  });
  
  //Tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  
  //grab the gojson data through https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson

let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


//set the depth colors
function depthColor(depth) {
    if (depth <= 10) {
        return "#98ee00";
    } else if (depth > 10 && depth <= 30) {
        return "#d4ee00";
    } else if (depth > 30 && depth <= 50) {
        return "#eecc00";
    } else if (depth > 50 && depth <= 70) {
        return "#ee9c00";
    } else if (depth > 70 && depth <= 90) {
        return "#ea822c";
    } else if (depth > 90) {
        return "#ea2c2c";
    }
}

//get info from queryUrl and set coordinates, depth, size and time
d3.json(queryUrl).then(function(data) {

    for (var i = 0; i < data.features.length; i++) {
    let earthquakes = data.features[i]
    let coord = earthquakes.geometry.coordinates
    let magnitudeQuake = earthquakes.properties.mag
    let timestamp = earthquakes.properties.time
        let date = new Date(timestamp);
        let readableDate = date.toLocaleString();  
    let depth = earthquakes.geometry.coordinates[2]
    let size = magnitudeQuake * 5.5
    let markerColor = depthColor(depth);

//set the circle size and opacity
    let = L.circleMarker([coord[1],coord[0]], {
        radius: size,
        color: markerColor,
        fillOpacity: 0.5
        
//set popup info        
    }).bindPopup(`<h3>${earthquakes.properties.title}</h3>
                <hr>
                <p><b>Location:</b> ${earthquakes.properties.place}</p> 
                <p><b>Time:</b> ${readableDate}</p>
                <p><b>Magnitude:</b> ${magnitudeQuake}</p>
                <p><b>Depth:</b> ${depth}</p>
    `).addTo(myMap);
    
    }
// Create the key
let key = L.control({position: 'bottomright'});
key.onAdd = function () {
    let div = L.DomUtil.create('div', 'info legend');
    let magnitude = [" -10","10", "30", " 50 ", " 70 ", " 90 "];
    let ranges = ["#98ee00","#d4ee00","#eecc00","#ee9c00","#ea822c","#ea2c2c"];
    
        for (var i=0; i<magnitude.length; i++){
        
        div.innerHTML +=
       "<i style='background: " + ranges[i] + "'></i> " +
       magnitude[i] + (magnitude[i + 1] ? "&ndash;" + magnitude[i + 1] + "<br>" : "+");
    }   
    return div; 
    };
    
key.addTo(myMap);
});