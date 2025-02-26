import { expect } from 'chai';

import { readFileSync } from 'fs';

import { LayersConfig } from '../../../../assets/src/modules/config/Layer.js';
import { LayerGeographicBoundingBoxConfig, LayerBoundingBoxConfig, LayerTreeGroupConfig, buildLayerTreeConfig } from '../../../../assets/src/modules/config/LayerTree.js';
import { base64png, base64svg, base64svgPointLayer, base64svgLineLayer, base64svgPolygonLayer, BaseIconSymbology, LayerIconSymbology, LayerSymbolsSymbology, SymbolIconSymbology } from '../../../../assets/src/modules/state/Symbology.js';
import { buildLayersOrder } from '../../../../assets/src/modules/config/LayersOrder.js';
import { LayersAndGroupsCollection } from '../../../../assets/src/modules/state/Layer.js';
import { MapGroupState } from '../../../../assets/src/modules/state/MapLayer.js';

import { LayerTreeGroupState, LayerTreeLayerState } from '../../../../assets/src/modules/state/LayerTree.js';

describe('LayerTreeGroupState', function () {
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

        const rootMapGroup = new MapGroupState(collection.root);
        //const rootMapGroup = new MapGroupState(rootCfg, layersOrder);

        const root = new LayerTreeGroupState(rootMapGroup);
        expect(root.name).to.be.eq('root')
        expect(root.type).to.be.eq('group')
        expect(root.level).to.be.eq(0)
        expect(root.wmsName).to.be.eq('Montpellier-Transports')
        expect(root.wmsTitle).to.be.eq('Montpellier - Transports')
        expect(root.wmsGeographicBoundingBox).to.be.null
        expect(root.wmsBoundingBoxes).to.be.an('array').that.have.length(0)
        expect(root.checked).to.be.true
        expect(root.visibility).to.be.true
        expect(root.layerConfig).to.be.null
        expect(root.mutuallyExclusive).to.be.false
        expect(root.childrenCount).to.be.eq(4)

        const transports = root.children[1];
        expect(transports).to.be.instanceOf(LayerTreeGroupState)
        expect(transports.wmsMinScaleDenominator).to.be.eq(-1)
        expect(transports.wmsMaxScaleDenominator).to.be.eq(-1)

        const bus = transports.children[0];
        expect(bus).to.be.instanceOf(LayerTreeGroupState)
        expect(bus.name).to.be.eq('Bus')
        expect(bus.type).to.be.eq('group')
        expect(bus.level).to.be.eq(2)
        expect(bus.wmsName).to.be.eq('Bus')
        expect(bus.wmsTitle).to.be.eq('Bus')
        expect(bus.layerConfig).to.not.be.null;
        expect(bus.childrenCount).to.be.eq(2)
        expect(bus.wmsMinScaleDenominator).to.be.eq(-1)
        expect(bus.wmsMaxScaleDenominator).to.be.eq(40001)

        const busStops = bus.children[0];
        expect(busStops).to.be.instanceOf(LayerTreeLayerState)
        expect(busStops.name).to.be.eq('bus_stops')
        expect(busStops.type).to.be.eq('layer')
        expect(busStops.level).to.be.eq(3)
        expect(busStops.hasSelectedFeatures).to.be.false
        expect(busStops.isFiltered).to.be.false
        expect(busStops.wmsName).to.be.eq('bus_stops')
        expect(busStops.wmsTitle).to.be.eq('bus_stops')
        expect(busStops.layerConfig).to.not.be.null
        expect(busStops.wmsMinScaleDenominator).to.be.eq(0)
        expect(busStops.wmsMaxScaleDenominator).to.be.eq(15000)

        const edition = root.children[0];
        expect(edition).to.be.instanceOf(LayerTreeGroupState)
        expect(edition.name).to.be.eq('Edition')
        expect(edition.type).to.be.eq('group')
        expect(edition.level).to.be.eq(1)
        expect(edition.wmsName).to.be.eq('Edition')
        expect(edition.wmsTitle).to.be.eq('Edition')
        expect(edition.layerConfig).to.not.be.null
        expect(root.mutuallyExclusive).to.be.false
        expect(edition.childrenCount).to.be.eq(3)

        const sousquartiers = root.children[2];
        expect(sousquartiers).to.be.instanceOf(LayerTreeLayerState)
        expect(sousquartiers.name).to.be.eq('SousQuartiers')
        expect(sousquartiers.type).to.be.eq('layer')
        expect(sousquartiers.level).to.be.eq(1)
        expect(sousquartiers.hasSelectedFeatures).to.be.false
        expect(sousquartiers.isFiltered).to.be.false
        expect(sousquartiers.wmsName).to.be.eq('SousQuartiers')
        expect(sousquartiers.wmsTitle).to.be.eq('SousQuartiers')
        expect(sousquartiers.layerConfig).to.not.be.null;
        expect(sousquartiers.wmsStyles).to.be.instanceOf(Array)
        expect(sousquartiers.wmsStyles).to.have.length(1)
        expect(sousquartiers.wmsStyles[0].wmsName).to.be.eq('default')
        expect(sousquartiers.wmsStyles[0].wmsTitle).to.be.eq('default')
        expect(sousquartiers.wmsAttribution).to.be.null

        const rootGetChildren = root.getChildren()
        expect(rootGetChildren.next().value).to.be.eq(edition)
        const child2 = rootGetChildren.next().value;
        expect(child2).to.be.instanceOf(LayerTreeGroupState)
        expect(child2.name).to.be.eq('datalayers')
        expect(rootGetChildren.next().value).to.be.eq(sousquartiers)
        const child4 = rootGetChildren.next().value;
        expect(child4).to.be.instanceOf(LayerTreeLayerState)
        expect(child4.name).to.be.eq('Quartiers')
    })

    it('Check && visibility', function () {
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

        const rootMapGroup = new MapGroupState(collection.root);
        //const rootMapGroup = new MapGroupState(rootCfg, layersOrder);

        const root = new LayerTreeGroupState(rootMapGroup);
        expect(root).to.be.instanceOf(LayerTreeGroupState)

        expect(root.checked).to.be.true
        expect(root.visibility).to.be.true

        const edition = root.children[0];
        expect(edition).to.be.instanceOf(LayerTreeGroupState)

        expect(edition.checked).to.be.true
        expect(edition.visibility).to.be.true

        const poi = edition.children[0];
        expect(poi).to.be.instanceOf(LayerTreeLayerState)

        expect(poi.checked).to.be.false
        expect(poi.visibility).to.be.false

        const rides = edition.children[1];
        expect(rides).to.be.instanceOf(LayerTreeLayerState)

        expect(rides.checked).to.be.true
        expect(rides.visibility).to.be.true

        const areas = edition.children[2];
        expect(areas).to.be.instanceOf(LayerTreeLayerState)

        expect(areas.checked).to.be.false
        expect(areas.visibility).to.be.false

        // Unchecked group Edition
        edition.checked = false;

        expect(edition.checked).to.be.false
        expect(edition.visibility).to.be.false

        expect(poi.checked).to.be.false
        expect(poi.visibility).to.be.false

        expect(rides.checked).to.be.true
        expect(rides.visibility).to.be.false

        expect(areas.checked).to.be.false
        expect(areas.visibility).to.be.false

        // Checked Point Of Interests
        poi.checked = true;

        expect(edition.checked).to.be.true
        expect(edition.visibility).to.be.true

        expect(poi.checked).to.be.true
        expect(poi.visibility).to.be.true

        expect(rides.checked).to.be.true
        expect(rides.visibility).to.be.true

        expect(areas.checked).to.be.false
        expect(areas.visibility).to.be.false
    })

    it('Icon', function () {
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

        const rootMapGroup = new MapGroupState(collection.root);
        //const rootMapGroup = new MapGroupState(rootCfg, layersOrder);

        const root = new LayerTreeGroupState(rootMapGroup);
        expect(root).to.be.instanceOf(LayerTreeGroupState)

        const edition = root.children[0];
        expect(edition).to.be.instanceOf(LayerTreeGroupState)

        const poi = edition.children[0];
        expect(poi).to.be.instanceOf(LayerTreeLayerState)
        expect(poi.icon).to.be.eq(base64svg+base64svgPointLayer)

        const rides = edition.children[1];
        expect(rides).to.be.instanceOf(LayerTreeLayerState)
        expect(rides.icon).to.be.eq(base64svg+base64svgLineLayer)

        const areas = edition.children[2];
        expect(areas).to.be.instanceOf(LayerTreeLayerState)
        expect(areas.icon).to.be.eq(base64svg+base64svgPolygonLayer)
    })

    it('Symbology', function () {
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

        const rootMapGroup = new MapGroupState(collection.root);
        //const rootMapGroup = new MapGroupState(rootCfg, layersOrder);

        const root = new LayerTreeGroupState(rootMapGroup);
        expect(root).to.be.instanceOf(LayerTreeGroupState)

        let rootLayerSymbologyChangedEvt = null;
        root.addListener(evt => {
            rootLayerSymbologyChangedEvt = evt
        }, 'layer.symbology.changed');

        const sousquartiers = root.children[2];
        expect(sousquartiers).to.be.instanceOf(LayerTreeLayerState)

        let sousquartiersSymbologyChangedEvt = null;
        sousquartiers.addListener(evt => {
            sousquartiersSymbologyChangedEvt = evt
        }, 'layer.symbology.changed');

        sousquartiers.symbology = {
            "icon":"iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8\/9hAAAACXBIWXMAAA9hAAAPYQGoP6dpAAAALklEQVQ4jWNkYGD4xYAJ2KA0uhxWcWwGEA2YKNFMFQMGBxjigTgaC4MhECk2AAAHYQX6C8Zs7gAAAABJRU5ErkJggg==",
            "title":"SousQuartiers",
            "type":"layer",
            "name":"SousQuartiers"
        };
        expect(sousquartiers.icon).to.have.string(base64png)
        expect(sousquartiers.icon).to.be.eq(sousquartiers.symbology.icon)
        expect(sousquartiers.symbologyChildrenCount).to.be.eq(0)
        expect(sousquartiers.symbologyChildren).to.be.an('array').that.have.lengthOf(0)
        expect(sousquartiers.getSymbologyChildren().next().value).to.be.undefined
        // Event dispatched
        expect(sousquartiersSymbologyChangedEvt).to.not.be.null
        expect(sousquartiersSymbologyChangedEvt.name).to.be.eq('SousQuartiers')
        expect(rootLayerSymbologyChangedEvt).to.not.be.null
        expect(rootLayerSymbologyChangedEvt.name).to.be.eq('SousQuartiers')

        const quartiers = root.children[3];
        expect(quartiers).to.be.instanceOf(LayerTreeLayerState)
        quartiers.symbology = {
            "symbols":[{
                "icon":"iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8\/9hAAAACXBIWXMAAA9hAAAPYQGoP6dpAAAAWUlEQVQ4jWO09w1bzEAApDX0Hp7VUGyLTY7R3jdscVpD72FChmADsxqKbZnI0YgMBtaAtIbewwPrAuoEIrlRCDeAYhfgSmH0c8HQN4ARPTvjy7roIK2h9zAAH0sa4\/UtHhUAAAAASUVORK5CYII=",
                "title":"CROIX D'ARGENT",
                "ruleKey":"0",
                "checked":true
            },{
                "icon":"iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8\/9hAAAACXBIWXMAAA9hAAAPYQGoP6dpAAAAWUlEQVQ4jWPk1nVezEAACHsXHn67td8Wmxwjt67zYmHvwsOEDMEG3m7tt2UiRyMyGFgDhL0LDw+sC6gTiORGIdwAil2AK4XRzwVD3wBG9OyML+uiA2HvwsMACoMZCj04skUAAAAASUVORK5CYII=",
                "title":"HOPITAUX-FACULTES",
                "ruleKey":"1",
                "checked":true
            },{
                "icon":"iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8\/9hAAAACXBIWXMAAA9hAAAPYQGoP6dpAAAAWUlEQVQ4jWN0DjZZzEAA5HWHHp5UutoWmxyjc7DJ4rzu0MOEDMEGJpWutmUiRyMyGFgD8rpDDw+sC6gTiORGIdwAil2AK4XRzwVD3wBG9OyML+uig7zu0MMALjsadrnFGLAAAAAASUVORK5CYII=",
                "title":"LES CEVENNES",
                "ruleKey":"2",
                "checked":true
            },{
                "icon":"iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8\/9hAAAACXBIWXMAAA9hAAAPYQGoP6dpAAAAWklEQVQ4jWOMs7JazEAAzEmMO5wyf5EtNjnGOCurxXMS4w4TMgQbSJm\/yJaJHI3IYGANmJMYd3hgXUCdQCQ3CuEGUOwCXCmMfi4Y+gYwomdnfFkXHcxJjDsMAIAKGpsFw6NBAAAAAElFTkSuQmCC",
                "title":"MONTPELLIER CENTRE",
                "ruleKey":"3",
                "checked":true
            },{
                "icon":"iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8\/9hAAAACXBIWXMAAA9hAAAPYQGoP6dpAAAAWUlEQVQ4jWMM4+RezEAA9AoIHC7+8MEWmxxjGCf34l4BgcOEDMEGij98sGUiRyMyGFgDegUEDg+sC6gTiORGIdwAil2AK4XRzwVD3wBG9OyML+uig14BgcMAV7AYtZKc8NMAAAAASUVORK5CYII=",
                "title":"MOSSON",
                "ruleKey":"4",
                "checked":true
            },{
                "icon":"iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8\/9hAAAACXBIWXMAAA9hAAAPYQGoP6dpAAAAWklEQVQ4jWOMN2BYzEAALPBnOJywkcEWmxxjvAHD4gX+DIcJGYINJGxksGUiRyMyGFgDFvgzHB5YF1AnEMmNQrgBFLsAVwqjnwuGvgGM6NkZX9ZFBwv8GQ4DAGqJFGb85cxrAAAAAElFTkSuQmCC",
                "title":"PORT MARIANNE",
                "ruleKey":"5",
                "checked":true
            },{
                "icon":"iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8\/9hAAAACXBIWXMAAA9hAAAPYQGoP6dpAAAAWUlEQVQ4jWP0dQ5czEAA1Oa1HW6eVGWLTY7R1zlwcW1e22FChmADzZOqbJnI0YgMBtaA2ry2wwPrAuoEIrlRCDeAYhfgSmH0c8HQN4ARPTvjy7rooDav7TAAFPoa3pkC2qcAAAAASUVORK5CYII=",
                "title":"PRES D'ARENE",
                "ruleKey":"6",
                "checked":true
            },{
                "icon":"iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8\/9hAAAACXBIWXMAAA9hAAAPYQGoP6dpAAAAWklEQVQ4jWNUF7NazEAAOKklHt53a74tNjlGdTGrxU5qiYcJGYIN7Ls135aJHI3IYGANcFJLPDywLqBOIJIbhXADKHYBrhRGPxcMfQMY0bMzvqyLDpzUEg8DAOMQGPhYL1pmAAAAAElFTkSuQmCC",
                "title":"",
                "ruleKey":"7",
                "checked":true
            }],
            "title":"Quartiers",
            "type":"layer",
            "name":"Quartiers"
        };
        expect(quartiers.icon).to.be.eq(base64svg+base64svgPolygonLayer)
        expect(quartiers.symbologyChildrenCount).to.be.eq(8)
        expect(quartiers.symbologyChildren).to.be.an('array').that.have.lengthOf(8)

        const quartierstSymbologyChildren = quartiers.getSymbologyChildren()
        expect(quartierstSymbologyChildren.next().value).to.be.instanceOf(BaseIconSymbology).that.be.instanceOf(SymbolIconSymbology)
    })

    it('findTreeLayerNames', function () {
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

        const rootMapGroup = new MapGroupState(collection.root);
        //const rootMapGroup = new MapGroupState(rootCfg, layersOrder);

        const root = new LayerTreeGroupState(rootMapGroup);
        expect(root).to.be.instanceOf(LayerTreeGroupState)

        expect(root.findTreeLayerNames()).to.have.ordered.members([
            "points_of_interest",
            "edition_line",
            "areas_of_interest",
            "bus_stops",
            "bus",
            //"tramway_ref",
            //"tramway_pivot",
            //"tram_stop_work",
            "tramstop",
            "tramway",
            "publicbuildings",
            //"publicbuildings_tramstop",
            //"donnes_sociodemo_sous_quartiers",
            "SousQuartiers",
            "Quartiers",
            // "VilleMTP_MTP_Quartiers_2011_4326",
            // "osm-mapnik",
            // "osm-stamen-toner"
        ])

        let names = []
        for (const layer of root.findTreeLayers()) {
            names.push(layer.name)
        }
        expect(names).to.be.deep.equal(root.findTreeLayerNames())

        const transports = root.children[1];
        expect(transports).to.be.instanceOf(LayerTreeGroupState)

        expect(transports.findTreeLayerNames()).to.have.ordered.members([
            "bus_stops",
            "bus",
            "tramstop",
            "tramway",
            "publicbuildings",
        ])
    })

    it('getTreeLayerByName', function () {
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

        const rootMapGroup = new MapGroupState(collection.root);
        //const rootMapGroup = new MapGroupState(rootCfg, layersOrder);

        const root = new LayerTreeGroupState(rootMapGroup);
        expect(root).to.be.instanceOf(LayerTreeGroupState)

        const busStops = root.getTreeLayerByName('bus_stops')
        expect(busStops).to.be.instanceOf(LayerTreeLayerState)
        expect(busStops.name).to.be.eq('bus_stops')
        expect(busStops.type).to.be.eq('layer')
        expect(busStops.level).to.be.eq(3)
        expect(busStops.wmsName).to.be.eq('bus_stops')
        expect(busStops.wmsTitle).to.be.eq('bus_stops')
        expect(busStops.layerConfig).to.not.be.null
        expect(busStops.wmsMinScaleDenominator).to.be.eq(0)
        expect(busStops.wmsMaxScaleDenominator).to.be.eq(15000)

        const sousquartiers = root.getTreeLayerByName('SousQuartiers')
        expect(sousquartiers).to.be.instanceOf(LayerTreeLayerState)
        expect(sousquartiers.name).to.be.eq('SousQuartiers')
        expect(sousquartiers.type).to.be.eq('layer')
        expect(sousquartiers.level).to.be.eq(1)
        expect(sousquartiers.wmsName).to.be.eq('SousQuartiers')
        expect(sousquartiers.layerConfig).to.not.be.null;
        expect(sousquartiers.wmsStyles).to.be.instanceOf(Array)
        expect(sousquartiers.wmsStyles).to.have.length(1)
        expect(sousquartiers.wmsStyles[0].wmsName).to.be.eq('default')
        expect(sousquartiers.wmsStyles[0].wmsTitle).to.be.eq('default')
        expect(sousquartiers.wmsSelectedStyleName).to.be.eq('default')
        expect(sousquartiers.wmsAttribution).to.be.null
        expect(sousquartiers.wmsParameters).to.be.an('object').that.deep.equal({
          'LAYERS': 'SousQuartiers',
          'STYLES': 'default',
          'FORMAT': 'image/png',
          'DPI': 96
        })

        // Try get an unknown layer
        try {
            root.getTreeLayerByName('sous-quartiers')
        } catch (error) {
            expect(error.name).to.be.eq('RangeError')
            expect(error.message).to.be.eq('The layer name `sous-quartiers` is unknown!')
            expect(error).to.be.instanceOf(RangeError)
        }

        const transports = root.children[1];
        expect(transports).to.be.instanceOf(LayerTreeGroupState)
        const busStops2 = root.getTreeLayerByName('bus_stops')
        expect(busStops2).to.be.eq(busStops)
    })

    it('Events', function () {
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

        const rootMapGroup = new MapGroupState(collection.root);
        //const rootMapGroup = new MapGroupState(rootCfg, layersOrder);

        const root = new LayerTreeGroupState(rootMapGroup);
        expect(root).to.be.instanceOf(LayerTreeGroupState)

        let rootLayerVisibilityChangedEvt = [];
        let rootGroupVisibilityChangedEvt = null;
        root.addListener(evt => {
            rootLayerVisibilityChangedEvt.push(evt)
        }, 'layer.visibility.changed');
        root.addListener(evt => {
            rootGroupVisibilityChangedEvt = evt
        }, 'group.visibility.changed');

        const sousquartiers = root.children[2];
        expect(sousquartiers).to.be.instanceOf(LayerTreeLayerState)

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
        expect(rootLayerVisibilityChangedEvt).to.have.length(1)
        expect(rootLayerVisibilityChangedEvt[0]).to.be.deep.equal(sousquartiersVisibilityChangedEvt)
        expect(rootGroupVisibilityChangedEvt).to.be.null

        // Reset
        sousquartiersVisibilityChangedEvt = null;
        rootLayerVisibilityChangedEvt = [];
        // Set same value
        sousquartiers.checked = true;
        // Nothing changed
        expect(sousquartiersVisibilityChangedEvt).to.be.null
        expect(rootLayerVisibilityChangedEvt).to.have.length(0)

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
        expect(rootLayerVisibilityChangedEvt).to.have.length(1)
        expect(rootLayerVisibilityChangedEvt[0]).to.be.deep.equal(sousquartiersVisibilityChangedEvt)
        expect(rootGroupVisibilityChangedEvt).to.be.null

        // Reset
        sousquartiersVisibilityChangedEvt = null;
        rootLayerVisibilityChangedEvt = [];

        const edition = root.children[0];
        expect(edition).to.be.instanceOf(LayerTreeGroupState)

        expect(edition.checked).to.be.true
        expect(edition.visibility).to.be.true

        const poi = edition.children[0];
        expect(poi).to.be.instanceOf(LayerTreeLayerState)

        expect(poi.checked).to.be.false
        expect(poi.visibility).to.be.false

        let editionVisibilityChangedEvt = null;
        edition.addListener(evt => {
            editionVisibilityChangedEvt = evt
        }, 'group.visibility.changed');

        let poiVisibilityChangedEvt = null;
        poi.addListener(evt => {
            poiVisibilityChangedEvt = evt
        }, 'layer.visibility.changed');

        // Change poi checked value
        poi.checked = true;
        // Poi event dispatched
        expect(poiVisibilityChangedEvt).to.not.be.null
        expect(poiVisibilityChangedEvt.name).to.be.eq('points_of_interest')
        expect(poiVisibilityChangedEvt.visibility).to.be.true
        // Poi values have changed
        expect(poi.checked).to.be.true
        expect(poi.visibility).to.be.true
        // Edition group event not dispatched
        expect(editionVisibilityChangedEvt).to.be.null
        // Edition group values have not changed
        expect(edition.checked).to.be.true
        expect(edition.visibility).to.be.true
        // Events dispatched at root level
        expect(rootLayerVisibilityChangedEvt).to.have.length(1)
        expect(rootLayerVisibilityChangedEvt[0]).to.be.deep.equal(poiVisibilityChangedEvt)
        expect(rootGroupVisibilityChangedEvt).to.be.null

        // Reset
        poiVisibilityChangedEvt = null;
        rootLayerVisibilityChangedEvt = [];
        // Change edition group checked value
        edition.checked = false;
        // edition group event dispatched
        expect(editionVisibilityChangedEvt).to.not.be.null
        expect(editionVisibilityChangedEvt.name).to.be.eq('Edition')
        expect(editionVisibilityChangedEvt.visibility).to.be.false
        // Edition group values have changed
        expect(edition.checked).to.be.false
        expect(edition.visibility).to.be.false
        // Poi event dispatched
        expect(poiVisibilityChangedEvt).to.not.be.null
        // Poi still checked but not visible
        expect(poi.checked).to.be.true
        expect(poi.visibility).to.be.false
        // Events dispatched at root level
        expect(rootLayerVisibilityChangedEvt).to.have.length(2)
        expect(rootLayerVisibilityChangedEvt[0]).to.be.deep.equal(poiVisibilityChangedEvt)
        expect(rootLayerVisibilityChangedEvt[1].name).to.be.eq('edition_line')
        expect(rootGroupVisibilityChangedEvt).to.not.be.null
        expect(rootGroupVisibilityChangedEvt).to.be.deep.equal(editionVisibilityChangedEvt)

        // Reset
        editionVisibilityChangedEvt = null;
        poiVisibilityChangedEvt = null;
        rootLayerVisibilityChangedEvt = [];
        rootGroupVisibilityChangedEvt = null;

        // Change poi checked value
        poi.checked = false;
        // No visibility events dispatched
        expect(editionVisibilityChangedEvt).to.be.null
        expect(poiVisibilityChangedEvt).to.be.null
        // Edition group values have not changed
        expect(edition.checked).to.be.false
        expect(edition.visibility).to.be.false
        // Poi checked changed
        expect(poi.checked).to.be.false
        expect(poi.visibility).to.be.false
        // Events not dispatched at root level
        expect(rootLayerVisibilityChangedEvt).to.have.length(0)
        expect(rootGroupVisibilityChangedEvt).to.be.null

        // Change poi checked value
        poi.checked = true;
        // Visibility events dispatched
        expect(editionVisibilityChangedEvt).to.not.be.null
        expect(poiVisibilityChangedEvt).to.not.be.null
        // Edition group values have changed
        expect(edition.checked).to.be.true
        expect(edition.visibility).to.be.true
        // Poi values have changed
        expect(poi.checked).to.be.true
        expect(poi.visibility).to.be.true
        // Events dispatched at root level
        expect(rootLayerVisibilityChangedEvt).to.have.length(2)
        expect(rootLayerVisibilityChangedEvt[0]).to.be.deep.equal(poiVisibilityChangedEvt)
        expect(rootLayerVisibilityChangedEvt[1].name).to.be.eq('edition_line')
        expect(rootGroupVisibilityChangedEvt).to.not.be.null

        // Reset root
        //editionVisibilityChangedEvt = null;
        //poiVisibilityChangedEvt = null;
        rootLayerVisibilityChangedEvt = [];
        rootGroupVisibilityChangedEvt = null;
        // Do not dispatch already dispatched event
        edition.dispatch(poiVisibilityChangedEvt);
        expect(rootLayerVisibilityChangedEvt).to.have.length(0)
        edition.dispatch(editionVisibilityChangedEvt);
        expect(rootGroupVisibilityChangedEvt).to.be.null
    })

    it('WMS selected styles', function () {
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

        const rootMapGroup = new MapGroupState(collection.root);
        //const rootMapGroup = new MapGroupState(rootCfg, layersOrder);

        const root = new LayerTreeGroupState(rootMapGroup);
        expect(root).to.be.instanceOf(LayerTreeGroupState)

        const transports = root.children[1];
        expect(transports).to.be.instanceOf(LayerTreeGroupState)

        const tramway = transports.children[1];
        expect(tramway).to.be.instanceOf(LayerTreeGroupState)
        expect(tramway.name).to.be.eq('Tramway')

        const tram = tramway.children[1];
        expect(tram).to.be.instanceOf(LayerTreeLayerState)
        expect(tram.name).to.be.eq('tramway')
        expect(tram.wmsSelectedStyleName).to.be.eq('black')
        expect(tram.wmsStyles).to.be.an('array').that.be.lengthOf(2)
        expect(tram.wmsStyles[0].wmsName).to.be.eq('black')
        expect(tram.wmsStyles[1].wmsName).to.be.eq('colored')

        // Apply a known style name
        tram.wmsSelectedStyleName = 'colored'
        expect(tram.wmsSelectedStyleName).to.be.eq('colored')

        // listen to layer style change
        let tramStyleChangedEvt = null;
        let rootStyleChangedEvt = null;
        tram.addListener(evt => {
            tramStyleChangedEvt = evt
        }, 'layer.style.changed');
        root.addListener(evt => {
            rootStyleChangedEvt = evt
        }, 'layer.style.changed');

        // Apply a known style name
        tram.wmsSelectedStyleName = 'black'
        expect(tram.wmsSelectedStyleName).to.be.eq('black')
        // Event dispatched
        expect(tramStyleChangedEvt).to.not.be.null
        expect(tramStyleChangedEvt.name).to.be.eq('tramway')
        expect(tramStyleChangedEvt.style).to.be.eq('black')
        expect(rootStyleChangedEvt).to.not.be.null
        expect(rootStyleChangedEvt).to.be.deep.equal(tramStyleChangedEvt)

        //Reset
        tramStyleChangedEvt = null;
        rootStyleChangedEvt = null;

        // Apply same style
        tram.wmsSelectedStyleName = 'black'
        // No event dispatched
        expect(tramStyleChangedEvt).to.be.null
        expect(rootStyleChangedEvt).to.be.null

        // Try to apply an unknown style name
        try {
            tram.wmsSelectedStyleName = 'foobar'
        } catch (error) {
            expect(error.name).to.be.eq('TypeError')
            expect(error.message).to.be.eq('Cannot assign an unknown WMS style name! `foobar` is not in the layer `tramway` WMS styles!')
            expect(error).to.be.instanceOf(TypeError)
        }
        // No event dispatched
        expect(tramStyleChangedEvt).to.be.null
        expect(rootStyleChangedEvt).to.be.null
    })

    it('Legend on/off', function () {
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

        const rootMapGroup = new MapGroupState(collection.root);
        //const rootMapGroup = new MapGroupState(rootCfg, layersOrder);

        const root = new LayerTreeGroupState(rootMapGroup);
        expect(root).to.be.instanceOf(LayerTreeGroupState)

        const legend = JSON.parse(readFileSync('./data/montpellier-legend.json', 'utf8'));
        expect(legend).to.not.be.undefined

        const sousquartiers = root.children[2];
        expect(sousquartiers).to.be.instanceOf(LayerTreeLayerState)
        expect(sousquartiers.name).to.be.eq('SousQuartiers')
        expect(sousquartiers.wmsSelectedStyleName).to.be.eq('default')
        expect(sousquartiers.wmsParameters).to.be.an('object').that.deep.equal({
          'LAYERS': 'SousQuartiers',
          'STYLES': 'default',
          'FORMAT': 'image/png',
          'DPI': 96
        })
        expect(sousquartiers.symbology).to.be.null
        sousquartiers.symbology = legend.nodes[1]
        expect(sousquartiers.symbology).to.be.instanceOf(LayerIconSymbology)

        const quartiers = root.children[3];
        expect(quartiers).to.be.instanceOf(LayerTreeLayerState)
        expect(quartiers.name).to.be.eq('Quartiers')
        expect(quartiers.wmsSelectedStyleName).to.be.eq('default')
        expect(quartiers.wmsParameters).to.be.an('object').that.deep.equal({
          'LAYERS': 'Quartiers',
          'STYLES': 'default',
          'FORMAT': 'image/png',
          'DPI': 96
        })
        expect(quartiers.symbology).to.be.null

        // Set symbology
        quartiers.symbology = legend.nodes[0]
        // Check symbology
        expect(quartiers.symbology).to.be.instanceOf(LayerSymbolsSymbology)
        expect(quartiers.symbology.childrenCount).to.be.eq(8)
        expect(quartiers.symbology.children[0]).to.be.instanceOf(SymbolIconSymbology)
        expect(quartiers.symbology.children[0].checked).to.be.true
        expect(quartiers.symbology.children[0].ruleKey).to.be.eq('0')

        // Unchecked rules
        quartiers.symbology.children[0].checked = false;
        quartiers.symbology.children[2].checked = false;
        quartiers.symbology.children[4].checked = false;
        quartiers.symbology.children[6].checked = false;
        expect(quartiers.wmsParameters).to.be.an('object').that.deep.equal({
          'LAYERS': 'Quartiers',
          'STYLES': 'default',
          'FORMAT': 'image/png',
          'LEGEND_ON': 'Quartiers:1,3,5,7',
          'LEGEND_OFF': 'Quartiers:0,2,4,6',
          'DPI': 96
        })

        // Checked rules
        quartiers.symbology.children[0].checked = true;
        quartiers.symbology.children[2].checked = true;
        quartiers.symbology.children[4].checked = true;
        expect(quartiers.wmsParameters).to.be.an('object').that.deep.equal({
          'LAYERS': 'Quartiers',
          'STYLES': 'default',
          'FORMAT': 'image/png',
          'LEGEND_ON': 'Quartiers:0,1,2,3,4,5,7',
          'LEGEND_OFF': 'Quartiers:6',
          'DPI': 96
        })

        // Checked all rules and events
        let rootLayerSymbologyChangedEvt = null;
        let layerSymbologyChangedEvt = null;
        let symbologyChangedEvt = null;
        quartiers.symbology.children[6].addListener(evt => {
            symbologyChangedEvt = evt
        }, 'symbol.checked.changed');
        quartiers.addListener(evt => {
            layerSymbologyChangedEvt = evt
        }, 'layer.symbol.checked.changed');
        root.addListener(evt => {
            rootLayerSymbologyChangedEvt = evt
        }, 'layer.symbol.checked.changed');
        quartiers.symbology.children[6].checked = true;
        expect(quartiers.wmsParameters).to.be.an('object').that.deep.equal({
          'LAYERS': 'Quartiers',
          'STYLES': 'default',
          'FORMAT': 'image/png',
          'DPI': 96
        })
        expect(symbologyChangedEvt).to.not.be.null
        expect(symbologyChangedEvt.title).to.be.eq('PRES D\'ARENE')
        expect(symbologyChangedEvt.ruleKey).to.be.eq('6')
        expect(symbologyChangedEvt.checked).to.be.true
        expect(layerSymbologyChangedEvt).to.not.be.null
        expect(layerSymbologyChangedEvt.name).to.be.eq('Quartiers')
        expect(layerSymbologyChangedEvt.title).to.be.eq('PRES D\'ARENE')
        expect(layerSymbologyChangedEvt.ruleKey).to.be.eq('6')
        expect(layerSymbologyChangedEvt.checked).to.be.true
        expect(rootLayerSymbologyChangedEvt).to.not.be.null
        expect(rootLayerSymbologyChangedEvt).to.be.eq(layerSymbologyChangedEvt)
    })
})
