import { expect } from 'chai';

import { readFileSync } from 'fs';

import { Extent } from '../../../../assets/src/modules/utils/Extent.js';
import { LayersConfig } from '../../../../assets/src/modules/config/Layer.js';
import { LayerGeographicBoundingBoxConfig, LayerBoundingBoxConfig, LayerStyleConfig, LayerTreeItemConfig, LayerTreeGroupConfig, LayerTreeLayerConfig, buildLayerTreeConfig } from '../../../../assets/src/modules/config/LayerTree.js';

describe('LayerGeographicBoundingBoxConfig', function () {
    it('Valid', function () {
        const gbb = new LayerGeographicBoundingBoxConfig(-71.63, 41.75, -70.78, 42.9);
        expect(gbb).to.be.instanceOf(Extent)
        expect(gbb).to.have.lengthOf(4)
        expect(gbb[0]).to.be.eq(-71.63)
        expect(gbb[1]).to.be.eq(41.75)
        expect(gbb[2]).to.be.eq(-70.78)
        expect(gbb[3]).to.be.eq(42.9)
        expect(gbb.xmin).to.be.eq(-71.63)
        expect(gbb.ymin).to.be.eq(41.75)
        expect(gbb.xmax).to.be.eq(-70.78)
        expect(gbb.ymax).to.be.eq(42.9)
        expect(gbb.west).to.be.eq(-71.63)
        expect(gbb.south).to.be.eq(41.75)
        expect(gbb.east).to.be.eq(-70.78)
        expect(gbb.north).to.be.eq(42.9)
    })
})

describe('LayerBoundingBoxConfig', function () {
    it('Valid', function () {
        const gbb = new LayerBoundingBoxConfig('CRS:84', [-71.63, 41.75, -70.78, 42.9]);
        expect(gbb).to.be.instanceOf(Extent)
        expect(gbb.crs).to.be.eq('CRS:84')
        expect(gbb).to.have.lengthOf(4)
        expect(gbb[0]).to.be.eq(-71.63)
        expect(gbb[1]).to.be.eq(41.75)
        expect(gbb[2]).to.be.eq(-70.78)
        expect(gbb[3]).to.be.eq(42.9)
        expect(gbb.xmin).to.be.eq(-71.63)
        expect(gbb.ymin).to.be.eq(41.75)
        expect(gbb.xmax).to.be.eq(-70.78)
        expect(gbb.ymax).to.be.eq(42.9)
    })
})

describe('LayerStyleConfig', function () {
    it('Valid', function () {
        const style = new LayerStyleConfig('default', 'Défaut');
        expect(style.wmsName).to.be.eq('default')
        expect(style.wmsTitle).to.be.eq('Défaut')
    })
    it('Empty', function () {
        const style = new LayerStyleConfig('', '');
        expect(style.wmsName).to.be.eq('')
        expect(style.wmsTitle).to.be.eq('')
    })
})

