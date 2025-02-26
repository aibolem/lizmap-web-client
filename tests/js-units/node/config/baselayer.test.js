import { expect } from 'chai';

import { readFileSync } from 'fs';

import { ValidationError, ConversionError } from '../../../../assets/src/modules/Errors.js';
import { AttributionConfig } from '../../../../assets/src/modules/config/Attribution.js';
import { LayerConfig, LayersConfig } from '../../../../assets/src/modules/config/Layer.js';
import { LayerTreeGroupConfig, buildLayerTreeConfig } from '../../../../assets/src/modules/config/LayerTree.js';
import { BaseLayerConfig, EmptyBaseLayerConfig, XyzBaseLayerConfig, BingBaseLayerConfig, WmtsBaseLayerConfig, BaseLayersConfig } from '../../../../assets/src/modules/config/BaseLayer.js';

describe('BaseLayerConfig', function () {
    it('simple', function () {
        const baselayer = new BaseLayerConfig('type', 'name', {'title': 'title'})
        expect(baselayer).to.be.instanceOf(BaseLayerConfig)
        expect(baselayer.type).to.be.eq('type')
        expect(baselayer.name).to.be.eq('name')
        expect(baselayer.title).to.be.eq('title')
        expect(baselayer.hasKey).to.be.false
        expect(baselayer.key).to.be.null
        expect(baselayer.hasAttribution).to.be.false
        expect(baselayer.attribution).to.be.null
    })

    it('simple with key', function () {
        const blWithKey = new BaseLayerConfig('type', 'name', {'title': 'title', 'key': 'key'})
        expect(blWithKey).to.be.instanceOf(BaseLayerConfig)
        expect(blWithKey.type).to.be.eq('type')
        expect(blWithKey.name).to.be.eq('name')
        expect(blWithKey.title).to.be.eq('title')
        expect(blWithKey.hasKey).to.be.true
        expect(blWithKey.key).to.not.be.null
        expect(blWithKey.key).to.be.eq('key')
        expect(blWithKey.hasAttribution).to.be.false
        expect(blWithKey.attribution).to.be.null

        const blWithEmptyKey = new BaseLayerConfig('type', 'name', {'title': 'title', 'key': ''})
        expect(blWithEmptyKey).to.be.instanceOf(BaseLayerConfig)
        expect(blWithEmptyKey.type).to.be.eq('type')
        expect(blWithEmptyKey.name).to.be.eq('name')
        expect(blWithEmptyKey.title).to.be.eq('title')
        expect(blWithEmptyKey.hasKey).to.be.false
        expect(blWithEmptyKey.key).to.be.null
        expect(blWithEmptyKey.hasAttribution).to.be.false
        expect(blWithEmptyKey.attribution).to.be.null
    })

    it('simple with attribution', function () {
        const blWithAttribution = new BaseLayerConfig('type', 'name', {'title': 'title', 'attribution': {'title': 'title', 'url': 'url'}})
        expect(blWithAttribution).to.be.instanceOf(BaseLayerConfig)
        expect(blWithAttribution.type).to.be.eq('type')
        expect(blWithAttribution.name).to.be.eq('name')
        expect(blWithAttribution.title).to.be.eq('title')
        expect(blWithAttribution.hasKey).to.be.false
        expect(blWithAttribution.key).to.be.null
        expect(blWithAttribution.hasAttribution).to.be.true
        expect(blWithAttribution.attribution).to.be.instanceOf(AttributionConfig)
        expect(blWithAttribution.attribution.title).to.be.eq('title')
        expect(blWithAttribution.attribution.url).to.be.eq('url')

        const blWithEmptyAttribution = new BaseLayerConfig('type', 'name', {'title': 'title', 'attribution': {}})
        expect(blWithEmptyAttribution).to.be.instanceOf(BaseLayerConfig)
        expect(blWithEmptyAttribution.type).to.be.eq('type')
        expect(blWithEmptyAttribution.name).to.be.eq('name')
        expect(blWithEmptyAttribution.title).to.be.eq('title')
        expect(blWithEmptyAttribution.hasKey).to.be.false
        expect(blWithEmptyAttribution.key).to.be.null
        expect(blWithEmptyAttribution.hasAttribution).to.be.false
        expect(blWithEmptyAttribution.attribution).to.be.null
    })

    it('Validation Error: title mandatory', function () {
        try {
            new BaseLayerConfig('type', 'name', {})
        } catch (error) {
            expect(error.name).to.be.eq('ValidationError')
            expect(error.message).to.be.eq('The cfg object has not enough properties compared to required!\n- The cfg properties: \n- The required properties: title')
            expect(error).to.be.instanceOf(ValidationError)
        }
    })

    it('Validation Error: invalid attribution', function () {
        try {
            new BaseLayerConfig('type', 'name', {'title': 'title', 'attribution': {'name': 'name'}})
        } catch (error) {
            expect(error.name).to.be.eq('ValidationError')
            expect(error.message).to.be.eq('The cfg object has not enough properties compared to required!\n- The cfg properties: name\n- The required properties: title,url')
            expect(error).to.be.instanceOf(ValidationError)
        }
    })
})

