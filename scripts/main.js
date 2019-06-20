const bg_map = new ol.layer.Tile({
  source: new ol.source.XYZ({
    url:'http://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
  })
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

const image = new ol.style.Circle({
  fill: new ol.style.Fill({ color: [158, 202, 225,0.7] }),
  radius: 7,
  stroke: new ol.style.Stroke({ color: 'black', width: 1 })
});

// const popup = new ol.Overlay({
//   // element : "pleb", 
//   positioning: 'bottom-center',
// });
// map.addOverlay(popup);

// map.on('click', function (evt) {
//   const prettyCoord = ol.coordinate.toStringHDMS(ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326'), 2);
//   popup.show(evt.coordinate, '<div><h2>Coordinates</h2><p>' + prettyCoord + '</p></div>');
// });

const addJson = () => {
  action()
}

const action = async () => {
  const response = await fetch(`https://gs-planning-proto.s3-eu-west-1.amazonaws.com/london_test_area_planning.geojson` , {
   });
  const planningJson = await response.json();
  console.log(planningJson)
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



