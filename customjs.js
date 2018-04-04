var pointFeature = new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([48.289375, 38.240552])));

var lineFeature = new ol.Feature(
    new ol.geom.LineString([
        ol.proj.fromLonLat([48.289375, 38.240852]),
        ol.proj.fromLonLat([48.289975, 38.241352])
    ])
);

var polygonFeature = new ol.Feature(
    new ol.geom.Polygon([
        [
            ol.proj.fromLonLat([48.288075, 38.241052]),
            ol.proj.fromLonLat([48.288075, 38.241352]),
            ol.proj.fromLonLat([48.289575, 38.241652]),
            ol.proj.fromLonLat([48.289375, 38.241052])
        ]
    ])
);

var london = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat([48.289975, 38.241352]))
});

var madrid = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat([48.290575, 38.241652]))
});

var pointStyle = new ol.style.Style({
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

var lineStyle = new ol.style.Style({
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

var polygonStyle = new ol.style.Style({
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
    'key' : 'value',
    'کلید' : 'مقدار'
});
polygonFeature.set('jsj', 'test');

var vectorSource = new ol.source.Vector({
    features: [pointFeature, lineFeature, polygonFeature]
});
var vectorLayer = new ol.layer.Vector({
    source: vectorSource
});
vectorLayer.set('selectable', true);

var vectorSource2 = new ol.source.Vector({
    features: []
});
var vectorLayer2 = new ol.layer.Vector({
    source: vectorSource2,
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

var map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        }), vectorLayer, vectorLayer2
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([48.289775, 38.241052]),
        zoom: 16
    })
});

// var button = $('#pan').button('toggle');
var interaction;
$('div.btn-group button').on('click', function(event) {
    var id = event.target.id;
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
            break;
        case "point":
            interaction = new ol.interaction.Draw({
                type: 'Point',
                source: vectorSource
            });
            map.addInteraction(interaction);
            break;
        case "line":
            interaction = new ol.interaction.Draw({
                type: 'LineString',
                source: vectorSource
            });
            map.addInteraction(interaction);
            break;
        case "polygon":
            interaction = new ol.interaction.Draw({
                type: 'Polygon',
                source: vectorSource2
            });
            map.addInteraction(interaction);
            console.log(vectorSource.getFeatures());
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

// const overlay = new ol.Overlay({
//     element: document.getElementById('popup-container'),
//     positioning: 'bottom-center',
//     offset: [0, -10],
//     autoPan: true
// });

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

// var highlightedFeatures = [],
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
//     var i;
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
