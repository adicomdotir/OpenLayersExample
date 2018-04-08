$(document).ready(function($) {
  let pointFeature = new ol.Feature(
    new ol.geom.Point(ol.proj.fromLonLat([48.289375, 38.240552]))
  );

  let lineFeature = new ol.Feature(
    new ol.geom.LineString([
      ol.proj.fromLonLat([48.289375, 38.240852]),
      ol.proj.fromLonLat([48.289975, 38.241352])
    ])
  );

  let polygonFeature = new ol.Feature(
    new ol.geom.Polygon([
      [
        ol.proj.fromLonLat([48.288075, 38.241052]),
        ol.proj.fromLonLat([48.288075, 38.241352]),
        ol.proj.fromLonLat([48.289575, 38.241652]),
        ol.proj.fromLonLat([48.289375, 38.241052])
      ]
    ])
  );

  let london = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat([48.289975, 38.241352]))
  });

  let madrid = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat([48.290575, 38.241652]))
  });

  let pointStyle = new ol.style.Style({
    image: new ol.style.Icon( /** @type {olx.style.IconOptions} */ ({
      src: '../energy(2).png',
      scale: 0.5
    }))
  });
  pointFeature.setStyle(pointStyle);
  pointFeature.setProperties({
    id: 1,
    'نوع': 'نقطه',
    'مکان': 'اردبیل'
  });

  london.setStyle(new ol.style.Style({
    image: new ol.style.Icon( /** @type {olx.style.IconOptions} */ ({
      src: '../energy(1).png',
      scale: 0.5
    }))
  }));

  madrid.setStyle(new ol.style.Style({
    image: new ol.style.Icon( /** @type {olx.style.IconOptions} */ ({
      src: '../energy.png',
      scale: 0.5
    }))
  }));

  let lineStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: '#F05899',
      width: 5
    })
  });
  lineFeature.setStyle(lineStyle);
  lineFeature.setProperties({
    id: 1,
    'نوع': 'خط',
    'مکان': 'اردبیل'
  });

  let polygonStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: '#55AA55',
      width: 2
    }),
    fill: new ol.style.Fill({
      color: '#55AA5525'
    })
  });
  polygonFeature.setStyle(polygonStyle);
  polygonFeature.setProperties({
    id: 1,
    'نوع': 'چند ضلعی',
    'مکان': 'اردبیل',
    'key': 'value',
    'کلید': 'مقدار'
  });
  polygonFeature.set('jsj', 'test');

  let vectorSource = new ol.source.Vector({
    features: [pointFeature, lineFeature, polygonFeature]
  });
  let vectorLayer = new ol.layer.Vector({
    source: vectorSource
  });
  vectorLayer.set('selectable', true);

  let vectorSourcePolygon = new ol.source.Vector({
    features: []
  });
  let vectorLayerPolygon = new ol.layer.Vector({
    source: vectorSourcePolygon,
    style: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: '#500A55',
        width: 2
      }),
      fill: new ol.style.Fill({
        color: '#500A5525'
      })
    })
  });

  let vectorSourcePolyline = new ol.source.Vector({
    features: []
  });
  let vectorLayerPolyline = new ol.layer.Vector({
    source: vectorSourcePolyline,
    style: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: '#0000BB',
        width: 2
      }),
    })
  });

  let vectorSourcePoint = new ol.source.Vector({
    features: []
  });
  let vectorLayerPoint = new ol.layer.Vector({
    source: vectorSourcePoint,
    style: new ol.style.Style({
      image: new ol.style.Circle({
        fill: new ol.style.Fill({
          color: 'rgba(255, 0, 0, 0.5)'
        }),
        stroke: new ol.style.Stroke({
          width: 1,
          color: 'rgba(255, 0, 0, 1)'
        }),
        radius: 5
      })
    })
  });

  let map = new ol.Map({
    target: 'map',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      }),
      new ol.layer.Group({
        title: 'Layers',
        layers: [
          new ol.layer.Group({
            title: 'Points',
            visible: true,
            combine: true,
            layers: [
              vectorLayerPoint
            ]
          }),
          new ol.layer.Group({
            title: 'Polylines',
            visible: true,
            combine: true,
            layers: [
              vectorLayerPolyline
            ]
          }),
          new ol.layer.Group({
            title: 'Polygons',
            visible: true,
            combine: true,
            layers: [
              vectorLayerPolygon
            ]
          }),
          new ol.layer.Group({
            title: 'Default',
            combine: true,
            visible: true,
            layers: [
              vectorLayer
            ]
          })
        ]
      })
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([48.289775, 38.241052]),
      zoom: 16
    })
  });

  // let button = $('#pan').button('toggle');
  let interaction;
  $('div.btn-group button').on('click', function(event) {
    let id = event.target.id;
    // Toggle buttons
    // button.button('toggle');
    // button = $('#' + id).button('toggle');
    // Remove previous interaction
    map.removeInteraction(interaction);
    // Update active interaction
    switch (event.target.id) {
      case "select":
        interaction = new ol.interaction.Select();
        map.addInteraction(interaction);
        interaction.on('select', function(e) {
          e.target.getFeatures().forEach(function(element) {
            console.log(element.getProperties());
            jQuery.noConflict();
            $('#myModal').modal('show');
            // let markup = '';
            // markup += `${markup && '<hr>'}<table>`;
            // const properties = element.getProperties();
            // for (const property in properties) {
            //   if (property != 'geometry') {
            //     markup += `<tr><th>${property}</th><td>${properties[property]}</td></tr>`;
            //   }
            // }
            // markup += '</table>';
            // if (markup) {
            //   document.getElementById('popup-content').innerHTML = markup;
            //   overlay.setPosition(e.coordinate);
            // } else {
            //   overlay.setPosition();
            // }
          });
        });
        break;
      case "point":
        interaction = new ol.interaction.Draw({
          type: 'Point',
          source: vectorSourcePoint
        });
        map.addInteraction(interaction);
        break;
      case "line":
        interaction = new ol.interaction.Draw({
          type: 'LineString',
          source: vectorSourcePolyline
        });
        map.addInteraction(interaction);
        break;
      case "polygon":
        interaction = new ol.interaction.Draw({
          type: 'Polygon',
          source: vectorSourcePolygon
        });
        map.addInteraction(interaction);
        break;
      case "modify":
        interaction = new ol.interaction.Modify({
          // features: new ol.Collection(vectorLayer.getSource().getFeatures())
          features: interaction.getFeatures()
        });
        map.addInteraction(interaction);
        break;
      default:
        break;
    }
  });

  map.addControl(new ol.control.ScaleLine({
    units: 'metric'
  }));
  let layerSwitcher = new ol.control.LayerSwitcher({
    tipLabel: 'button' // Optional label for button
  });
  map.addControl(layerSwitcher);

  // const overlay = new ol.Overlay({
  //     element: document.getElementById('popup-container'),
  //     positioning: 'bottom-center',
  //     offset: [0, -10],
  //     autoPan: true
  // });
  //
  // map.addOverlay(overlay);
  // overlay.getElement().addEventListener('click', function() {
  //     overlay.setPosition();
  // });

  // map.on('click', function(e) {
  //     let markup = '';
  //     map.forEachFeatureAtPixel(e.pixel, function(feature) {
  //         markup += `${markup && '<hr>'}<table>`;
  //         const properties = feature.getProperties();
  //         for (const property in properties) {
  //             if (property != 'geometry') {
  //                 markup += `<tr><th>${property}</th><td>${properties[property]}</td></tr>`;
  //             }
  //         }
  //         markup += '</table>';
  //     }, { hitTolerance: 1 });
  //     if (markup) {
  //         document.getElementById('popup-content').innerHTML = markup;
  //         overlay.setPosition(e.coordinate);
  //     } else {
  //         overlay.setPosition();
  //     }
  // });

  // let highlightedFeatures = [],
  //     selectStyle = new ol.style.Style({
  //         stroke: new ol.style.Stroke({
  //             color: '#0d47a1',
  //             width: 2
  //         }),
  //         image: new ol.style.Circle({
  //             radius: 5.5,
  //             stroke: new ol.style.Stroke({
  //                 color: '#0d47a1',
  //                 width: 2
  //             })
  //         })
  //     });

  // map.on('click', function(e) {
  //     let i;
  //     for (i = 0; i < highlightedFeatures.length; i++) {
  //         switch (highlightedFeatures[i].getGeometry().getType()) {
  //             case 'Point':
  //                 highlightedFeatures[i].setStyle(pointStyle);
  //                 break;
  //             case 'LineString':
  //                 highlightedFeatures[i].setStyle(lineStyle);
  //                 break;
  //             case 'Polygon':
  //                 highlightedFeatures[i].setStyle(polygonStyle);
  //                 break;
  //         }
  //     }
  //     highlightedFeatures = [];
  //     map.forEachFeatureAtPixel(e.pixel, function(feature) {
  //         feature.setStyle(selectStyle);
  //         highlightedFeatures.push(feature);
  //     });
  // });

});