describe('LayerTreeItemConfig', function () {
    it('Valid', function () {
        const item = new LayerTreeItemConfig('Roads and Rivers', 'test', 1, {
            "Name": "ROADS_RIVERS",
            "Title": "Roads and Rivers",
            "CRS": [
              "EPSG:26986",
              "CRS:84"
            ],
            "EX_GeographicBoundingBox": [
              -71.63,
              41.75,
              -70.78,
              42.9
            ],
            "BoundingBox": [
              {
                "crs": "CRS:84",
                "extent": [
                  -71.63,
                  41.75,
                  -70.78,
                  42.9
                ],
                "res": [
                  0.01,
                  0.01
                ]
              },
              {
                "crs": "EPSG:26986",
                "extent": [
                  189000,
                  834000,
                  285000,
                  962000
                ],
                "res": [
                  1,
                  1
                ]
              }
            ],
            "Attribution": {
              "Title": "State College University",
              "OnlineResource": "http://www.university.edu/",
              "LogoURL": {
                "Format": "image/gif",
                "OnlineResource": "http://www.university.edu/icons/logo.gif",
                "size": [
                  100,
                  100
                ]
              }
            },
            "Identifier": [
              "123456"
            ],
            "FeatureListURL": [
              {
                "Format": "XML",
                "OnlineResource": "http://www.university.edu/data/roads_rivers.gml"
              }
            ],
            "Style": [
              {
                "Name": "USGS",
                "Title": "USGS Topo Map Style",
                "Abstract": "Features are shown in a style like that used in USGS topographic maps.",
                "LegendURL": [
                  {
                    "Format": "image/gif",
                    "OnlineResource": "http://www.university.edu/legends/usgs.gif",
                    "size": [
                      72,
                      72
                    ]
                  }
                ],
                "StyleSheetURL": {
                  "Format": "text/xsl",
                  "OnlineResource": "http://www.university.edu/stylesheets/usgs.xsl"
                }
              }
            ],
            "MinScaleDenominator": 1000,
            "MaxScaleDenominator": 250000
        })
        expect(item.name).to.be.eq('Roads and Rivers')
        expect(item.type).to.be.eq('test')
        expect(item.level).to.be.eq(1)
        expect(item.wmsName).to.be.eq('ROADS_RIVERS')
        expect(item.wmsTitle).to.be.eq('Roads and Rivers')
        expect(item.wmsGeographicBoundingBox).to.be.instanceOf(LayerGeographicBoundingBoxConfig)
        expect(item.wmsGeographicBoundingBox.west).to.be.eq(-71.63)
        expect(item.wmsGeographicBoundingBox.south).to.be.eq(41.75)
        expect(item.wmsGeographicBoundingBox.east).to.be.eq(-70.78)
        expect(item.wmsGeographicBoundingBox.north).to.be.eq(42.9)
        expect(item.wmsBoundingBoxes).to.have.lengthOf(2)
        expect(item.wmsBoundingBoxes[0]).to.be.instanceOf(LayerBoundingBoxConfig)
        expect(item.wmsBoundingBoxes[0].crs).to.be.eq('CRS:84')
        expect(item.wmsBoundingBoxes[0]).to.have.lengthOf(4)
        expect(item.wmsBoundingBoxes[0].xmin).to.be.eq(-71.63)
        expect(item.wmsBoundingBoxes[0].ymin).to.be.eq(41.75)
        expect(item.wmsBoundingBoxes[0].xmax).to.be.eq(-70.78)
        expect(item.wmsBoundingBoxes[0].ymax).to.be.eq(42.9)
        expect(item.layerConfig).to.be.null;
    })
})