describe('WmtsBaseLayerConfig', function () {
    it('Valid', function () {
        const ignPhotoBl = new WmtsBaseLayerConfig("ign-photo", {
            "type": "wmts",
            "title": "IGN Orthophoto",
            "url": "https://wxs.ign.fr/ortho/geoportail/wmts",
            "layer": "ORTHOIMAGERY.ORTHOPHOTOS",
            "format": "image/jpeg",
            "style": "normal",
            "matrixSet": "PM",
            "crs": "EPSG:3857",
            "numZoomLevels": 22,
            "attribution": {
                "title": "Institut national de l'information géographique et forestière",
                "url": "https://www.ign.fr/"
            }
        })
        expect(ignPhotoBl).to.be.instanceOf(BaseLayerConfig)
        expect(ignPhotoBl.type).to.be.eq('wmts')
        expect(ignPhotoBl).to.be.instanceOf(WmtsBaseLayerConfig)
        expect(ignPhotoBl.name).to.be.eq('ign-photo')
        expect(ignPhotoBl.title).to.be.eq('IGN Orthophoto')
        expect(ignPhotoBl.layerConfig).to.be.null
        expect(ignPhotoBl.url).to.be.eq('https://wxs.ign.fr/ortho/geoportail/wmts')
        expect(ignPhotoBl.hasKey).to.be.false
        expect(ignPhotoBl.key).to.be.null
        expect(ignPhotoBl.layer).to.be.eq('ORTHOIMAGERY.ORTHOPHOTOS')
        expect(ignPhotoBl.format).to.be.eq('image/jpeg')
        expect(ignPhotoBl.style).to.be.eq('normal')
        expect(ignPhotoBl.matrixSet).to.be.eq('PM')
        expect(ignPhotoBl.crs).to.be.eq('EPSG:3857')
        expect(ignPhotoBl.numZoomLevels).to.be.eq(22)
        expect(ignPhotoBl.hasAttribution).to.be.true
        expect(ignPhotoBl.attribution).to.be.instanceOf(AttributionConfig)
        expect(ignPhotoBl.attribution.title).to.be.eq('Institut national de l\'information géographique et forestière')
        expect(ignPhotoBl.attribution.url).to.be.eq('https://www.ign.fr/')


        const lizmapBl = new WmtsBaseLayerConfig("Quartiers", {
            "type": "wmts",
            "title": "Quartiers",
            "url": "http://localhost:8130/index.php/lizmap/service?repository=testsrepository&project=cache&SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetCapabilities",
            "layer": "Quartiers",
            "format": "image/png",
            "style": "default",
            "matrixSet": "EPSG:3857",
            "crs": "EPSG:3857",
            "numZoomLevels": 16
        })
        expect(lizmapBl).to.be.instanceOf(BaseLayerConfig)
        expect(lizmapBl.type).to.be.eq('wmts')
        expect(lizmapBl).to.be.instanceOf(WmtsBaseLayerConfig)
        expect(lizmapBl.name).to.be.eq('Quartiers')
        expect(lizmapBl.title).to.be.eq('Quartiers')
        expect(lizmapBl.layerConfig).to.be.null
        expect(lizmapBl.url).to.be.eq('http://localhost:8130/index.php/lizmap/service?repository=testsrepository&project=cache')
        expect(lizmapBl.hasKey).to.be.false
        expect(lizmapBl.key).to.be.null
        expect(lizmapBl.layer).to.be.eq('Quartiers')
        expect(lizmapBl.format).to.be.eq('image/png')
        expect(lizmapBl.style).to.be.eq('default')
        expect(lizmapBl.matrixSet).to.be.eq('EPSG:3857')
        expect(lizmapBl.crs).to.be.eq('EPSG:3857')
        expect(lizmapBl.numZoomLevels).to.be.eq(16)
        expect(lizmapBl.hasAttribution).to.be.false
        expect(lizmapBl.attribution).to.be.null
    })
})

