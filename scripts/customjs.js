$(document).ready(function($) {

  let mousePositionControl = new ol.control.MousePosition({
    coordinateFormat: ol.coordinate.createStringXY(4),
    projection: 'EPSG:4326',
    // comment the following two lines to have the mouse position
    // be placed within the map.
    className: 'custom-mouse-position',
    target: document.getElementById('mouse-position'),
    undefinedHTML: '&nbsp;'
  });

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
  polygonFeature.setId(123456);

  let london = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat([48.289975, 38.241352]))
  });

  let madrid = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat([48.290575, 38.241652]))
  });

  let pointStyle = new ol.style.Style({
    image: new ol.style.Icon( /** @type {olx.style.IconOptions} */ ({
      src: 'assets/energy(2).png',
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
      src: 'assets/energy(1).png',
      scale: 0.5
    }))
  }));

  madrid.setStyle(new ol.style.Style({
    image: new ol.style.Icon( /** @type {olx.style.IconOptions} */ ({
      src: 'assets/energy.png',
      scale: 0.5
    }))
  }));

  let lineStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: '#F05899',
      width: 3
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
        color: '#ff3399',
        width: 3
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

  let fileDir = 'assets/custom.json';
  let v = new ol.layer.Vector({
    source: new ol.source.Vector({
      format: new ol.format.GeoJSON(),
      url: 'assets/custom.json',
    })
  });

  let map = new ol.Map({
    target: 'map',
    controls: ol.control.defaults({
      attributionOptions: {
        collapsible: false
      }
    }).extend([mousePositionControl]),
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      }),
      new ol.layer.Group({
        title: 'Layers',
        layers: [
          new ol.layer.Group({
            title: 'JSON',
            visible: true,
            combine: true,
            layers: [
              v
            ]
          }),
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

  const allSource = [vectorSource, vectorSourcePoint, vectorSourcePolygon, vectorSourcePolyline];

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
      case 'save':
        let writer = new ol.format.GeoJSON({
          featureProjection: 'EPSG:3857'
        });
        for (variable of allSource) {
          let f = vectorSourcePolyline.getFeatures();
          let geojsonStr = writer.writeFeatures(vectorSourcePolyline.getFeatures());
          console.error(geojsonStr);
        }
        break;
      case 'select':
        interaction = new ol.interaction.Select();
        map.addInteraction(interaction);
        interaction.on('select', function(e) {
          callModal(e.target.getFeatures().getArray()[0]);

          // let element = e.target.getFeatures().getArray()[0];
          // var featureIndex = element.getId();
          // var featureTemp = element;
          // $('#ex1').modal();
          // let markup = '';
          // markup += `${markup}`;
          // const properties = element.getProperties();
          // let index = 0;
          // for (const property in properties) {
          //   if (property != 'geometry') {
          //     index++;
          //     // console.log(index);
          //     markup += `<div class='form-row'>` +
          //       `<div class='form-group col-md-6'>` +
          //       `<input class="form-control" id="inputModalKey${index}" placeholder="Key" type='text' value='${property}'/>` +
          //       `</div>` +
          //       `<div class='form-group col-md-6'>` +
          //       `<input class="form-control" id="inputModalValue${index}" placeholder="Value" type='text' value='${properties[property]}'/>` +
          //       `</div>` +
          //       `</div>`;
          //   }
          // }
          // markup += '';
          // $('#paragh').html(markup);
          // $('#addBtn').click(function() {
          //   console.log('Add button clicked!');
          //   console.log(this);
          //   // const innerIndex = $('[id^=inputModalKey]').length + 1;
          //   // console.log(innerIndex);
          //   // const html = `<div class='form-row'>` +
          //   //   `<div class='form-group col-md-6'>` +
          //   //   `<input class="form-control" id="inputModalKey${innerIndex}" placeholder="Key" type='text'/>` +
          //   //   `</div>` +
          //   //   `<div class='form-group col-md-6'>` +
          //   //   `<input class="form-control" id="inputModalValue${innerIndex}" placeholder="Value" type='text'/>` +
          //   //   `</div>` +
          //   //   `</div>`;
          //   // $('#paragh').append(html);
          // });
          // $('#saveBtn').click(function() {
          //   // let f = vectorSource.getFeatureById(featureIndex)
          //   let keys = [];
          //   $('[id^=inputModalKey]').each(function() {
          //     keys.push(this.value);
          //   });
          //   let values = [];
          //   $('[id^=inputModalValue]').each(function() {
          //     values.push(this.value);
          //   });
          //   for (let i = 0; i < keys.length; i++) {
          //     featureTemp.set(keys[i], values[i]);
          //   }
          //   switch ($('#sel1').val()) {
          //     case 'Tir 1':
          //       featureTemp.setStyle(pointStyle);
          //       break;
          //     case 'Tir 2':
          //       featureTemp.setStyle(tir2);
          //       break;
          //     case 'Tir 3':
          //       featureTemp.setStyle(tir3);
          //       break;
          //     case 'Tir 4':
          //       featureTemp.setStyle(tir4);
          //       break;
          //   }
          //   $.modal.close();
          // });
          // // e.target.getFeatures().forEach(function(element) {
          // //   // console.log(element.getProperties());
          // // });
        });
        break;
      case 'point':
        interaction = new ol.interaction.Draw({
          type: 'Point',
          source: vectorSourcePoint
        });
        map.addInteraction(interaction);
        break;
      case 'line':
        interaction = new ol.interaction.Draw({
          type: 'LineString',
          source: vectorSourcePolyline
        });
        map.addInteraction(interaction);
        break;
      case 'polygon':
        interaction = new ol.interaction.Draw({
          type: 'Polygon',
          source: vectorSourcePolygon
        });
        map.addInteraction(interaction);
        break;
      case 'modify':
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

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function callModal(element) {
  var featureIndex = element.getId();
  var featureTemp = element;

  let markup = `<div class="form-row">
    <div class="form-group col-md-12">
      <label for="modalShapeType">Type</label>
      <select class="form-control" id="sel1">
        <option>Tir 1</option>
        <option>Tir 2</option>
        <option>Tir 3</option>
        <option>Tir 4</option>
      </select>
    </div>
  </div>`;
  // markup += `${markup}`;
  const properties = element.getProperties();
  let index = 0;
  for (const property in properties) {
    if (property != 'geometry') {
      index++;
      // console.log(index);
      markup += `<div class='form-row'>` +
        `<div class='form-group col-md-6'>` +
        `<input class="form-control" id="inputModalKey${index}" placeholder="Key" type='text' value='${property}'/>` +
        `</div>` +
        `<div class='form-group col-md-6'>` +
        `<input class="form-control" id="inputModalValue${index}" placeholder="Value" type='text' value='${properties[property]}'/>` +
        `</div>` +
        `</div>`;
    }
  }
  markup += '';

  var modal = new tingle.modal({
    footer: true,
    stickyFooter: false,
    closeMethods: ['overlay', 'button', 'escape'],
    closeLabel: "Close",
    cssClass: ['custom-class-1', 'custom-class-2'],
    onOpen: function() {
      // console.log('modal open');
    },
    onClose: function() {
      // console.log('modal closed');
    },
    beforeClose: function() {
      // here's goes some logic
      // e.g. save content before closing the modal
      return true; // close the modal
      return false; // nothing happens
    }
  });

  // set content
  modal.setContent(markup);
  // add a button
  modal.addFooterBtn('ذخیره', 'tingle-btn tingle-btn--primary', function() {
    // here goes some logic
    console.log('save!!!!');
    // let f = vectorSource.getFeatureById(featureIndex)
    let keys = [];
    $('[id^=inputModalKey]').each(function() {
      keys.push(this.value);
    });
    let values = [];
    $('[id^=inputModalValue]').each(function() {
      values.push(this.value);
    });
    for (let i = 0; i < keys.length; i++) {
      featureTemp.set(keys[i], values[i]);
    }
    switch ($('#sel1').val()) {
      case 'Tir 1':
        featureTemp.setStyle(getStyle($('#sel1').val()));
        break;
      case 'Tir 2':
        featureTemp.setStyle(getStyle($('#sel1').val()));
        break;
      case 'Tir 3':
        featureTemp.setStyle(getStyle($('#sel1').val()));
        break;
      case 'Tir 4':
        featureTemp.setStyle(getStyle($('#sel1').val()));
        break;
    }
    modal.close();
  });
  // add another button
  modal.addFooterBtn('اضافه کردن', 'tingle-btn tingle-btn--danger', function() {
    console.log('added');
    const innerIndex = $('[id^=inputModalKey]').length + 1;
    console.log(innerIndex);
    const html = `<div class='form-row'>` +
      `<div class='form-group col-md-6'>` +
      `<input class="form-control" id="inputModalKey${innerIndex}" placeholder="Key" type='text'/>` +
      `</div>` +
      `<div class='form-group col-md-6'>` +
      `<input class="form-control" id="inputModalValue${innerIndex}" placeholder="Value" type='text'/>` +
      `</div>` +
      `</div>`;
    let oldHtml = modal.getContent();
    oldHtml.innerHTML += html;
  });
  // open modal
  modal.open();
}

function getStyle(object) {
  let style;
  switch (object) {
    case 'Tir 1':
      style = new ol.style.Style({
        image: new ol.style.Icon( /** @type {olx.style.IconOptions} */ ({
          src: 'assets/energy(1).png',
          scale: 0.5
        }))
      });
      break;
    case 'Tir 2':
      style = new ol.style.Style({
        image: new ol.style.Icon( /** @type {olx.style.IconOptions} */ ({
          src: 'assets/energy.png',
          scale: 0.5
        }))
      });
      break;
    case 'Tir 3':
      style = new ol.style.Style({
        image: new ol.style.Icon( /** @type {olx.style.IconOptions} */ ({
          src: 'assets/energy(2).png',
          scale: 0.5
        }))
      });
      break;
      case 'Tir 4':
        style = new ol.style.Style({
          image: new ol.style.Icon( /** @type {olx.style.IconOptions} */ ({
            src: 'assets/1.png',
            scale: 0.5
          }))
        });
        break;
  }
  return style;
}
