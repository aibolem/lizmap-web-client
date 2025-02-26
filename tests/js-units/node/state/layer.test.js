import { expect } from 'chai';

import { readFileSync } from 'fs';

import { ValidationError } from '../../../../assets/src/modules/Errors.js';
import { LayersConfig } from '../../../../assets/src/modules/config/Layer.js';
import { LayerGeographicBoundingBoxConfig, LayerBoundingBoxConfig, LayerTreeGroupConfig, buildLayerTreeConfig } from '../../../../assets/src/modules/config/LayerTree.js';
import { buildLayersOrder } from '../../../../assets/src/modules/config/LayersOrder.js';
import { Extent } from '../../../../assets/src/modules/utils/Extent.js';

import { LayerGroupState, LayerVectorState, LayerRasterState, LayersAndGroupsCollection } from '../../../../assets/src/modules/state/Layer.js';

describe('LayerGroupState', function () {
    it('Valid', function () {
        const capabilities = JSON.parse(readFileSync('./data/montpellier-capabilities.json', 'utf8'));
        expect(capabilities).to.not.be.undefined
        expect(capabilities.Capability).to.not.be.undefined
        const config = JSON.parse(readFileSync('./data/montpellier-config.json', 'utf8'));
        expect(config).to.not.be.undefined

        const layers = new LayersConfig(config.layers);

        const rootCfg = buildLayerTreeConfig(capabilities.Capability.Layer, layers);
        expect(rootCfg).to.be.instanceOf(LayerTreeGroupConfig)

        const layersOrder = buildLayersOrder(config, rootCfg);

        const root = new LayerGroupState(rootCfg, layersOrder);
        expect(root).to.be.instanceOf(LayerGroupState)
        expect(root.id).to.be.null
        expect(root.name).to.be.eq('root')
        expect(root.type).to.be.eq('group')
        expect(root.level).to.be.eq(0)
        expect(root.wmsName).to.be.eq('Montpellier-Transports')
        expect(root.wmsTitle).to.be.eq('Montpellier - Transports')
        expect(root.wmsAbstract).to.be.eq('Demo project with bus and tramway lines in Montpellier, France.\nData is licensed under ODbl, OpenStreetMap contributors')
        expect(root.title).to.be.null
        expect(root.abstract).to.be.null
        expect(root.link).to.be.null
        expect(root.wmsGeographicBoundingBox).to.be.null
        expect(root.wmsBoundingBoxes).to.be.an('array').that.have.length(0)
        expect(root.wmsMinScaleDenominator).to.be.eq(-1)
        expect(root.wmsMaxScaleDenominator).to.be.eq(-1)
        expect(root.checked).to.be.true
        expect(root.visibility).to.be.true
        expect(root.baseLayer).to.be.false
        expect(root.displayInLegend).to.be.true
        expect(root.imageFormat).to.be.null
        expect(root.singleTile).to.be.true
        expect(root.cached).to.be.false
        expect(root.layerConfig).to.be.null
        expect(root.groupAsLayer).to.be.false
        expect(root.mutuallyExclusive).to.be.false
        expect(root.childrenCount).to.be.eq(7)
        expect(root.findLayerNames()).to.be.an('array').that.have.ordered.members([
            "points_of_interest",
            "edition_line",
            "areas_of_interest",
            "bus_stops",
            "bus",
            "tramway_ref",
            "tramway_pivot",
            "tram_stop_work",
            "tramstop",
            "tramway",
            "publicbuildings",
            "publicbuildings_tramstop",
            "donnes_sociodemo_sous_quartiers",
            "SousQuartiers",
            "Quartiers",
            "VilleMTP_MTP_Quartiers_2011_4326",
            "osm-mapnik",
            "osm-stamen-toner"
        ])

        const transports = root.children[1];
        expect(transports).to.be.instanceOf(LayerGroupState)
        expect(transports.id).to.be.eq('datalayers')
        expect(transports.wmsName).to.be.eq('datalayers')
        expect(transports.wmsTitle).to.be.eq('datalayers')
        expect(transports.wmsMinScaleDenominator).to.be.eq(-1)
        expect(transports.wmsMaxScaleDenominator).to.be.eq(-1)
        expect(transports.title).to.be.eq('Transport')
        expect(transports.abstract).to.be.eq('')

        const bus = transports.children[0];
        expect(bus).to.be.instanceOf(LayerGroupState)
        expect(bus.id).to.be.eq('Bus')
        expect(bus.name).to.be.eq('Bus')
        expect(bus.type).to.be.eq('group')
        expect(bus.level).to.be.eq(2)
        expect(bus.wmsName).to.be.eq('Bus')
        expect(bus.wmsTitle).to.be.eq('Bus')
        expect(bus.wmsAbstract).to.be.null
        expect(bus.title).to.be.eq('Bus')
        expect(bus.abstract).to.be.eq('Lignes et arrêts de bus de Montpellier')
        expect(bus.link).to.be.eq('http://www.montpellier-agglo.com/tam/page.php?id_rubrique=29')
        expect(bus.wmsGeographicBoundingBox).to.be.instanceOf(LayerGeographicBoundingBoxConfig)
        expect(bus.wmsGeographicBoundingBox.west).to.be.eq(3.55326)
        expect(bus.wmsGeographicBoundingBox.south).to.be.eq(43.5265)
        expect(bus.wmsGeographicBoundingBox.east).to.be.eq(4.081239)
        expect(bus.wmsGeographicBoundingBox.north).to.be.eq(43.761579)
        expect(bus.wmsBoundingBoxes).to.be.an('array').that.have.length(3)
        expect(bus.wmsBoundingBoxes[0]).to.be.instanceOf(LayerBoundingBoxConfig)
        expect(bus.wmsBoundingBoxes[0].crs).to.be.eq('EPSG:3857')
        expect(bus.wmsBoundingBoxes[0].xmin).to.be.eq(395547.093)
        expect(bus.wmsBoundingBoxes[0].ymin).to.be.eq(5392456.984)
        expect(bus.wmsBoundingBoxes[0].xmax).to.be.eq(454321.449)
        expect(bus.wmsBoundingBoxes[0].ymax).to.be.eq(5428619.815)
        expect(bus.wmsBoundingBoxes[1].crs).to.be.eq('EPSG:4326')
        expect(bus.wmsBoundingBoxes[1].xmin).to.be.eq(bus.wmsGeographicBoundingBox.west)
        expect(bus.wmsBoundingBoxes[1].ymin).to.be.eq(bus.wmsGeographicBoundingBox.south)
        expect(bus.wmsBoundingBoxes[1].xmax).to.be.eq(bus.wmsGeographicBoundingBox.east)
        expect(bus.wmsBoundingBoxes[1].ymax).to.be.eq(bus.wmsGeographicBoundingBox.north)
        expect(bus.wmsMinScaleDenominator).to.be.eq(-1)
        expect(bus.wmsMaxScaleDenominator).to.be.eq(40001)
        expect(bus.checked).to.be.false
        expect(bus.visibility).to.be.false
        expect(bus.baseLayer).to.be.false
        expect(bus.displayInLegend).to.be.true
        expect(bus.imageFormat).to.be.eq('image/png')
        expect(bus.singleTile).to.be.false
        expect(bus.cached).to.be.false
        expect(bus.layerConfig).to.not.be.null;
        expect(bus.groupAsLayer).to.be.false
        expect(bus.mutuallyExclusive).to.be.false
        expect(bus.childrenCount).to.be.eq(2)
        expect(bus.findLayerNames()).to.be.an('array').that.have.ordered.members([
            "bus_stops",
            "bus",
        ])

        const busStops = bus.children[0];
        expect(busStops).to.be.instanceOf(LayerVectorState)
        expect(busStops.id).to.be.eq('bus_stops20121106170806413')
        expect(busStops.name).to.be.eq('bus_stops')
        expect(busStops.type).to.be.eq('layer')
        expect(busStops.level).to.be.eq(3)
        expect(busStops.wmsName).to.be.eq('bus_stops')
        expect(busStops.wmsTitle).to.be.eq('bus_stops')
        expect(busStops.wmsAbstract).to.be.null
        expect(busStops.title).to.be.eq('Stops')
        expect(busStops.abstract).to.be.eq('')
        expect(busStops.link).to.be.eq('')
        expect(busStops.wmsGeographicBoundingBox).to.be.instanceOf(LayerGeographicBoundingBoxConfig)
        expect(busStops.wmsGeographicBoundingBox.west).to.be.eq(3.55326)
        expect(busStops.wmsGeographicBoundingBox.south).to.be.eq(43.526928)
        expect(busStops.wmsGeographicBoundingBox.east).to.be.eq(4.039132)
        expect(busStops.wmsGeographicBoundingBox.north).to.be.eq(43.752341)
        expect(busStops.wmsBoundingBoxes).to.be.an('array').that.have.length(3)
        expect(busStops.wmsBoundingBoxes[0]).to.be.instanceOf(LayerBoundingBoxConfig)
        expect(busStops.wmsBoundingBoxes[0].crs).to.be.eq('EPSG:3857')
        expect(busStops.wmsBoundingBoxes[0].xmin).to.be.eq(395547.093)
        expect(busStops.wmsBoundingBoxes[0].ymin).to.be.eq(5392522.697)
        expect(busStops.wmsBoundingBoxes[0].xmax).to.be.eq(449634.007)
        expect(busStops.wmsBoundingBoxes[0].ymax).to.be.eq(5427196.032)
        expect(busStops.wmsBoundingBoxes[1].crs).to.be.eq('EPSG:4326')
        expect(busStops.wmsBoundingBoxes[1].xmin).to.be.eq(busStops.wmsGeographicBoundingBox.west)
        expect(busStops.wmsBoundingBoxes[1].ymin).to.be.eq(busStops.wmsGeographicBoundingBox.south)
        expect(busStops.wmsBoundingBoxes[1].xmax).to.be.eq(busStops.wmsGeographicBoundingBox.east)
        expect(busStops.wmsBoundingBoxes[1].ymax).to.be.eq(busStops.wmsGeographicBoundingBox.north)
        expect(busStops.wmsMinScaleDenominator).to.be.eq(0)
        expect(busStops.wmsMaxScaleDenominator).to.be.eq(15000)
        expect(busStops.checked).to.be.false
        expect(busStops.visibility).to.be.false
        expect(busStops.baseLayer).to.be.false
        expect(busStops.displayInLegend).to.be.true
        expect(busStops.imageFormat).to.be.eq('image/png')
        expect(busStops.singleTile).to.be.true
        expect(busStops.cached).to.be.false
        expect(busStops.layerConfig).to.not.be.null
        expect(busStops.layerType).to.be.eq('vector')
        expect(busStops.layerOrder).to.be.eq(3)
        expect(busStops.extent).to.be.instanceOf(Extent)
        expect(busStops.extent.xmin).to.be.eq(3.55326)
        expect(busStops.extent.ymin).to.be.eq(43.526928)
        expect(busStops.extent.xmax).to.be.eq(4.039131)
        expect(busStops.extent.ymax).to.be.eq(43.752341)
        expect(busStops.crs).to.be.eq('EPSG:4326')
        expect(busStops.popup).to.be.true
        expect(busStops.popupMaxFeatures).to.be.eq(10)
        expect(busStops.wmsSelectedStyleName).to.be.eq('default')
        expect(busStops.wmsStyles).to.be.an('array').that.have.length(1)
        expect(busStops.wmsAttribution).to.be.null
        expect(busStops.isSpatial).to.be.true
        expect(busStops.geometryType).to.be.eq('point')
        expect(busStops.popupDisplayChildren).to.be.false
        expect(busStops.wmsParameters).to.be.an('object').that.be.deep.eq({
            "LAYERS": "bus_stops",
            "STYLES": "default",
            "FORMAT": "image/png",
            "DPI": 96,
        })
        expect(busStops.symbology).to.be.null
        expect(busStops.selectedFeatures).to.be.an('array').that.have.length(0)
        expect(busStops.selectionToken).to.be.null
        expect(busStops.expressionFilter).to.be.null
        expect(busStops.filterToken).to.be.null

        const donneesSocio = root.children[2];
        expect(donneesSocio).to.be.instanceOf(LayerVectorState)
        expect(donneesSocio.id).to.be.eq('donnes_sociodemo_sous_quartiers20160121144525075')
        expect(donneesSocio.name).to.be.eq('donnes_sociodemo_sous_quartiers')
        expect(donneesSocio.type).to.be.eq('layer')
        expect(donneesSocio.level).to.be.eq(1)
        expect(donneesSocio.wmsGeographicBoundingBox).to.be.null
        expect(donneesSocio.wmsBoundingBoxes).to.be.an('array').that.have.length(0)
        expect(donneesSocio.checked).to.be.false
        expect(donneesSocio.visibility).to.be.false
        expect(donneesSocio.layerType).to.be.eq('vector')
        expect(donneesSocio.layerOrder).to.be.eq(-1)
        expect(donneesSocio.extent).to.be.null
        expect(donneesSocio.crs).to.be.eq('EPSG:4326')
        expect(donneesSocio.isSpatial).to.be.false
        expect(donneesSocio.geometryType).to.be.eq('none')
        expect(donneesSocio.popupDisplayChildren).to.be.false

        const sousquartiers = root.children[3];
        expect(sousquartiers).to.be.instanceOf(LayerVectorState)
        expect(sousquartiers.id).to.be.eq('SousQuartiers20160121124316563')
        expect(sousquartiers.name).to.be.eq('SousQuartiers')
        expect(sousquartiers.type).to.be.eq('layer')
        expect(sousquartiers.level).to.be.eq(1)
        expect(sousquartiers.checked).to.be.false
        expect(sousquartiers.visibility).to.be.false
        expect(sousquartiers.isSpatial).to.be.true
        expect(sousquartiers.geometryType).to.be.eq('polygon')
        expect(sousquartiers.wmsName).to.be.eq('SousQuartiers')
        expect(sousquartiers.layerConfig).to.not.be.null;
        expect(sousquartiers.wmsStyles).to.be.an('array')
        expect(sousquartiers.wmsStyles).to.have.length(1)
        expect(sousquartiers.wmsStyles[0].wmsName).to.be.eq('default')
        expect(sousquartiers.wmsStyles[0].wmsTitle).to.be.eq('default')
        expect(sousquartiers.wmsSelectedStyleName).to.be.eq('default')
        expect(sousquartiers.wmsAttribution).to.be.null
        expect(sousquartiers.wmsParameters).to.be.an('object').that.be.deep.eq({
            "LAYERS": "SousQuartiers",
            "STYLES": "default",
            "FORMAT": "image/png",
            "DPI": 96,
        })
        expect(sousquartiers.symbology).to.be.null
        expect(sousquartiers.selectedFeatures).to.be.an('array').that.have.length(0)
        expect(sousquartiers.selectionToken).to.be.null
        expect(sousquartiers.expressionFilter).to.be.null
        expect(sousquartiers.filterToken).to.be.null

        const hidden = root.children[6];
        expect(hidden).to.be.instanceOf(LayerGroupState)
        expect(hidden.id).to.be.eq('Hidden')
        expect(hidden.name).to.be.eq('Hidden')
        expect(hidden.wmsGeographicBoundingBox).to.be.instanceOf(LayerGeographicBoundingBoxConfig)
        expect(hidden.wmsGeographicBoundingBox.west).to.be.eq(-180)
        expect(hidden.wmsGeographicBoundingBox.south).to.be.eq(-85.051129)
        expect(hidden.wmsGeographicBoundingBox.east).to.be.eq(180)
        expect(hidden.wmsGeographicBoundingBox.north).to.be.eq(85.051129)
        expect(hidden.childrenCount).to.be.eq(2)

        const osm = hidden.children[0];
        expect(osm).to.be.instanceOf(LayerRasterState)
        expect(osm.id).to.be.eq('osm_mapnik20180315181738526')
        expect(osm.name).to.be.eq('osm-mapnik')
        expect(osm.wmsName).to.be.eq('osm-mapnik')
        expect(osm.wmsGeographicBoundingBox).to.be.instanceOf(LayerGeographicBoundingBoxConfig)
        expect(osm.wmsGeographicBoundingBox.west).to.be.eq(-180)
        expect(osm.wmsGeographicBoundingBox.south).to.be.eq(-85.051129)
        expect(osm.wmsGeographicBoundingBox.east).to.be.eq(180)
        expect(osm.wmsGeographicBoundingBox.north).to.be.eq(85.051129)
        expect(osm.layerOrder).to.be.eq(11)
        expect(osm.extent).to.be.instanceOf(Extent)
        expect(osm.extent.xmin).to.be.eq(-20037508.342789244)
        expect(osm.extent.ymin).to.be.eq(-20037508.342789255)
        expect(osm.extent.xmax).to.be.eq(20037508.342789244)
        expect(osm.extent.ymax).to.be.eq(20037508.342789244)
        expect(osm.crs).to.be.eq('EPSG:3857')
        expect(osm.wmsParameters).to.be.an('object').that.be.deep.eq({
            "LAYERS": "osm-mapnik",
            "STYLES": "default",
            "FORMAT": "image/png",
            "DPI": 96,
        })
        expect(osm.externalWmsToggle).to.be.true
        expect(osm.externalAccess).to.be.an('object').that.be.deep.eq({
            "crs": "EPSG:3857",
            "format": "",
            "type": "xyz",
            "url": "http://tile.openstreetmap.org/{z}/{x}/{y}.png"
        })
    })

    it('Selection and parameters', function () {
        const capabilities = JSON.parse(readFileSync('./data/montpellier-capabilities.json', 'utf8'));
        expect(capabilities).to.not.be.undefined
        expect(capabilities.Capability).to.not.be.undefined
        const config = JSON.parse(readFileSync('./data/montpellier-config.json', 'utf8'));
        expect(config).to.not.be.undefined

        const layers = new LayersConfig(config.layers);

        const rootCfg = buildLayerTreeConfig(capabilities.Capability.Layer, layers);
        expect(rootCfg).to.be.instanceOf(LayerTreeGroupConfig)

        const layersOrder = buildLayersOrder(config, rootCfg);

        const root = new LayerGroupState(rootCfg, layersOrder);
        expect(root).to.be.instanceOf(LayerGroupState)

        const sousquartiers = root.children[3];
        expect(sousquartiers).to.be.instanceOf(LayerVectorState)
        expect(sousquartiers.wmsParameters).to.be.an('object').that.be.deep.eq({
            "LAYERS": "SousQuartiers",
            "STYLES": "default",
            "FORMAT": "image/png",
            "DPI": 96,
        })
        expect(sousquartiers.symbology).to.be.null
        expect(sousquartiers.selectedFeatures).to.be.an('array').that.have.length(0)
        expect(sousquartiers.selectionToken).to.be.null
        expect(sousquartiers.hasSelectedFeatures).to.be.false
        expect(sousquartiers.expressionFilter).to.be.null
        expect(sousquartiers.filterToken).to.be.null
        expect(sousquartiers.isFiltered).to.be.false

        sousquartiers.selectedFeatures = ['1']
        expect(sousquartiers.selectedFeatures).to.be.an('array').that.have.length(1)
        expect(sousquartiers.selectionToken).to.be.null
        expect(sousquartiers.hasSelectedFeatures).to.be.true
        expect(sousquartiers.wmsParameters).to.be.an('object').that.be.deep.eq({
            "LAYERS": "SousQuartiers",
            "STYLES": "default",
            "FORMAT": "image/png",
            "DPI": 96,
            "SELECTION": "SousQuartiers:1"
        })

        sousquartiers.selectedFeatures = ['1', '3']
        expect(sousquartiers.selectedFeatures).to.be.an('array').that.have.length(2)
        expect(sousquartiers.selectionToken).to.be.null
        expect(sousquartiers.hasSelectedFeatures).to.be.true
        expect(sousquartiers.wmsParameters).to.be.an('object').that.be.deep.eq({
            "LAYERS": "SousQuartiers",
            "STYLES": "default",
            "FORMAT": "image/png",
            "DPI": 96,
            "SELECTION": "SousQuartiers:1,3"
        })

        sousquartiers.selectedFeatures = null
        expect(sousquartiers.selectedFeatures).to.be.an('array').that.have.length(0)
        expect(sousquartiers.selectionToken).to.be.null
        expect(sousquartiers.hasSelectedFeatures).to.be.false
        expect(sousquartiers.wmsParameters).to.be.an('object').that.be.deep.eq({
            "LAYERS": "SousQuartiers",
            "STYLES": "default",
            "FORMAT": "image/png",
            "DPI": 96,
        })

        try {
            sousquartiers.selectedFeatures = {}
        } catch (error) {
            expect(error.name).to.be.eq('ValidationError')
            expect(error.message).to.be.eq('Selection Ids could only be null or an array!')
            expect(error).to.be.instanceOf(ValidationError)
        }
        expect(sousquartiers.selectedFeatures).to.be.an('array').that.have.length(0)
        expect(sousquartiers.selectionToken).to.be.null
        expect(sousquartiers.hasSelectedFeatures).to.be.false
        expect(sousquartiers.wmsParameters).to.be.an('object').that.be.deep.eq({
            "LAYERS": "SousQuartiers",
            "STYLES": "default",
            "FORMAT": "image/png",
            "DPI": 96,
        })

        sousquartiers.selectedFeatures = ['1']
        expect(sousquartiers.selectedFeatures).to.be.an('array').that.have.length(1)
        expect(sousquartiers.selectionToken).to.be.null
        expect(sousquartiers.hasSelectedFeatures).to.be.true
        expect(sousquartiers.wmsParameters).to.be.an('object').that.be.deep.eq({
            "LAYERS": "SousQuartiers",
            "STYLES": "default",
            "FORMAT": "image/png",
            "DPI": 96,
            "SELECTION": "SousQuartiers:1"
        })

        sousquartiers.selectionToken = 'token-for-id-1'
        expect(sousquartiers.selectedFeatures).to.be.an('array').that.have.length(1)
        expect(sousquartiers.selectionToken).to.be.eq('token-for-id-1')
        expect(sousquartiers.hasSelectedFeatures).to.be.true
        expect(sousquartiers.wmsParameters).to.be.an('object').that.be.deep.eq({
            "LAYERS": "SousQuartiers",
            "STYLES": "default",
            "FORMAT": "image/png",
            "DPI": 96,
            "SELECTIONTOKEN": "token-for-id-1"
        })

        sousquartiers.selectionToken = null
        expect(sousquartiers.selectedFeatures).to.be.an('array').that.have.length(1)
        expect(sousquartiers.selectionToken).to.be.null
        expect(sousquartiers.hasSelectedFeatures).to.be.true
        expect(sousquartiers.wmsParameters).to.be.an('object').that.be.deep.eq({
            "LAYERS": "SousQuartiers",
            "STYLES": "default",
            "FORMAT": "image/png",
            "DPI": 96,
            "SELECTION": "SousQuartiers:1"
        })

        try {
            sousquartiers.selectionToken = 1
        } catch (error) {
            expect(error.name).to.be.eq('ValidationError')
            expect(error.message).to.be.eq('Selection token could only be null, a string or an object!')
            expect(error).to.be.instanceOf(ValidationError)
        }
        expect(sousquartiers.selectedFeatures).to.be.an('array').that.have.length(1)
        expect(sousquartiers.selectionToken).to.be.null
        expect(sousquartiers.hasSelectedFeatures).to.be.true
        expect(sousquartiers.wmsParameters).to.be.an('object').that.be.deep.eq({
            "LAYERS": "SousQuartiers",
            "STYLES": "default",
            "FORMAT": "image/png",
            "DPI": 96,
            "SELECTION": "SousQuartiers:1"
        })

        sousquartiers.selectionToken = 'token-for-id-1'
        expect(sousquartiers.selectedFeatures).to.be.an('array').that.have.length(1)
        expect(sousquartiers.selectionToken).to.be.eq('token-for-id-1')
        expect(sousquartiers.hasSelectedFeatures).to.be.true
        expect(sousquartiers.wmsParameters).to.be.an('object').that.be.deep.eq({
            "LAYERS": "SousQuartiers",
            "STYLES": "default",
            "FORMAT": "image/png",
            "DPI": 96,
            "SELECTIONTOKEN": "token-for-id-1"
        })

        // The selection token will be reset when selected features changed
        sousquartiers.selectedFeatures = ['1', '3']
        expect(sousquartiers.selectedFeatures).to.be.an('array').that.have.length(2)
        expect(sousquartiers.selectionToken).to.be.null
        expect(sousquartiers.hasSelectedFeatures).to.be.true
        expect(sousquartiers.wmsParameters).to.be.an('object').that.be.deep.eq({
            "LAYERS": "SousQuartiers",
            "STYLES": "default",
            "FORMAT": "image/png",
            "DPI": 96,
            "SELECTION": "SousQuartiers:1,3"
        })

        // Update filter token with an object
        // An empty object throw an error and does not change anything
        try {
            sousquartiers.selectionToken = {}
        } catch (error) {
            expect(error.name).to.be.eq('ValidationError')
            expect(error.message).to.be.eq('If the expression filter token is an object, it has to have `token` and `selectedFeatures` properties!')
            expect(error).to.be.instanceOf(ValidationError)
        }
        expect(sousquartiers.selectedFeatures).to.be.an('array').that.have.length(2)
        expect(sousquartiers.selectionToken).to.be.null
        expect(sousquartiers.hasSelectedFeatures).to.be.true
        expect(sousquartiers.wmsParameters).to.be.an('object').that.be.deep.eq({
            "LAYERS": "SousQuartiers",
            "STYLES": "default",
            "FORMAT": "image/png",
            "DPI": 96,
            "SELECTION": "SousQuartiers:1,3"
        })

        // An object with `selectedFeatures` and `token` updates the 2 properties
        sousquartiers.selectionToken = {
            selectedFeatures: ['1'],
            token: 'token-for-id-1'
        }
        expect(sousquartiers.selectedFeatures).to.be.an('array').that.have.length(1)
        expect(sousquartiers.selectionToken).to.be.eq('token-for-id-1')
        expect(sousquartiers.hasSelectedFeatures).to.be.true
        expect(sousquartiers.wmsParameters).to.be.an('object').that.be.deep.eq({
            "LAYERS": "SousQuartiers",
            "STYLES": "default",
            "FORMAT": "image/png",
            "DPI": 96,
            "SELECTIONTOKEN": "token-for-id-1"
        })
        // Reset filter and token
        sousquartiers.selectedFeatures = [] // or null
        expect(sousquartiers.selectedFeatures).to.be.an('array').that.have.length(0)
        expect(sousquartiers.selectionToken).to.be.null
        expect(sousquartiers.hasSelectedFeatures).to.be.false
        expect(sousquartiers.wmsParameters).to.be.an('object').that.be.deep.eq({
            "LAYERS": "SousQuartiers",
            "STYLES": "default",
            "FORMAT": "image/png",
            "DPI": 96,
        })
    })

    it('Filter and parameters', function () {
        const capabilities = JSON.parse(readFileSync('./data/montpellier-capabilities.json', 'utf8'));
        expect(capabilities).to.not.be.undefined
        expect(capabilities.Capability).to.not.be.undefined
        const config = JSON.parse(readFileSync('./data/montpellier-config.json', 'utf8'));
        expect(config).to.not.be.undefined

        const layers = new LayersConfig(config.layers);

        const rootCfg = buildLayerTreeConfig(capabilities.Capability.Layer, layers);
        expect(rootCfg).to.be.instanceOf(LayerTreeGroupConfig)

        const layersOrder = buildLayersOrder(config, rootCfg);

        const root = new LayerGroupState(rootCfg, layersOrder);
        expect(root).to.be.instanceOf(LayerGroupState)

        const sousquartiers = root.children[3];
        expect(sousquartiers).to.be.instanceOf(LayerVectorState)
        expect(sousquartiers.wmsParameters).to.be.an('object').that.be.deep.eq({
            "LAYERS": "SousQuartiers",
            "STYLES": "default",
            "FORMAT": "image/png",
            "DPI": 96,
        })
        expect(sousquartiers.symbology).to.be.null
        expect(sousquartiers.selectedFeatures).to.be.an('array').that.have.length(0)
        expect(sousquartiers.selectionToken).to.be.null
        expect(sousquartiers.hasSelectedFeatures).to.be.false
        expect(sousquartiers.expressionFilter).to.be.null
        expect(sousquartiers.filterToken).to.be.null
        expect(sousquartiers.isFiltered).to.be.false

        sousquartiers.expressionFilter = '"QUARTMNO" = \'HO\''
        expect(sousquartiers.expressionFilter).to.be.a('string').that.be.eq('"QUARTMNO" = \'HO\'')
        expect(sousquartiers.filterToken).to.be.null
        expect(sousquartiers.isFiltered).to.be.true
        expect(sousquartiers.wmsParameters).to.be.an('object').that.be.deep.eq({
            "LAYERS": "SousQuartiers",
            "STYLES": "default",
            "FORMAT": "image/png",
            "DPI": 96,
            "FILTER": "SousQuartiers:\"QUARTMNO\" = 'HO'"
        })

        sousquartiers.expressionFilter = '"QUARTMNO" IN ( \'HO\' , \'PA\' )'
        expect(sousquartiers.expressionFilter).to.be.a('string').that.be.eq('"QUARTMNO" IN ( \'HO\' , \'PA\' )')
        expect(sousquartiers.filterToken).to.be.null
        expect(sousquartiers.isFiltered).to.be.true
        expect(sousquartiers.wmsParameters).to.be.an('object').that.be.deep.eq({
            "LAYERS": "SousQuartiers",
            "STYLES": "default",
            "FORMAT": "image/png",
            "DPI": 96,
            "FILTER": "SousQuartiers:\"QUARTMNO\" IN ( 'HO' , 'PA' )"
        })

        sousquartiers.expressionFilter = null
        expect(sousquartiers.expressionFilter).to.be.null
        expect(sousquartiers.filterToken).to.be.null
        expect(sousquartiers.isFiltered).to.be.false
        expect(sousquartiers.wmsParameters).to.be.an('object').that.be.deep.eq({
            "LAYERS": "SousQuartiers",
            "STYLES": "default",
            "FORMAT": "image/png",
            "DPI": 96,
        })

        try {
            sousquartiers.expressionFilter = {}
        } catch (error) {
            expect(error.name).to.be.eq('ValidationError')
            expect(error.message).to.be.eq('Expression filter could only be null or a string!')
            expect(error).to.be.instanceOf(ValidationError)
        }
        expect(sousquartiers.expressionFilter).to.be.null
        expect(sousquartiers.filterToken).to.be.null
        expect(sousquartiers.isFiltered).to.be.false
        expect(sousquartiers.wmsParameters).to.be.an('object').that.be.deep.eq({
            "LAYERS": "SousQuartiers",
            "STYLES": "default",
            "FORMAT": "image/png",
            "DPI": 96,
        })

        sousquartiers.expressionFilter = '"QUARTMNO" = \'HO\''
        expect(sousquartiers.expressionFilter).to.be.a('string').that.be.eq('"QUARTMNO" = \'HO\'')
        expect(sousquartiers.filterToken).to.be.null
        expect(sousquartiers.isFiltered).to.be.true
        expect(sousquartiers.wmsParameters).to.be.an('object').that.be.deep.eq({
            "LAYERS": "SousQuartiers",
            "STYLES": "default",
            "FORMAT": "image/png",
            "DPI": 96,
            "FILTER": "SousQuartiers:\"QUARTMNO\" = 'HO'"
        })

        sousquartiers.filterToken = 'token-for-id-1'
        expect(sousquartiers.expressionFilter).to.be.a('string').that.be.eq('"QUARTMNO" = \'HO\'')
        expect(sousquartiers.filterToken).to.be.eq('token-for-id-1')
        expect(sousquartiers.isFiltered).to.be.true
        expect(sousquartiers.wmsParameters).to.be.an('object').that.be.deep.eq({
            "LAYERS": "SousQuartiers",
            "STYLES": "default",
            "FORMAT": "image/png",
            "DPI": 96,
            "FILTERTOKEN": "token-for-id-1"
        })

        sousquartiers.filterToken = null
        expect(sousquartiers.expressionFilter).to.be.a('string').that.be.eq('"QUARTMNO" = \'HO\'')
        expect(sousquartiers.selectionToken).to.be.null
        expect(sousquartiers.isFiltered).to.be.true
        expect(sousquartiers.wmsParameters).to.be.an('object').that.be.deep.eq({
            "LAYERS": "SousQuartiers",
            "STYLES": "default",
            "FORMAT": "image/png",
            "DPI": 96,
            "FILTER": "SousQuartiers:\"QUARTMNO\" = 'HO'"
        })

        try {
            sousquartiers.filterToken = 1
        } catch (error) {
            expect(error.name).to.be.eq('ValidationError')
            expect(error.message).to.be.eq('Expression filter token could only be null, a string or an object!')
            expect(error).to.be.instanceOf(ValidationError)
        }
        expect(sousquartiers.expressionFilter).to.be.a('string').that.be.eq('"QUARTMNO" = \'HO\'')
        expect(sousquartiers.selectionToken).to.be.null
        expect(sousquartiers.isFiltered).to.be.true
        expect(sousquartiers.wmsParameters).to.be.an('object').that.be.deep.eq({
            "LAYERS": "SousQuartiers",
            "STYLES": "default",
            "FORMAT": "image/png",
            "DPI": 96,
            "FILTER": "SousQuartiers:\"QUARTMNO\" = 'HO'"
        })

        sousquartiers.filterToken = 'token-for-id-1'
        expect(sousquartiers.expressionFilter).to.be.a('string').that.be.eq('"QUARTMNO" = \'HO\'')
        expect(sousquartiers.filterToken).to.be.eq('token-for-id-1')
        expect(sousquartiers.isFiltered).to.be.true
        expect(sousquartiers.wmsParameters).to.be.an('object').that.be.deep.eq({
            "LAYERS": "SousQuartiers",
            "STYLES": "default",
            "FORMAT": "image/png",
            "DPI": 96,
            "FILTERTOKEN": "token-for-id-1"
        })

        sousquartiers.expressionFilter = '"QUARTMNO" IN ( \'HO\' , \'PA\' )'
        expect(sousquartiers.expressionFilter).to.be.a('string').that.be.eq('"QUARTMNO" IN ( \'HO\' , \'PA\' )')
        expect(sousquartiers.filterToken).to.be.null
        expect(sousquartiers.isFiltered).to.be.true
        expect(sousquartiers.wmsParameters).to.be.an('object').that.be.deep.eq({
            "LAYERS": "SousQuartiers",
            "STYLES": "default",
            "FORMAT": "image/png",
            "DPI": 96,
            "FILTER": "SousQuartiers:\"QUARTMNO\" IN ( 'HO' , 'PA' )"
        })

        // Update filter token with an object
        // An empty object throw an error and does not change anything
        try {
            sousquartiers.filterToken = {}
        } catch (error) {
            expect(error.name).to.be.eq('ValidationError')
            expect(error.message).to.be.eq('If the expression filter token is an object, it has to have `token` and `expressionFilter` properties!')
            expect(error).to.be.instanceOf(ValidationError)
        }
        expect(sousquartiers.expressionFilter).to.be.a('string').that.be.eq('"QUARTMNO" IN ( \'HO\' , \'PA\' )')
        expect(sousquartiers.filterToken).to.be.null
        expect(sousquartiers.isFiltered).to.be.true
        expect(sousquartiers.wmsParameters).to.be.an('object').that.be.deep.eq({
            "LAYERS": "SousQuartiers",
            "STYLES": "default",
            "FORMAT": "image/png",
            "DPI": 96,
            "FILTER": "SousQuartiers:\"QUARTMNO\" IN ( 'HO' , 'PA' )"
        })

        // An object with `expressionFilter` and `token` updates the 2 properties
        sousquartiers.filterToken = {
            expressionFilter: '"QUARTMNO" = \'HO\'',
            token: 'token-for-id-1'
        }
        expect(sousquartiers.expressionFilter).to.be.a('string').that.be.eq('"QUARTMNO" = \'HO\'')
        expect(sousquartiers.filterToken).to.be.eq('token-for-id-1')
        expect(sousquartiers.isFiltered).to.be.true
        expect(sousquartiers.wmsParameters).to.be.an('object').that.be.deep.eq({
            "LAYERS": "SousQuartiers",
            "STYLES": "default",
            "FORMAT": "image/png",
            "DPI": 96,
            "FILTERTOKEN": "token-for-id-1"
        })

        // Reset filter and token
        sousquartiers.expressionFilter = null
        expect(sousquartiers.expressionFilter).to.be.null
        expect(sousquartiers.filterToken).to.be.null
        expect(sousquartiers.isFiltered).to.be.false
        expect(sousquartiers.wmsParameters).to.be.an('object').that.be.deep.eq({
            "LAYERS": "SousQuartiers",
            "STYLES": "default",
            "FORMAT": "image/png",
            "DPI": 96,
        })
    })

    it('Mutually exclusive', function () {
        const capabilities = JSON.parse(readFileSync('./data/mutually-exclusive-capabilities.json', 'utf8'));
        expect(capabilities).to.not.be.undefined
        expect(capabilities.Capability).to.not.be.undefined
        const config = JSON.parse(readFileSync('./data/mutually-exclusive-config.json', 'utf8'));
        expect(config).to.not.be.undefined

        const layers = new LayersConfig(config.layers);

        const rootCfg = buildLayerTreeConfig(capabilities.Capability.Layer, layers);
        expect(rootCfg).to.be.instanceOf(LayerTreeGroupConfig)

        const layersOrder = buildLayersOrder(config, rootCfg);

        const root = new LayerGroupState(rootCfg, layersOrder);
        expect(root).to.be.instanceOf(LayerGroupState)

        const group = root.children[0]
        expect(group).to.be.instanceOf(LayerGroupState)
        expect(group.mutuallyExclusive).to.be.true
        expect(group.checked).to.be.true
        expect(group.visibility).to.be.true
        expect(group.childrenCount).to.be.eq(2)

        const layer1 = group.children[0]
        expect(layer1).to.be.instanceOf(LayerVectorState)
        expect(layer1.checked).to.be.true
        expect(layer1.visibility).to.be.true
        const layer2 = group.children[1]
        expect(layer2).to.be.instanceOf(LayerVectorState)
        expect(layer2.checked).to.be.false
        expect(layer2.visibility).to.be.false

        layer2.checked = true;
        expect(group.checked).to.be.true
        expect(group.visibility).to.be.true
        expect(layer1.checked).to.be.false
        expect(layer1.visibility).to.be.false
        expect(layer2.checked).to.be.true
        expect(layer2.visibility).to.be.true

        group.checked = false;
        expect(group.checked).to.be.false
        expect(group.visibility).to.be.false
        expect(layer1.checked).to.be.false
        expect(layer1.visibility).to.be.false
        expect(layer2.checked).to.be.true
        expect(layer2.visibility).to.be.false

        layer1.checked = true;
        expect(group.checked).to.be.true
        expect(group.visibility).to.be.true
        expect(layer1.checked).to.be.true
        expect(layer1.visibility).to.be.true
        expect(layer2.checked).to.be.false
        expect(layer2.visibility).to.be.false

        layer1.checked = false;
        expect(group.checked).to.be.true
        expect(group.visibility).to.be.true
        expect(layer1.checked).to.be.false
        expect(layer1.visibility).to.be.false
        expect(layer2.checked).to.be.false
        expect(layer2.visibility).to.be.false
    })
})