describe('BaseLayersConfig', function () {
    it('From Options', function () {
        const options = {
            emptyBaselayer: 'True',
            osmMapnik: 'True',
            osmStamenToner: 'True',
            openTopoMap: 'True',
            osmCyclemap: 'True',
            OCMKey: 'osm-cyclemap-key',
            googleStreets: 'True',
            googleSatellite: 'True',
            googleHybrid: 'True',
            googleTerrain: 'True',
            bingStreets: 'True',
            bingSatellite: 'True',
            bingHybrid: 'True',
            bingKey: 'bing-key',
            ignTerrain: 'True',
            ignStreets: 'True',
            ignKey: 'ign-key',
            ignSatellite: 'True',
            ignCadastral: 'True',
            startupBaselayer: 'osm-mapnik'
        };
        const baseLayers = new BaseLayersConfig({}, options, new LayersConfig({}))

        expect(baseLayers.startupBaselayerName).to.be.eq('osm-mapnik')

        const baseLayerNames = baseLayers.baseLayerNames;
        expect(baseLayerNames.length).to.be.eq(16);
        expect(baseLayerNames).to.include('empty')
        expect(baseLayerNames).to.include('osm-mapnik')
        expect(baseLayerNames).to.include('osm-stamen-toner')
        expect(baseLayerNames).to.include('open-topo-map')
        expect(baseLayerNames).to.include('osm-cyclemap')
        expect(baseLayerNames).to.include('google-street')
        expect(baseLayerNames).to.include('google-satellite')
        expect(baseLayerNames).to.include('google-hybrid')
        expect(baseLayerNames).to.include('google-terrain')
        expect(baseLayerNames).to.include('bing-road')
        expect(baseLayerNames).to.include('bing-aerial')
        expect(baseLayerNames).to.include('bing-hybrid')
        expect(baseLayerNames).to.include('ign-scan')
        expect(baseLayerNames).to.include('ign-plan')
        expect(baseLayerNames).to.include('ign-photo')
        expect(baseLayerNames).to.include('ign-cadastral')

        const emptyBl = baseLayers.getBaseLayerConfigByBaseLayerName('empty')
        expect(emptyBl).to.be.instanceOf(BaseLayerConfig)
        expect(emptyBl.type).to.be.eq('empty')
        expect(emptyBl).to.be.instanceOf(EmptyBaseLayerConfig)
        expect(emptyBl.name).to.be.eq('empty')
        expect(emptyBl.title).to.be.eq('empty')
        expect(emptyBl.layerConfig).to.be.null

        const osmMapnikBl = baseLayers.getBaseLayerConfigByBaseLayerName('osm-mapnik')
        expect(osmMapnikBl).to.be.instanceOf(BaseLayerConfig)
        expect(osmMapnikBl.type).to.be.eq('xyz')
        expect(osmMapnikBl).to.be.instanceOf(XyzBaseLayerConfig)
        expect(osmMapnikBl.name).to.be.eq('osm-mapnik')
        expect(osmMapnikBl.title).to.be.eq('OpenStreetMap')
        expect(osmMapnikBl.layerConfig).to.be.null
        expect(osmMapnikBl.url).to.be.eq('http://tile.openstreetmap.org/{z}/{x}/{y}.png')
        expect(osmMapnikBl.hasKey).to.be.false
        expect(osmMapnikBl.key).to.be.null
        expect(osmMapnikBl.crs).to.be.eq('EPSG:3857')
        expect(osmMapnikBl.zmin).to.be.eq(0)
        expect(osmMapnikBl.zmax).to.be.eq(19)
        expect(osmMapnikBl.hasAttribution).to.be.true
        expect(osmMapnikBl.attribution).to.be.instanceOf(AttributionConfig)
        expect(osmMapnikBl.attribution.title).to.be.eq('© OpenStreetMap contributors, CC-BY-SA')
        expect(osmMapnikBl.attribution.url).to.be.eq('https://www.openstreetmap.org/copyright')

        const osmCycleBl = baseLayers.getBaseLayerConfigByBaseLayerName('osm-cyclemap')
        expect(osmCycleBl).to.be.instanceOf(BaseLayerConfig)
        expect(osmCycleBl.type).to.be.eq('xyz')
        expect(osmCycleBl).to.be.instanceOf(XyzBaseLayerConfig)
        expect(osmCycleBl.name).to.be.eq('osm-cyclemap')
        expect(osmCycleBl.title).to.be.eq('OSM CycleMap')
        expect(osmCycleBl.layerConfig).to.be.null
        expect(osmCycleBl.url).to.be.eq('https://{a-c}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey={key}')
        expect(osmCycleBl.hasKey).to.be.true
        expect(osmCycleBl.key).to.not.be.null
        expect(osmCycleBl.key).to.be.eq('osm-cyclemap-key')
        expect(osmCycleBl.crs).to.be.eq('EPSG:3857')
        expect(osmCycleBl.zmin).to.be.eq(0)
        expect(osmCycleBl.zmax).to.be.eq(18)
        expect(osmCycleBl.hasAttribution).to.be.true
        expect(osmCycleBl.attribution).to.be.instanceOf(AttributionConfig)
        expect(osmCycleBl.attribution.title).to.be.eq('Thunderforest')
        expect(osmCycleBl.attribution.url).to.be.eq('https://www.thunderforest.com/')

        const googleSatBl = baseLayers.getBaseLayerConfigByBaseLayerName('google-satellite')
        expect(googleSatBl).to.be.instanceOf(BaseLayerConfig)
        expect(googleSatBl.type).to.be.eq('xyz')
        expect(googleSatBl).to.be.instanceOf(XyzBaseLayerConfig)
        expect(googleSatBl.name).to.be.eq('google-satellite')
        expect(googleSatBl.title).to.be.eq('Google Satellite')
        expect(googleSatBl.layerConfig).to.be.null
        expect(googleSatBl.url).to.be.eq('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}')
        expect(googleSatBl.hasKey).to.be.false
        expect(googleSatBl.key).to.be.null
        expect(googleSatBl.crs).to.be.eq('EPSG:3857')
        expect(googleSatBl.zmin).to.be.eq(0)
        expect(googleSatBl.zmax).to.be.eq(20)
        expect(googleSatBl.hasAttribution).to.be.true
        expect(googleSatBl.attribution).to.be.instanceOf(AttributionConfig)
        expect(googleSatBl.attribution.title).to.be.eq('Map data ©2019 Google')
        expect(googleSatBl.attribution.url).to.be.eq('https://about.google/brand-resource-center/products-and-services/geo-guidelines/#required-attribution')

        const bingAerialBl = baseLayers.getBaseLayerConfigByBaseLayerName('bing-aerial')
        expect(bingAerialBl).to.be.instanceOf(BaseLayerConfig)
        expect(bingAerialBl.type).to.be.eq('bing')
        expect(bingAerialBl).to.be.instanceOf(BingBaseLayerConfig)
        expect(bingAerialBl.name).to.be.eq('bing-aerial')
        expect(bingAerialBl.title).to.be.eq('Bing Satellite')
        expect(bingAerialBl.layerConfig).to.be.null
        expect(bingAerialBl.imagerySet).to.be.eq('Aerial')
        expect(bingAerialBl.hasKey).to.be.true
        expect(bingAerialBl.key).to.not.be.null
        expect(bingAerialBl.key).to.be.eq('bing-key')

        const ignPhotoBl = baseLayers.getBaseLayerConfigByBaseLayerName('ign-photo')
        expect(ignPhotoBl).to.be.instanceOf(BaseLayerConfig)
        expect(ignPhotoBl.type).to.be.eq('wmts')
        expect(ignPhotoBl).to.be.instanceOf(WmtsBaseLayerConfig)
        expect(ignPhotoBl.name).to.be.eq('ign-photo')
        expect(ignPhotoBl.title).to.be.eq('IGN Orthophoto')
        expect(ignPhotoBl.layerConfig).to.be.null
        expect(ignPhotoBl.url).to.be.eq('https://wxs.ign.fr/ortho/geoportail/wmts')
        expect(ignPhotoBl.hasKey).to.be.false
        expect(ignPhotoBl.key).to.be.null
        expect(ignPhotoBl.layer).to.be.eq('ORTHOIMAGERY.ORTHOPHOTOS')
        expect(ignPhotoBl.format).to.be.eq('image/jpeg')
        expect(ignPhotoBl.style).to.be.eq('normal')
        expect(ignPhotoBl.matrixSet).to.be.eq('PM')
        expect(ignPhotoBl.crs).to.be.eq('EPSG:3857')
        expect(ignPhotoBl.numZoomLevels).to.be.eq(22)
        expect(ignPhotoBl.hasAttribution).to.be.true
        expect(ignPhotoBl.attribution).to.be.instanceOf(AttributionConfig)
        expect(ignPhotoBl.attribution.title).to.be.eq('Institut national de l\'information géographique et forestière')
        expect(ignPhotoBl.attribution.url).to.be.eq('https://www.ign.fr/')

        const ignScanBl = baseLayers.getBaseLayerConfigByBaseLayerName('ign-scan')
        expect(ignScanBl).to.be.instanceOf(BaseLayerConfig)
        expect(ignScanBl.type).to.be.eq('wmts')
        expect(ignScanBl).to.be.instanceOf(WmtsBaseLayerConfig)
        expect(ignScanBl.name).to.be.eq('ign-scan')
        expect(ignScanBl.title).to.be.eq('IGN Scans')
        expect(ignScanBl.layerConfig).to.be.null
        expect(ignScanBl.url).to.be.eq('https://wxs.ign.fr/{key}/geoportail/wmts')
        expect(ignScanBl.hasKey).to.be.true
        expect(ignScanBl.key).to.be.eq('ign-key')
        expect(ignScanBl.layer).to.be.eq('GEOGRAPHICALGRIDSYSTEMS.MAPS')
        expect(ignScanBl.format).to.be.eq('image/jpeg')
        expect(ignScanBl.style).to.be.eq('normal')
        expect(ignScanBl.matrixSet).to.be.eq('PM')
        expect(ignScanBl.crs).to.be.eq('EPSG:3857')
        expect(ignScanBl.numZoomLevels).to.be.eq(18)
        expect(ignScanBl.hasAttribution).to.be.true
        expect(ignScanBl.attribution).to.be.instanceOf(AttributionConfig)
        expect(ignScanBl.attribution.title).to.be.eq('Institut national de l\'information géographique et forestière')
        expect(ignScanBl.attribution.url).to.be.eq('https://www.ign.fr/')
    })

    it('From layers config', function () {
        const layersCfg = new LayersConfig({
            "france_parts": {
                "abstract": "",
                "displayInLegend": "True",
                "popupMaxFeatures": 10,
                "baseLayer": "False",
                "noLegendImage": "False",
                "id": "france_parts_8d8d649f_7748_43cc_8bde_b013e17ede29",
                "title": "france_parts",
                "singleTile": "True",
                "geometryType": "polygon",
                "groupAsLayer": "False",
                "popupTemplate": "",
                "popup": "True",
                "popupDisplayChildren": "False",
                "clientCacheExpiration": 300,
                "link": "",
                "extent": [
                    -5.1326269187,
                    46.2791909858,
                    3.11792890789,
                    49.7264741072
                ],
                "toggled": "True",
                "crs": "EPSG:4326",
                "name": "france_parts",
                "cached": "False",
                "type": "layer",
                "maxScale": 1000000000000,
                "popupSource": "auto",
                "imageFormat": "image/png",
                "minScale": 1
            },
            "OpenStreetMap": {
                "id": "OpenStreetMap_098d6629_1ec4_4c2c_9489_9a44ae09223e",
                "name": "OpenStreetMap",
                "type": "layer",
                "extent": [
                    -20037508.342789244,
                    -20037508.342789255,
                    20037508.342789244,
                    20037508.342789244
                ],
                "crs": "EPSG:3857",
                "title": "OpenStreetMap",
                "abstract": "",
                "link": "",
                "minScale": 1,
                "maxScale": 1000000000000,
                "toggled": "True",
                "popup": "False",
                "popupFrame": null,
                "popupSource": "auto",
                "popupTemplate": "",
                "popupMaxFeatures": 10,
                "popupDisplayChildren": "False",
                "noLegendImage": "False",
                "groupAsLayer": "False",
                "baseLayer": "True",
                "displayInLegend": "True",
                "singleTile": "True",
                "imageFormat": "image/png",
                "cached": "False",
                "serverFrame": null,
                "clientCacheExpiration": 300
            },
            "Orthophotos clé essentiels": {
                "id": "Orthophotos_essentiels_993e18ab_ef98_422d_aced_d82d4264b27b",
                "name": "Orthophotos clé essentiels",
                "type": "layer",
                "extent": [
                    -19835686.105981037,
                    -19971868.88040857,
                    19480910.888822887,
                    19971868.880408593
                ],
                "crs": "EPSG:3857",
                "title": "Orthophotos clé essentiels",
                "abstract": "",
                "link": "",
                "minScale": 1,
                "maxScale": 1000000000000,
                "toggled": "False",
                "popup": "False",
                "popupFrame": null,
                "popupSource": "auto",
                "popupTemplate": "",
                "popupMaxFeatures": 10,
                "popupDisplayChildren": "False",
                "noLegendImage": "False",
                "groupAsLayer": "False",
                "baseLayer": "True",
                "displayInLegend": "True",
                "singleTile": "True",
                "imageFormat": "image/jpeg",
                "cached": "False",
                "serverFrame": null,
                "clientCacheExpiration": 300
            }
        })

        const layerNames = layersCfg.layerNames;
        expect(layerNames.length).to.be.eq(3)

        const osmLayer = layersCfg.layerConfigs[1];
        expect(osmLayer.name).to.be.eq('OpenStreetMap')
        expect(osmLayer.baseLayer).to.be.true

        const options = {
            startupBaselayer: 'OpenStreetMap'
        };
        const baseLayers = new BaseLayersConfig({}, options, layersCfg)

        expect(baseLayers.startupBaselayerName).to.be.eq('OpenStreetMap')

        const baseLayerNames = baseLayers.baseLayerNames;
        expect(baseLayerNames.length).to.be.eq(2);
        expect(baseLayerNames).to.include('OpenStreetMap')
        expect(baseLayerNames).to.include('Orthophotos clé essentiels')

        const osmBl = baseLayers.baseLayerConfigs[0]
        expect(osmBl).to.be.instanceOf(BaseLayerConfig)
        expect(osmBl.type).to.be.eq('lizmap')
        expect(osmBl.name).to.be.eq('OpenStreetMap')
        expect(osmBl.title).to.be.eq('OpenStreetMap')
        expect(osmBl.layerConfig).to.not.be.null
        expect(osmBl.layerConfig).to.be.instanceOf(LayerConfig)
    })

    it('From options and layers config', function () {
        const layersCfg = new LayersConfig({
            "france_parts": {
                "abstract": "",
                "displayInLegend": "True",
                "popupMaxFeatures": 10,
                "baseLayer": "False",
                "noLegendImage": "False",
                "id": "france_parts_8d8d649f_7748_43cc_8bde_b013e17ede29",
                "title": "france_parts",
                "singleTile": "True",
                "geometryType": "polygon",
                "groupAsLayer": "False",
                "popupTemplate": "",
                "popup": "True",
                "popupDisplayChildren": "False",
                "clientCacheExpiration": 300,
                "link": "",
                "extent": [
                    -5.1326269187,
                    46.2791909858,
                    3.11792890789,
                    49.7264741072
                ],
                "toggled": "True",
                "crs": "EPSG:4326",
                "name": "france_parts",
                "cached": "False",
                "type": "layer",
                "maxScale": 1000000000000,
                "popupSource": "auto",
                "imageFormat": "image/png",
                "minScale": 1
            },
            "OpenStreetMap": {
                "id": "OpenStreetMap_098d6629_1ec4_4c2c_9489_9a44ae09223e",
                "name": "OpenStreetMap",
                "type": "layer",
                "extent": [
                    -20037508.342789244,
                    -20037508.342789255,
                    20037508.342789244,
                    20037508.342789244
                ],
                "crs": "EPSG:3857",
                "title": "OpenStreetMap",
                "abstract": "",
                "link": "",
                "minScale": 1,
                "maxScale": 1000000000000,
                "toggled": "True",
                "popup": "False",
                "popupFrame": null,
                "popupSource": "auto",
                "popupTemplate": "",
                "popupMaxFeatures": 10,
                "popupDisplayChildren": "False",
                "noLegendImage": "False",
                "groupAsLayer": "False",
                "baseLayer": "True",
                "displayInLegend": "True",
                "singleTile": "True",
                "imageFormat": "image/png",
                "cached": "False",
                "serverFrame": null,
                "clientCacheExpiration": 300
            },
            "Orthophotos clé essentiels": {
                "id": "Orthophotos_essentiels_993e18ab_ef98_422d_aced_d82d4264b27b",
                "name": "Orthophotos clé essentiels",
                "type": "layer",
                "extent": [
                    -19835686.105981037,
                    -19971868.88040857,
                    19480910.888822887,
                    19971868.880408593
                ],
                "crs": "EPSG:3857",
                "title": "Orthophotos clé essentiels",
                "abstract": "",
                "link": "",
                "minScale": 1,
                "maxScale": 1000000000000,
                "toggled": "False",
                "popup": "False",
                "popupFrame": null,
                "popupSource": "auto",
                "popupTemplate": "",
                "popupMaxFeatures": 10,
                "popupDisplayChildren": "False",
                "noLegendImage": "False",
                "groupAsLayer": "False",
                "baseLayer": "True",
                "displayInLegend": "True",
                "singleTile": "True",
                "imageFormat": "image/jpeg",
                "cached": "False",
                "serverFrame": null,
                "clientCacheExpiration": 300
            }
        })

        const layerNames = layersCfg.layerNames;
        expect(layerNames.length).to.be.eq(3)

        const osmLayer = layersCfg.layerConfigs[1];
        expect(osmLayer.name).to.be.eq('OpenStreetMap')
        expect(osmLayer.baseLayer).to.be.true

        const options = {
            emptyBaselayer: 'True',
            osmStamenToner: 'True',
            googleSatellite: 'True',
            bingStreets: 'True',
            bingKey: 'bing-key',
            ignCadastral: 'True',
            startupBaselayer: 'OpenStreetMap'
        };
        const baseLayers = new BaseLayersConfig({}, options, layersCfg)

        expect(baseLayers.startupBaselayerName).to.be.eq('OpenStreetMap')

        const baseLayerNames = baseLayers.baseLayerNames;
        expect(baseLayerNames.length).to.be.eq(7);
        expect(baseLayerNames).to.include('OpenStreetMap')
        expect(baseLayerNames).to.include('Orthophotos clé essentiels')
        expect(baseLayerNames).to.include('empty')
        expect(baseLayerNames).to.include('osm-stamen-toner')
        expect(baseLayerNames).to.include('google-satellite')
        expect(baseLayerNames).to.include('bing-road')
        expect(baseLayerNames).to.include('ign-cadastral')

        const osmBl = baseLayers.baseLayerConfigs[5]
        expect(osmBl).to.be.instanceOf(BaseLayerConfig)
        expect(osmBl.type).to.be.eq('lizmap')
        expect(osmBl.name).to.be.eq('OpenStreetMap')
        expect(osmBl.title).to.be.eq('OpenStreetMap')
        expect(osmBl.layerConfig).to.not.be.null
        expect(osmBl.layerConfig).to.be.instanceOf(LayerConfig)
    })

    it('From options and layers tree', function () {
        const capabilities = JSON.parse(readFileSync('./data/montpellier-capabilities.json', 'utf8'));
        expect(capabilities).to.not.be.undefined
        expect(capabilities.Capability).to.not.be.undefined
        const config = JSON.parse(readFileSync('./data/montpellier-config.json', 'utf8'));
        expect(config).to.not.be.undefined

        // Update capabilities change Hidden group to Baselayers group
        const blName = 'Baselayers';
        capabilities.Capability.Layer.Layer[6].Name = blName;
        const blGroupCfg = structuredClone(config.layers.Hidden);
        blGroupCfg.id = blName;
        blGroupCfg.name = blName;
        blGroupCfg.title = blName;
        delete config.layers.Hidden;
        config.layers[blName] = blGroupCfg;

        const layers = new LayersConfig(config.layers);
        const root = buildLayerTreeConfig(capabilities.Capability.Layer, layers);

        expect(root).to.be.instanceOf(LayerTreeGroupConfig)
        expect(root.name).to.be.eq('root')
        expect(root.type).to.be.eq('group')
        expect(root.level).to.be.eq(0)
        expect(root.childrenCount).to.be.eq(7)

        const blGroup = root.children[6];
        expect(blGroup).to.be.instanceOf(LayerTreeGroupConfig)
        expect(blGroup.name).to.be.eq('Baselayers')
        expect(blGroup.type).to.be.eq('group')
        expect(blGroup.level).to.be.eq(1)

        const options = {
            emptyBaselayer: 'True'
        };
        const baseLayers = new BaseLayersConfig({}, options, layers, blGroup)

        const baseLayerNames = baseLayers.baseLayerNames;
        expect(baseLayerNames).to.have.length(3)
        expect(baseLayerNames).to.include('empty')
        expect(baseLayerNames).to.include('osm-mapnik')
        expect(baseLayerNames).to.include('osm-stamen-toner')

        expect(baseLayers.startupBaselayerName).to.be.eq('osm-mapnik')

        const osmBl = baseLayers.baseLayerConfigs[0]
        expect(osmBl).to.be.instanceOf(BaseLayerConfig)
        expect(osmBl.type).to.be.eq('xyz')
        expect(osmBl).to.be.instanceOf(XyzBaseLayerConfig)
        expect(osmBl.name).to.be.eq('osm-mapnik')
        expect(osmBl.title).to.be.eq('osm-mapnik')
        expect(osmBl.layerConfig).to.not.be.null
        expect(osmBl.layerConfig).to.be.instanceOf(LayerConfig)

    })

    it('startupBaseLayer', function () {
        const emptyStratupBlOpt = {
            emptyBaselayer: 'True',
            osmMapnik: 'True',
            startupBaselayer: 'empty'
        };
        const emptyStratupBl = new BaseLayersConfig({}, emptyStratupBlOpt, new LayersConfig({}))

        expect(emptyStratupBl.startupBaselayerName).to.be.eq('empty')

        const osmMapnikStratupBlOpt = {
            emptyBaselayer: 'True',
            osmMapnik: 'True',
            startupBaselayer: 'osmMapnik'
        };
        const osmMapnikStratupBl = new BaseLayersConfig({}, osmMapnikStratupBlOpt, new LayersConfig({}))

        expect(osmMapnikStratupBl.startupBaselayerName).to.be.eq('osm-mapnik')

        const nullStratupBlOpt = {
            emptyBaselayer: 'True',
            osmMapnik: 'True'
        };
        const nullStratupBl = new BaseLayersConfig({}, nullStratupBlOpt, new LayersConfig({}))

        expect(nullStratupBl.startupBaselayerName).to.be.null

        const undefinedStratupBlOpt = {
            emptyBaselayer: 'True',
            osmMapnik: 'True',
            startupBaselayer: 'ign-photo'
        };
        const undefinedStratupBl = new BaseLayersConfig({}, undefinedStratupBlOpt, new LayersConfig({}))

        expect(undefinedStratupBl.startupBaselayerName).to.be.null

        const unknownStratupBlOpt = {
            emptyBaselayer: 'True',
            osmMapnik: 'True',
            startupBaselayer: 'unknown'
        };
        const unknownStratupBl = new BaseLayersConfig({}, unknownStratupBlOpt, new LayersConfig({}))

        expect(unknownStratupBl.startupBaselayerName).to.be.null
    })

    it('ValidationError', function () {
        try {
            new BaseLayersConfig()
        } catch (error) {
            expect(error.name).to.be.eq('ValidationError')
            expect(error.message).to.be.eq('The cfg parameter is not an Object!')
            expect(error).to.be.instanceOf(ValidationError)
        }
    })
})
