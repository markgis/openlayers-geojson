const bg_map = new ol.layer.Tile({
  source: new ol.source.XYZ({
    url:'http://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
  })
});

const iconStyle = new ol.style.Style({
  image: new ol.style.Icon(/** @type {module:ol/style/Icon~Options} */({
    anchor: [0.5, 46],
    anchorXUnits: 'fraction',
    anchorYUnits: 'pixels',
    src: 'styles/marker-icon.png'
  }))
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
    const element = popup.getElement();
    const coordinate = e.coordinate;
    content.innerHTML = `<header-bar><h3>${feature.values_.Heading}</h3></header-bar><p>${feature.values_.SchemeDescription}</p>`;
    popup.setPosition(coordinate);
  })

  const closer = document.getElementById('popup-closer');
  closer.onclick = function() {
    popup.setPosition(undefined);
    closer.blur();
    return false;
  };
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
  const vectorLayer = new ol.layer.Vector({ source: vectorSource });
  vectorLayer.setStyle(iconStyle)
  map.addLayer(vectorLayer);
};
