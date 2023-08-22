// Define the URL and store the API
let url= "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

// now perform the GET request to the URL 
d3.json(url).then(data=> {
    console.log(data);
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
});

//call the function

function createFeatures(earthquakeData) {
    // display the time and place of the earthquake
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>Location:</h3> ${feature.properties.place}<h3> Magnitude:</h3> ${feature.properties.mag}<h3> Depth:</h3> ${feature.geometry.coordinates[2]}`);
  }
//Now create the geoJSN layer that has the features array on the earthquakeData object
        let earthquakes = L.geoJson (earthquakeData, {
            onEachFeature: onEachFeature,

            pointToLayer: function (features, coordinates){
            let depth= features.properties.mag;
            let geoMarkers= {
                radius: depth * 5,
                fillColor: colors (depth),
                fillOpacity: 0.5,
                weight: 0.5
            };
            //return the coordinates
            return L.circleMarker(coordinates, geoMarkers);
            }
        });

        //now call the function
        createMap(earthquakes);
        
};

// create a color scale
function colors(depth) {

    // variable to hold the color
    let color = "";

    if (depth <= 1) {
        return color = "#84fd6c";
    }
    else if (depth <= 2) {
        return color = "#bfd16e";
    }
    else if (depth <= 3) {
        return color = "#ddbf5c";
    }
    else if (depth <= 4) {
        return color = "#e79b37";
    }
    else if (depth <= 5) {
        return color = "#ec7141";
    }
    else {
        return color = "#f82720";
    }

};

// Create a legend to display information about our map
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
    grades = [0,1, 2, 3, 4, 5],
    labels = [];

    div.innerHTML += 'Magnitude<br><hr>';

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colors(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};


// now call the funtion that creates the map

function createMap(earthquakes) {
    //create base layers
  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

// Create the baseMaps object 
let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Earthquakes: earthquakes
  };

// Now create the map
 // Create our map, giving it the streetmap and earthquakes layers to display on load.
 let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

   // Add the legend to the map
   legend.addTo(myMap);

};