describe('LayersAndGroupsCollection', function () {
    it('Valid', function () {
        const capabilities = JSON.parse(readFileSync('./data/montpellier-capabilities.json', 'utf8'));
        expect(capabilities).to.not.be.undefined
        expect(capabilities.Capability).to.not.be.undefined
        const config = JSON.parse(readFileSync('./data/montpellier-config.json', 'utf8'));
        expect(config).to.not.be.undefined

        const layers = new LayersConfig(config.layers);

        const rootCfg = buildLayerTreeConfig(capabilities.Capability.Layer, layers);
        expect(rootCfg).to.be.instanceOf(LayerTreeGroupConfig)

        const layersOrder = buildLayersOrder(config, rootCfg);

        const collection = new LayersAndGroupsCollection(rootCfg, layersOrder);

        const root = collection.root;
        expect(root).to.be.instanceOf(LayerGroupState)

        expect(collection.layerNames).to.be.an('array').that.have.ordered.members([
            "points_of_interest",
            "edition_line",
            "areas_of_interest",
            "bus_stops",
            "bus",
            "tramway_ref",
            "tramway_pivot",
            "tram_stop_work",
            "tramstop",
            "tramway",
            "publicbuildings",
            "publicbuildings_tramstop",
            "donnes_sociodemo_sous_quartiers",
            "SousQuartiers",
            "Quartiers",
            "VilleMTP_MTP_Quartiers_2011_4326",
            "osm-mapnik",
            "osm-stamen-toner"
        ])

        let names = []
        for (const layer of collection.layers) {
            names.push(layer.name)
        }
        expect(names).to.have.ordered.members(collection.layerNames)

        expect(collection.groupNames).to.be.an('array').that.have.ordered.members([
            "Edition",
            "datalayers",
            "Bus",
            "Tramway",
            "Buildings",
            "Overview",
            "Hidden"
        ])
        names = []
        for (const group of collection.groups) {
            names.push(group.name)
        }
        expect(names).to.have.ordered.members(collection.groupNames)

        const busStops = collection.getLayerByName('bus_stops')
        expect(busStops).to.be.instanceOf(LayerVectorState)
        expect(busStops.id).to.be.eq('bus_stops20121106170806413')
        expect(busStops.name).to.be.eq('bus_stops')
        expect(busStops.type).to.be.eq('layer')
        expect(busStops.level).to.be.eq(3)
        expect(busStops.wmsName).to.be.eq('bus_stops')
        expect(busStops.wmsTitle).to.be.eq('bus_stops')
        expect(busStops.wmsAbstract).to.be.null
        expect(busStops.link).to.be.eq('')
        expect(busStops.wmsGeographicBoundingBox).to.be.instanceOf(LayerGeographicBoundingBoxConfig)
        expect(busStops.wmsGeographicBoundingBox.west).to.be.eq(3.55326)
        expect(busStops.wmsGeographicBoundingBox.south).to.be.eq(43.526928)
        expect(busStops.wmsGeographicBoundingBox.east).to.be.eq(4.039132)
        expect(busStops.wmsGeographicBoundingBox.north).to.be.eq(43.752341)
        expect(busStops.wmsBoundingBoxes).to.be.an('array').that.have.length(3)
        expect(busStops.wmsBoundingBoxes[0]).to.be.instanceOf(LayerBoundingBoxConfig)
        expect(busStops.wmsBoundingBoxes[0].crs).to.be.eq('EPSG:3857')
        expect(busStops.wmsBoundingBoxes[0].xmin).to.be.eq(395547.093)
        expect(busStops.wmsBoundingBoxes[0].ymin).to.be.eq(5392522.697)
        expect(busStops.wmsBoundingBoxes[0].xmax).to.be.eq(449634.007)
        expect(busStops.wmsBoundingBoxes[0].ymax).to.be.eq(5427196.032)
        expect(busStops.wmsBoundingBoxes[1].crs).to.be.eq('EPSG:4326')
        expect(busStops.wmsBoundingBoxes[1].xmin).to.be.eq(busStops.wmsGeographicBoundingBox.west)
        expect(busStops.wmsBoundingBoxes[1].ymin).to.be.eq(busStops.wmsGeographicBoundingBox.south)
        expect(busStops.wmsBoundingBoxes[1].xmax).to.be.eq(busStops.wmsGeographicBoundingBox.east)
        expect(busStops.wmsBoundingBoxes[1].ymax).to.be.eq(busStops.wmsGeographicBoundingBox.north)
        expect(busStops.wmsMinScaleDenominator).to.be.eq(0)
        expect(busStops.wmsMaxScaleDenominator).to.be.eq(15000)
        expect(busStops.checked).to.be.false
        expect(busStops.visibility).to.be.false
        expect(busStops.baseLayer).to.be.false
        expect(busStops.displayInLegend).to.be.true
        expect(busStops.imageFormat).to.be.eq('image/png')
        expect(busStops.singleTile).to.be.true
        expect(busStops.cached).to.be.false
        expect(busStops.layerConfig).to.not.be.null
        expect(busStops.layerType).to.be.eq('vector')
        expect(busStops.layerOrder).to.be.eq(3)
        expect(busStops.extent).to.be.instanceOf(Extent)
        expect(busStops.extent.xmin).to.be.eq(3.55326)
        expect(busStops.extent.ymin).to.be.eq(43.526928)
        expect(busStops.extent.xmax).to.be.eq(4.039131)
        expect(busStops.extent.ymax).to.be.eq(43.752341)
        expect(busStops.crs).to.be.eq('EPSG:4326')
        expect(busStops.popup).to.be.true
        expect(busStops.popupMaxFeatures).to.be.eq(10)
        expect(busStops.wmsSelectedStyleName).to.be.eq('default')
        expect(busStops.wmsStyles).to.be.an('array').that.have.length(1)
        expect(busStops.wmsAttribution).to.be.null
        expect(busStops.isSpatial).to.be.true
        expect(busStops.geometryType).to.be.eq('point')
        expect(busStops.popupDisplayChildren).to.be.false
        expect(busStops.wmsParameters).to.be.an('object').that.be.deep.eq({
            "LAYERS": "bus_stops",
            "STYLES": "default",
            "FORMAT": "image/png",
            "DPI": 96,
        })
        expect(busStops.symbology).to.be.null
        expect(busStops.selectedFeatures).to.be.an('array').that.have.length(0)
        expect(busStops.selectionToken).to.be.null
        expect(busStops.expressionFilter).to.be.null
        expect(busStops.filterToken).to.be.null

        const donneesSocio = collection.getLayerByName('donnes_sociodemo_sous_quartiers')
        expect(donneesSocio).to.be.instanceOf(LayerVectorState)
        expect(donneesSocio.id).to.be.eq('donnes_sociodemo_sous_quartiers20160121144525075')
        expect(donneesSocio.name).to.be.eq('donnes_sociodemo_sous_quartiers')
        expect(donneesSocio.type).to.be.eq('layer')
        expect(donneesSocio.level).to.be.eq(1)
        expect(donneesSocio.wmsGeographicBoundingBox).to.be.null
        expect(donneesSocio.wmsBoundingBoxes).to.be.an('array').that.have.length(0)
        expect(donneesSocio.checked).to.be.false
        expect(donneesSocio.visibility).to.be.false
        expect(donneesSocio.layerType).to.be.eq('vector')
        expect(donneesSocio.layerOrder).to.be.eq(-1)
        expect(donneesSocio.extent).to.be.null
        expect(donneesSocio.crs).to.be.eq('EPSG:4326')
        expect(donneesSocio.isSpatial).to.be.false
        expect(donneesSocio.geometryType).to.be.eq('none')
        expect(donneesSocio.popupDisplayChildren).to.be.false

        const sousquartiers = collection.getLayerByName('SousQuartiers')
        expect(sousquartiers).to.be.instanceOf(LayerVectorState)
        expect(sousquartiers.id).to.be.eq('SousQuartiers20160121124316563')
        expect(sousquartiers.name).to.be.eq('SousQuartiers')
        expect(sousquartiers.type).to.be.eq('layer')
        expect(sousquartiers.level).to.be.eq(1)
        expect(sousquartiers.checked).to.be.false
        expect(sousquartiers.visibility).to.be.false
        expect(sousquartiers.isSpatial).to.be.true
        expect(sousquartiers.geometryType).to.be.eq('polygon')
        expect(sousquartiers.wmsName).to.be.eq('SousQuartiers')
        expect(sousquartiers.layerConfig).to.not.be.null;
        expect(sousquartiers.wmsStyles).to.be.an('array')
        expect(sousquartiers.wmsStyles).to.have.length(1)
        expect(sousquartiers.wmsStyles[0].wmsName).to.be.eq('default')
        expect(sousquartiers.wmsStyles[0].wmsTitle).to.be.eq('default')
        expect(sousquartiers.wmsSelectedStyleName).to.be.eq('default')
        expect(sousquartiers.wmsAttribution).to.be.null
        expect(sousquartiers.wmsParameters).to.be.an('object').that.be.deep.eq({
            "LAYERS": "SousQuartiers",
            "STYLES": "default",
            "FORMAT": "image/png",
            "DPI": 96,
        })
        expect(sousquartiers.symbology).to.be.null
        expect(sousquartiers.selectedFeatures).to.be.an('array').that.have.length(0)
        expect(sousquartiers.selectionToken).to.be.null
        expect(sousquartiers.expressionFilter).to.be.null
        expect(sousquartiers.filterToken).to.be.null

        const osm = collection.getLayerByName('osm-mapnik')
        expect(osm).to.be.instanceOf(LayerRasterState)
        expect(osm.id).to.be.eq('osm_mapnik20180315181738526')
        expect(osm.name).to.be.eq('osm-mapnik')
        expect(osm.wmsName).to.be.eq('osm-mapnik')
        expect(osm.wmsGeographicBoundingBox).to.be.instanceOf(LayerGeographicBoundingBoxConfig)
        expect(osm.wmsGeographicBoundingBox.west).to.be.eq(-180)
        expect(osm.wmsGeographicBoundingBox.south).to.be.eq(-85.051129)
        expect(osm.wmsGeographicBoundingBox.east).to.be.eq(180)
        expect(osm.wmsGeographicBoundingBox.north).to.be.eq(85.051129)
        expect(osm.layerOrder).to.be.eq(11)
        expect(osm.extent).to.be.instanceOf(Extent)
        expect(osm.extent.xmin).to.be.eq(-20037508.342789244)
        expect(osm.extent.ymin).to.be.eq(-20037508.342789255)
        expect(osm.extent.xmax).to.be.eq(20037508.342789244)
        expect(osm.extent.ymax).to.be.eq(20037508.342789244)
        expect(osm.crs).to.be.eq('EPSG:3857')
        expect(osm.wmsParameters).to.be.an('object').that.be.deep.eq({
            "LAYERS": "osm-mapnik",
            "STYLES": "default",
            "FORMAT": "image/png",
            "DPI": 96,
        })
        expect(osm.externalWmsToggle).to.be.true
        expect(osm.externalAccess).to.be.an('object').that.be.deep.eq({
            "crs": "EPSG:3857",
            "format": "",
            "type": "xyz",
            "url": "http://tile.openstreetmap.org/{z}/{x}/{y}.png"
        })

        // Try get an unknown layer
        try {
            collection.getLayerByName('sous-quartiers')
        } catch (error) {
            expect(error.name).to.be.eq('RangeError')
            expect(error.message).to.be.eq('The layer name `sous-quartiers` is unknown!')
            expect(error).to.be.instanceOf(RangeError)
        }

        expect(collection.getLayerById('bus_stops20121106170806413')).to.be.deep.eq(busStops)
        expect(collection.getLayerById('donnes_sociodemo_sous_quartiers20160121144525075')).to.be.deep.eq(donneesSocio)
        expect(collection.getLayerById('SousQuartiers20160121124316563')).to.be.deep.eq(sousquartiers)
        expect(collection.getLayerById('osm_mapnik20180315181738526')).to.be.deep.eq(osm)


        // Try get an unknown layer
        try {
            collection.getLayerById('sous-quartiers')
        } catch (error) {
            expect(error.name).to.be.eq('RangeError')
            expect(error.message).to.be.eq('The layer id `sous-quartiers` is unknown!')
            expect(error).to.be.instanceOf(RangeError)
        }

        expect(collection.getLayerByWmsName('bus_stops')).to.be.deep.eq(busStops)
        expect(collection.getLayerByWmsName('donnes_sociodemo_sous_quartiers')).to.be.deep.eq(donneesSocio)
        expect(collection.getLayerByWmsName('SousQuartiers')).to.be.deep.eq(sousquartiers)
        expect(collection.getLayerByWmsName('osm-mapnik')).to.be.deep.eq(osm)

        // Try get an unknown layer
        try {
            collection.getLayerByWmsName('sous-quartiers')
        } catch (error) {
            expect(error.name).to.be.eq('RangeError')
            expect(error.message).to.be.eq('The layer WMS Name `sous-quartiers` is unknown!')
            expect(error).to.be.instanceOf(RangeError)
        }


        const transports = collection.getGroupByName('datalayers');
        expect(transports).to.be.instanceOf(LayerGroupState)
        expect(transports.id).to.be.eq('datalayers')
        expect(transports.wmsName).to.be.eq('datalayers')
        expect(transports.wmsMinScaleDenominator).to.be.eq(-1)
        expect(transports.wmsMaxScaleDenominator).to.be.eq(-1)

        const bus = collection.getGroupByName('Bus');
        expect(bus).to.be.instanceOf(LayerGroupState)
        expect(bus.id).to.be.eq('Bus')
        expect(bus.name).to.be.eq('Bus')
        expect(bus.type).to.be.eq('group')
        expect(bus.level).to.be.eq(2)
        expect(bus.wmsName).to.be.eq('Bus')
        expect(bus.wmsTitle).to.be.eq('Bus')
        expect(bus.wmsAbstract).to.be.null
        expect(bus.link).to.be.eq('http://www.montpellier-agglo.com/tam/page.php?id_rubrique=29')
        expect(bus.wmsGeographicBoundingBox).to.be.instanceOf(LayerGeographicBoundingBoxConfig)
        expect(bus.wmsGeographicBoundingBox.west).to.be.eq(3.55326)
        expect(bus.wmsGeographicBoundingBox.south).to.be.eq(43.5265)
        expect(bus.wmsGeographicBoundingBox.east).to.be.eq(4.081239)
        expect(bus.wmsGeographicBoundingBox.north).to.be.eq(43.761579)
        expect(bus.wmsBoundingBoxes).to.be.an('array').that.have.length(3)
        expect(bus.wmsBoundingBoxes[0]).to.be.instanceOf(LayerBoundingBoxConfig)
        expect(bus.wmsBoundingBoxes[0].crs).to.be.eq('EPSG:3857')
        expect(bus.wmsBoundingBoxes[0].xmin).to.be.eq(395547.093)
        expect(bus.wmsBoundingBoxes[0].ymin).to.be.eq(5392456.984)
        expect(bus.wmsBoundingBoxes[0].xmax).to.be.eq(454321.449)
        expect(bus.wmsBoundingBoxes[0].ymax).to.be.eq(5428619.815)
        expect(bus.wmsBoundingBoxes[1].crs).to.be.eq('EPSG:4326')
        expect(bus.wmsBoundingBoxes[1].xmin).to.be.eq(bus.wmsGeographicBoundingBox.west)
        expect(bus.wmsBoundingBoxes[1].ymin).to.be.eq(bus.wmsGeographicBoundingBox.south)
        expect(bus.wmsBoundingBoxes[1].xmax).to.be.eq(bus.wmsGeographicBoundingBox.east)
        expect(bus.wmsBoundingBoxes[1].ymax).to.be.eq(bus.wmsGeographicBoundingBox.north)
        expect(bus.wmsMinScaleDenominator).to.be.eq(-1)
        expect(bus.wmsMaxScaleDenominator).to.be.eq(40001)
        expect(bus.checked).to.be.false
        expect(bus.visibility).to.be.false
        expect(bus.baseLayer).to.be.false
        expect(bus.displayInLegend).to.be.true
        expect(bus.imageFormat).to.be.eq('image/png')
        expect(bus.singleTile).to.be.false
        expect(bus.cached).to.be.false
        expect(bus.layerConfig).to.not.be.null;
        expect(bus.groupAsLayer).to.be.false
        expect(bus.mutuallyExclusive).to.be.false
        expect(bus.childrenCount).to.be.eq(2)
        expect(bus.findLayerNames()).to.be.an('array').that.have.ordered.members([
            "bus_stops",
            "bus",
        ])

        const hidden = collection.getGroupByName('Hidden');
        expect(hidden).to.be.instanceOf(LayerGroupState)
        expect(hidden.id).to.be.eq('Hidden')
        expect(hidden.name).to.be.eq('Hidden')
        expect(hidden.wmsGeographicBoundingBox).to.be.instanceOf(LayerGeographicBoundingBoxConfig)
        expect(hidden.wmsGeographicBoundingBox.west).to.be.eq(-180)
        expect(hidden.wmsGeographicBoundingBox.south).to.be.eq(-85.051129)
        expect(hidden.wmsGeographicBoundingBox.east).to.be.eq(180)
        expect(hidden.wmsGeographicBoundingBox.north).to.be.eq(85.051129)
        expect(hidden.childrenCount).to.be.eq(2)

        // Try get an unknown group
        try {
            collection.getGroupByName('sous-quartiers')
        } catch (error) {
            expect(error.name).to.be.eq('RangeError')
            expect(error.message).to.be.eq('The group name `sous-quartiers` is unknown!')
            expect(error).to.be.instanceOf(RangeError)
        }

        expect(collection.getGroupByWmsName('datalayers')).to.be.deep.eq(transports)
        expect(collection.getGroupByWmsName('Bus')).to.be.deep.eq(bus)
        expect(collection.getGroupByWmsName('Hidden')).to.be.deep.eq(hidden)

        // Try get an unknown group
        try {
            collection.getGroupByWmsName('sous-quartiers')
        } catch (error) {
            expect(error.name).to.be.eq('RangeError')
            expect(error.message).to.be.eq('The group WMS Name `sous-quartiers` is unknown!')
            expect(error).to.be.instanceOf(RangeError)
        }

        expect(collection.getLayerOrGroupByName('bus_stops')).to.be.deep.eq(busStops)
        expect(collection.getLayerOrGroupByName('donnes_sociodemo_sous_quartiers')).to.be.deep.eq(donneesSocio)
        expect(collection.getLayerOrGroupByName('SousQuartiers')).to.be.deep.eq(sousquartiers)
        expect(collection.getLayerOrGroupByName('osm-mapnik')).to.be.deep.eq(osm)
        expect(collection.getLayerOrGroupByName('datalayers')).to.be.deep.eq(transports)
        expect(collection.getLayerOrGroupByName('Bus')).to.be.deep.eq(bus)
        expect(collection.getLayerOrGroupByName('Hidden')).to.be.deep.eq(hidden)

        // Try get an unknown layer or group
        try {
            collection.getLayerOrGroupByName('sous-quartiers')
        } catch (error) {
            expect(error.name).to.be.eq('RangeError')
            expect(error.message).to.be.eq('The name `sous-quartiers` is unknown!')
            expect(error).to.be.instanceOf(RangeError)
        }

        expect(collection.getLayerOrGroupByWmsName('bus_stops')).to.be.deep.eq(busStops)
        expect(collection.getLayerOrGroupByWmsName('donnes_sociodemo_sous_quartiers')).to.be.deep.eq(donneesSocio)
        expect(collection.getLayerOrGroupByWmsName('SousQuartiers')).to.be.deep.eq(sousquartiers)
        expect(collection.getLayerOrGroupByWmsName('osm-mapnik')).to.be.deep.eq(osm)
        expect(collection.getLayerOrGroupByWmsName('datalayers')).to.be.deep.eq(transports)
        expect(collection.getLayerOrGroupByWmsName('Bus')).to.be.deep.eq(bus)
        expect(collection.getLayerOrGroupByWmsName('Hidden')).to.be.deep.eq(hidden)

        // Try get an unknown layer or group
        try {
            collection.getLayerOrGroupByWmsName('sous-quartiers')
        } catch (error) {
            expect(error.name).to.be.eq('RangeError')
            expect(error.message).to.be.eq('The WMS Name `sous-quartiers` is unknown!')
            expect(error).to.be.instanceOf(RangeError)
        }
    })

    it('Checked & visibility', function () {
        const capabilities = JSON.parse(readFileSync('./data/montpellier-capabilities.json', 'utf8'));
        expect(capabilities).to.not.be.undefined
        expect(capabilities.Capability).to.not.be.undefined
        const config = JSON.parse(readFileSync('./data/montpellier-config.json', 'utf8'));
        expect(config).to.not.be.undefined

        const layers = new LayersConfig(config.layers);

        const rootCfg = buildLayerTreeConfig(capabilities.Capability.Layer, layers);
        expect(rootCfg).to.be.instanceOf(LayerTreeGroupConfig)

        const layersOrder = buildLayersOrder(config, rootCfg);

        const collection = new LayersAndGroupsCollection(rootCfg, layersOrder);

        let collectionLayerVisibilityChangedEvt = [];
        let collectionGroupVisibilityChangedEvt = [];
        collection.addListener(evt => {
            collectionLayerVisibilityChangedEvt.push(evt)
        }, 'layer.visibility.changed');
        collection.addListener(evt => {
            collectionGroupVisibilityChangedEvt.push(evt)
        }, 'group.visibility.changed');

        const sousquartiers = collection.getLayerByName('SousQuartiers')
        expect(sousquartiers).to.be.instanceOf(LayerVectorState)

        expect(sousquartiers.isSpatial).to.be.true
        expect(sousquartiers.checked).to.be.false
        expect(sousquartiers.visibility).to.be.false

        let sousquartiersVisibilityChangedEvt = null;
        sousquartiers.addListener(evt => {
            sousquartiersVisibilityChangedEvt = evt
        }, 'layer.visibility.changed');

        // Change value
        sousquartiers.checked = true;
        // Event dispatched
        expect(sousquartiersVisibilityChangedEvt).to.not.be.null
        expect(sousquartiersVisibilityChangedEvt.name).to.be.eq('SousQuartiers')
        expect(sousquartiersVisibilityChangedEvt.visibility).to.be.true
        // Values have changed
        expect(sousquartiers.checked).to.be.true
        expect(sousquartiers.visibility).to.be.true
        // Events dispatched at root level
        expect(collectionLayerVisibilityChangedEvt).to.have.length(1)
        expect(collectionLayerVisibilityChangedEvt[0]).to.be.deep.equal(sousquartiersVisibilityChangedEvt)
        expect(collectionGroupVisibilityChangedEvt).to.have.length(0)

        // Reset
        sousquartiersVisibilityChangedEvt = null;
        collectionLayerVisibilityChangedEvt = [];
        // Set same value
        sousquartiers.checked = true;
        // Nothing changed
        expect(sousquartiersVisibilityChangedEvt).to.be.null
        expect(collectionLayerVisibilityChangedEvt).to.have.length(0)

        // Change value
        sousquartiers.checked = false;
        // Event dispatched
        expect(sousquartiersVisibilityChangedEvt).to.not.be.null
        expect(sousquartiersVisibilityChangedEvt.name).to.be.eq('SousQuartiers')
        expect(sousquartiersVisibilityChangedEvt.visibility).to.be.false
        // Values have changed
        expect(sousquartiers.checked).to.be.false
        expect(sousquartiers.visibility).to.be.false
        // Events dispatched at root level
        expect(collectionLayerVisibilityChangedEvt).to.have.length(1)
        expect(collectionLayerVisibilityChangedEvt[0]).to.be.deep.equal(sousquartiersVisibilityChangedEvt)
        expect(collectionGroupVisibilityChangedEvt).to.have.length(0)

        // Reset
        sousquartiersVisibilityChangedEvt = null;
        collectionLayerVisibilityChangedEvt = [];

        // Get not spatial vector layer
        const donneesSocio = collection.getLayerByName('donnes_sociodemo_sous_quartiers')
        expect(donneesSocio).to.be.instanceOf(LayerVectorState)

        expect(donneesSocio.isSpatial).to.be.false
        expect(donneesSocio.checked).to.be.false
        expect(donneesSocio.visibility).to.be.false

        // Try to checked not spatial vector layer
        donneesSocio.checked = true;
        // not spatial vector layer checked changed but nothing else
        expect(donneesSocio.checked).to.be.true
        expect(donneesSocio.visibility).to.be.false
        expect(collectionLayerVisibilityChangedEvt).to.have.length(0)
        // Reset
        donneesSocio.checked = false;
        expect(donneesSocio.checked).to.be.false
        expect(donneesSocio.visibility).to.be.false
        expect(collectionLayerVisibilityChangedEvt).to.have.length(0)

        // Test through groups
        const transports = collection.getGroupByName('datalayers');
        expect(transports).to.be.instanceOf(LayerGroupState)

        expect(transports.checked).to.be.true
        expect(transports.visibility).to.be.true

        let transportsLayerVisibilityChangedEvt = [];
        let transportsGroupVisibilityChangedEvt = [];
        transports.addListener(evt => {
            transportsLayerVisibilityChangedEvt.push(evt)
        }, 'layer.visibility.changed');
        transports.addListener(evt => {
            transportsGroupVisibilityChangedEvt.push(evt)
        }, 'group.visibility.changed');

        const tramGroup = collection.getGroupByName('Tramway')
        expect(tramGroup).to.be.instanceOf(LayerGroupState)

        expect(tramGroup.checked).to.be.true
        expect(tramGroup.visibility).to.be.true

        let tramGroupLayerVisibilityChangedEvt = [];
        let tramGroupGroupVisibilityChangedEvt = null;
        tramGroup.addListener(evt => {
            tramGroupLayerVisibilityChangedEvt.push(evt)
        }, 'layer.visibility.changed');
        tramGroup.addListener(evt => {
            tramGroupGroupVisibilityChangedEvt = evt
        }, 'group.visibility.changed');

        const tramStopWork = collection.getLayerByName('tram_stop_work')
        expect(tramStopWork).to.be.instanceOf(LayerVectorState)

        expect(tramStopWork.isSpatial).to.be.false
        expect(tramStopWork.checked).to.be.false
        expect(tramStopWork.visibility).to.be.false

        const tramway = collection.getLayerByName('tramway')
        expect(tramway).to.be.instanceOf(LayerVectorState)

        expect(tramway.isSpatial).to.be.true
        expect(tramway.checked).to.be.true
        expect(tramway.visibility).to.be.true

        let tramwayLayerVisibilityChangedEvt = null;
        tramway.addListener(evt => {
            tramwayLayerVisibilityChangedEvt = evt
        }, 'layer.visibility.changed');

        // Set all in transports not visible
        transports.checked = false
        // Events dispatched
        expect(transportsGroupVisibilityChangedEvt).to.have.length(3)
        expect(transportsGroupVisibilityChangedEvt[0].name).to.be.eq('Buildings')
        expect(transportsGroupVisibilityChangedEvt[1].name).to.be.eq('Tramway')
        expect(transportsGroupVisibilityChangedEvt[2].name).to.be.eq('datalayers')
        expect(transportsLayerVisibilityChangedEvt).to.have.length(3)
        expect(transportsLayerVisibilityChangedEvt[0].name).to.be.eq('tramstop')
        expect(transportsLayerVisibilityChangedEvt[1].name).to.be.eq('tramway')
        expect(transportsLayerVisibilityChangedEvt[2].name).to.be.eq('publicbuildings')
        expect(tramGroupGroupVisibilityChangedEvt).to.not.be.null
        expect(tramGroupGroupVisibilityChangedEvt.name).to.be.eq('Tramway')
        expect(tramGroupGroupVisibilityChangedEvt.visibility).to.be.false
        expect(tramGroupLayerVisibilityChangedEvt).to.have.length(2)
        expect(tramGroupLayerVisibilityChangedEvt[0].name).to.be.eq('tramstop')
        expect(tramGroupLayerVisibilityChangedEvt[1].name).to.be.eq('tramway')
        expect(tramwayLayerVisibilityChangedEvt).to.not.be.null
        expect(tramwayLayerVisibilityChangedEvt.name).to.be.eq('tramway')
        expect(tramwayLayerVisibilityChangedEvt.visibility).to.be.false
        // Visibility has changed not all checked
        expect(transports.checked).to.be.false
        expect(transports.visibility).to.be.false
        expect(tramGroup.checked).to.be.true
        expect(tramGroup.visibility).to.be.false
        expect(tramStopWork.checked).to.be.false
        expect(tramStopWork.visibility).to.be.false
        expect(tramway.checked).to.be.true
        expect(tramway.visibility).to.be.false
        // Events dispatched at collection level
        expect(collectionGroupVisibilityChangedEvt).to.have.length(3)
        expect(collectionGroupVisibilityChangedEvt[0].name).to.be.eq('Buildings')
        expect(collectionGroupVisibilityChangedEvt[1].name).to.be.eq('Tramway')
        expect(collectionGroupVisibilityChangedEvt[2].name).to.be.eq('datalayers')
        expect(collectionLayerVisibilityChangedEvt).to.have.length(3)
        expect(collectionLayerVisibilityChangedEvt[0].name).to.be.eq('tramstop')
        expect(collectionLayerVisibilityChangedEvt[1].name).to.be.eq('tramway')
        expect(collectionLayerVisibilityChangedEvt[2].name).to.be.eq('publicbuildings')

        //Reset
        collectionLayerVisibilityChangedEvt = [];
        collectionGroupVisibilityChangedEvt = [];
        transportsLayerVisibilityChangedEvt = [];
        transportsGroupVisibilityChangedEvt = [];
        tramGroupLayerVisibilityChangedEvt = [];
        tramGroupGroupVisibilityChangedEvt = null;
        tramwayLayerVisibilityChangedEvt = null;

        // Set tramway layer checked to false - visibilities are not changed
        tramway.checked = false
        // No Events dispatched
        expect(collectionGroupVisibilityChangedEvt).to.have.length(0)
        expect(collectionLayerVisibilityChangedEvt).to.have.length(0)
        expect(transportsGroupVisibilityChangedEvt).to.have.length(0)
        expect(transportsLayerVisibilityChangedEvt).to.have.length(0)
        expect(tramGroupGroupVisibilityChangedEvt).to.be.null
        expect(tramGroupLayerVisibilityChangedEvt).to.have.length(0)
        expect(tramwayLayerVisibilityChangedEvt).to.be.null
        // Only tramway checked changed
        expect(transports.checked).to.be.false
        expect(transports.visibility).to.be.false
        expect(tramGroup.checked).to.be.true
        expect(tramGroup.visibility).to.be.false
        expect(tramStopWork.checked).to.be.false
        expect(tramStopWork.visibility).to.be.false
        expect(tramway.checked).to.be.false
        expect(tramway.visibility).to.be.false

        // Set tram stop work layer (not spatial) checked to false - visibilities are not changed
        tramStopWork.checked = true
        // No Events dispatched
        expect(collectionGroupVisibilityChangedEvt).to.have.length(0)
        expect(collectionLayerVisibilityChangedEvt).to.have.length(0)
        expect(transportsGroupVisibilityChangedEvt).to.have.length(0)
        expect(transportsLayerVisibilityChangedEvt).to.have.length(0)
        expect(tramGroupGroupVisibilityChangedEvt).to.be.null
        expect(tramGroupLayerVisibilityChangedEvt).to.have.length(0)
        expect(tramwayLayerVisibilityChangedEvt).to.be.null
        // Only tramway checked changed
        expect(transports.checked).to.be.false
        expect(transports.visibility).to.be.false
        expect(tramGroup.checked).to.be.true
        expect(tramGroup.visibility).to.be.false
        expect(tramStopWork.checked).to.be.true
        expect(tramStopWork.visibility).to.be.false
        expect(tramway.checked).to.be.false
        expect(tramway.visibility).to.be.false
        // Reset
        tramStopWork.checked = false
        // No Events dispatched
        expect(collectionGroupVisibilityChangedEvt).to.have.length(0)
        expect(collectionLayerVisibilityChangedEvt).to.have.length(0)
        expect(transportsGroupVisibilityChangedEvt).to.have.length(0)
        expect(transportsLayerVisibilityChangedEvt).to.have.length(0)
        expect(tramGroupGroupVisibilityChangedEvt).to.be.null
        expect(tramGroupLayerVisibilityChangedEvt).to.have.length(0)
        expect(tramwayLayerVisibilityChangedEvt).to.be.null
        // Only tramway checked changed
        expect(transports.checked).to.be.false
        expect(transports.visibility).to.be.false
        expect(tramGroup.checked).to.be.true
        expect(tramGroup.visibility).to.be.false
        expect(tramStopWork.checked).to.be.false
        expect(tramStopWork.visibility).to.be.false
        expect(tramway.checked).to.be.false
        expect(tramway.visibility).to.be.false

        // Set tramway layer checked to true - visibilities are changed
        tramway.checked = true
        // Events dispatched
        expect(transportsGroupVisibilityChangedEvt).to.have.length(3)
        expect(transportsGroupVisibilityChangedEvt[0].name).to.be.eq('Buildings')
        expect(transportsGroupVisibilityChangedEvt[1].name).to.be.eq('Tramway')
        expect(transportsGroupVisibilityChangedEvt[2].name).to.be.eq('datalayers')
        expect(transportsLayerVisibilityChangedEvt).to.have.length(3)
        expect(transportsLayerVisibilityChangedEvt[0].name).to.be.eq('tramstop')
        expect(transportsLayerVisibilityChangedEvt[1].name).to.be.eq('tramway')
        expect(transportsLayerVisibilityChangedEvt[2].name).to.be.eq('publicbuildings')
        expect(tramGroupGroupVisibilityChangedEvt).to.not.be.null
        expect(tramGroupGroupVisibilityChangedEvt.name).to.be.eq('Tramway')
        expect(tramGroupGroupVisibilityChangedEvt.visibility).to.be.true
        expect(tramGroupLayerVisibilityChangedEvt).to.have.length(2)
        expect(tramGroupLayerVisibilityChangedEvt[0].name).to.be.eq('tramstop')
        expect(tramGroupLayerVisibilityChangedEvt[1].name).to.be.eq('tramway')
        expect(tramwayLayerVisibilityChangedEvt).to.not.be.null
        expect(tramwayLayerVisibilityChangedEvt.name).to.be.eq('tramway')
        expect(tramwayLayerVisibilityChangedEvt.visibility).to.be.true
        // Visibility has changed
        expect(transports.checked).to.be.true
        expect(transports.visibility).to.be.true
        expect(tramGroup.checked).to.be.true
        expect(tramGroup.visibility).to.be.true
        expect(tramStopWork.checked).to.be.false
        expect(tramStopWork.visibility).to.be.false
        expect(tramway.checked).to.be.true
        expect(tramway.visibility).to.be.true
        // Events dispatched at collection level
        expect(collectionGroupVisibilityChangedEvt).to.have.length(3)
        expect(collectionGroupVisibilityChangedEvt[0].name).to.be.eq('Buildings')
        expect(collectionGroupVisibilityChangedEvt[1].name).to.be.eq('Tramway')
        expect(collectionGroupVisibilityChangedEvt[2].name).to.be.eq('datalayers')
        expect(collectionLayerVisibilityChangedEvt).to.have.length(3)
        expect(collectionLayerVisibilityChangedEvt[0].name).to.be.eq('tramstop')
        expect(collectionLayerVisibilityChangedEvt[1].name).to.be.eq('tramway')
        expect(collectionLayerVisibilityChangedEvt[2].name).to.be.eq('publicbuildings')
    })
})
