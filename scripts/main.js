const bg_map = new ol.layer.Tile({
  source: new ol.source.XYZ({
    url:'http://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
  })
});


const image = new ol.style.Circle({
  fill: new ol.style.Fill({ color: [158, 202, 225,0.7] }),
  radius: 7,
  stroke: new ol.style.Stroke({ color: 'black', width: 0.2 })
});

const map = new ol.Map({
  target: 'map',
  layers: [
    bg_map
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([-0.110452, 51.503433]),
    zoom: 19
  })
});


const popup = new ol.Overlay({
  element: document.getElementById('popup')
});

map.addOverlay(popup);

let content = document.getElementById('popup-content');



map.on("click", function (e) {
  map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
    console.log(feature.values_)
    const element = popup.getElement();
    const coordinate = e.coordinate;
    content.innerHTML = '<p>some jazz:</p><code>';
    popup.setPosition(coordinate);
    // and add it to the map
    // map.addOverlay(overlay);
    // return feature.values_
  })
});

const addJson = () => {
  action()
}

const action = async () => {
  const response = await fetch(`https://gs-planning-proto.s3-eu-west-1.amazonaws.com/london_test_area_planning.geojson` , {
   });
  const planningJson = await response.json();
  const vectorSource = new ol.source.Vector({
    features: (new ol.format.GeoJSON({
      featureProjection: "EPSG:3857"
    })).readFeatures(planningJson),
    formatOptions: {
      xy: false
    }
  });
  const vectorLayer = new ol.layer.Vector({
    source: vectorSource,
    style: new ol.style.Style({
      image: image
    })
  });
  map.addLayer(vectorLayer);
};