describe('buildLayerTreeConfig', function () {
    it('Valid', function () {
        const capabilities = JSON.parse(readFileSync('./data/montpellier-capabilities.json', 'utf8'));
        expect(capabilities).to.not.be.undefined
        expect(capabilities.Capability).to.not.be.undefined
        const config = JSON.parse(readFileSync('./data/montpellier-config.json', 'utf8'));
        expect(config).to.not.be.undefined

        const layers = new LayersConfig(config.layers);

        const root = buildLayerTreeConfig(capabilities.Capability.Layer, layers);
        expect(root).to.be.instanceOf(LayerTreeGroupConfig)
        expect(root.name).to.be.eq('root')
        expect(root.type).to.be.eq('group')
        expect(root.level).to.be.eq(0)
        expect(root.wmsName).to.be.eq('Montpellier-Transports')
        expect(root.wmsTitle).to.be.eq('Montpellier - Transports')
        expect(root.wmsAbstract).to.be.eq('Demo project with bus and tramway lines in Montpellier, France.\nData is licensed under ODbl, OpenStreetMap contributors')
        expect(root.wmsGeographicBoundingBox).to.be.instanceOf(LayerGeographicBoundingBoxConfig)
        expect(root.wmsGeographicBoundingBox.west).to.be.eq(43.542477)
        expect(root.wmsGeographicBoundingBox.south).to.be.eq(3.746034)
        expect(root.wmsGeographicBoundingBox.east).to.be.eq(43.672144)
        expect(root.wmsGeographicBoundingBox.north).to.be.eq(4.01689)
        expect(root.wmsBoundingBoxes).to.be.instanceOf(Array)
        expect(root.wmsBoundingBoxes).to.have.length(3)
        expect(root.wmsBoundingBoxes[0]).to.be.instanceOf(LayerBoundingBoxConfig)
        expect(root.wmsBoundingBoxes[0].crs).to.be.eq('EPSG:3857')
        expect(root.wmsBoundingBoxes[0].xmin).to.be.eq(417006.613)
        expect(root.wmsBoundingBoxes[0].ymin).to.be.eq(5394910.34)
        expect(root.wmsBoundingBoxes[0].xmax).to.be.eq(447158.049)
        expect(root.wmsBoundingBoxes[0].ymax).to.be.eq(5414844.995)
        expect(root.layerConfig).to.be.null;
        expect(root.childrenCount).to.be.eq(7)

        const edition = root.children[0];
        expect(edition).to.be.instanceOf(LayerTreeGroupConfig)
        expect(edition.name).to.be.eq('Edition')
        expect(edition.type).to.be.eq('group')
        expect(edition.level).to.be.eq(1)
        expect(edition.wmsName).to.be.eq('Edition')
        expect(edition.wmsTitle).to.be.eq('Edition')
        expect(edition.wmsAbstract).to.be.null
        expect(edition.layerConfig).to.not.be.null;
        expect(edition.childrenCount).to.be.eq(3)

        const transports = root.children[1];
        expect(transports).to.be.instanceOf(LayerTreeGroupConfig)

        const bus = transports.children[0];
        expect(bus).to.be.instanceOf(LayerTreeGroupConfig)
        expect(bus.name).to.be.eq('Bus')
        expect(bus.type).to.be.eq('group')
        expect(bus.level).to.be.eq(2)
        expect(bus.wmsName).to.be.eq('Bus')
        expect(bus.wmsTitle).to.be.eq('Bus')
        expect(bus.wmsAbstract).to.be.null
        expect(bus.layerConfig).to.not.be.null;
        expect(bus.childrenCount).to.be.eq(2)
        expect(bus.wmsMinScaleDenominator).to.be.eq(-1)
        expect(bus.wmsMaxScaleDenominator).to.be.eq(-1)

        const busStops = bus.children[0];
        expect(busStops).to.be.instanceOf(LayerTreeLayerConfig)
        expect(busStops.name).to.be.eq('bus_stops')
        expect(busStops.type).to.be.eq('layer')
        expect(busStops.level).to.be.eq(3)
        expect(busStops.wmsName).to.be.eq('bus_stops')
        expect(busStops.wmsTitle).to.be.eq('bus_stops')
        expect(busStops.wmsAbstract).to.be.null
        expect(busStops.layerConfig).to.not.be.null
        expect(busStops.wmsMinScaleDenominator).to.be.eq(0)
        expect(busStops.wmsMaxScaleDenominator).to.be.eq(15000)

        const sousquartiers = root.children[3];
        expect(sousquartiers).to.be.instanceOf(LayerTreeLayerConfig)
        expect(sousquartiers.name).to.be.eq('SousQuartiers')
        expect(sousquartiers.type).to.be.eq('layer')
        expect(sousquartiers.level).to.be.eq(1)
        expect(sousquartiers.wmsName).to.be.eq('SousQuartiers')
        expect(sousquartiers.wmsTitle).to.be.eq('SousQuartiers')
        expect(sousquartiers.wmsAbstract).to.be.null
        expect(sousquartiers.layerConfig).to.not.be.null;
        expect(sousquartiers.wmsStyles).to.be.instanceOf(Array)
        expect(sousquartiers.wmsStyles).to.have.length(1)
        expect(sousquartiers.wmsStyles[0].wmsName).to.be.eq('default')
        expect(sousquartiers.wmsStyles[0].wmsTitle).to.be.eq('default')
        expect(sousquartiers.wmsAttribution).to.be.null
        expect(sousquartiers.wmsMinScaleDenominator).to.be.eq(-1)
        expect(sousquartiers.wmsMaxScaleDenominator).to.be.eq(-1)

        const rootGetChildren = root.getChildren()
        expect(rootGetChildren.next().value).to.be.eq(edition)
        const child2 = rootGetChildren.next().value;
        expect(child2).to.be.instanceOf(LayerTreeGroupConfig)
        expect(child2.name).to.be.eq('datalayers')
        const child3 = rootGetChildren.next().value;
        expect(child3).to.be.instanceOf(LayerTreeLayerConfig)
        expect(child3.name).to.be.eq('donnes_sociodemo_sous_quartiers')
        expect(rootGetChildren.next().value).to.be.eq(sousquartiers)
        const child5 = rootGetChildren.next().value;
        expect(child5).to.be.instanceOf(LayerTreeLayerConfig)
        expect(child5.name).to.be.eq('Quartiers')
        const child6 = rootGetChildren.next().value;
        expect(child6).to.be.instanceOf(LayerTreeGroupConfig)
        expect(child6.name).to.be.eq('Overview')
        const child7 = rootGetChildren.next().value;
        expect(child7).to.be.instanceOf(LayerTreeGroupConfig)
        expect(child7.name).to.be.eq('Hidden')
    })
})
