// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
      "</h3><hr><p>Magnitude: " + feature.properties.mag + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  //the color and size of the markers should represent the magnitude
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
        var fillcolor;
      
        if (feature.properties.mag < 1) {
          fillcolor = 'rgb(1, 163, 12)'
        } else if (feature.properties.mag <2) {
          fillcolor = 'rgb(141, 226, 4)'
        } else if (feature.properties.mag < 3) {
          fillcolor = 'rgb(197, 226, 4)'
        } else if (feature.properties.mag < 4) {
          fillcolor = 'rgb(243, 247, 17)'
        } else if (feature.properties.mag < 5) {
          fillcolor = 'rgb(237, 210, 7)'
        } else if (feature.properties.mag < 6) {
          fillcolor = 'rgb(216, 157, 8)'
        } else if (feature.properties.mag < 7) {
          fillcolor = 'rgb(162, 73, 0)'
        } else if (feature.properties.mag < 8) {
          fillcolor = 'rgb(163, 43, 0)' 
        } else {
          fillcolor = 'rgb(94, 0, 0)' 
        }
      
        var markerStyle = {

          fillColor: fillcolor,
          fillOpacity: 0.85,
          color: "black",
          opacity: 1,
          weight: 1,
          radius: markerSize(feature.properties.mag)
        };
        return L.circleMarker(latlng, markerStyle);
      }
    });


  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
};

//fiunction that determines markers size
function markerSize(magnitude) {
  return magnitude*5;
}

//function to create the map
function createMap(earthquakes) {

  // Define lightmap layer
  
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
});

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Light Map": lightmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [lightmap, earthquakes]
  });
  
  
  //add legend for the markers:
  function getColor(d) {
    return d < 1 ? 'rgb(1, 163, 12)' :
          d < 2  ? 'rgb(141, 226, 4)' :
          d < 3  ? 'rgb(197, 226, 4)' :
          d < 4  ? 'rgb(243, 247, 17)' :
          d < 5  ? 'rgb(237, 210, 7)' :
          d < 6  ? 'rgb(216, 157, 8)' :
          d < 7  ? 'rgb(162, 73, 0)' :
          d < 8  ? 'rgb(163, 43, 0)' :
                      'rgb(94, 0, 0)';
  }
  
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
          grades = [0, 1, 2, 3, 4, 5, 6, 7, 8],
          labels = ["0-1","1-2","2-3","3-4","4-5","5-6","6-7","7-8"," 8+"];

  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
        '<i style="background:' + getColor(grades[i]) + '"></i> ' +
         (labels[i] ? labels[i] + '<br>' : '+');
  }

  return div;
}
      
  legend.addTo(myMap);
  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}

