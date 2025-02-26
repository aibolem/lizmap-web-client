# Changelog Lizmap 3.7

<!--
Format from https://keepachangelog.com/en/1.0.0/
added, fixed, changed, removed, deprecated, security
with some extra keywords : backend, tests, test, translation, funders, important
-->

## Unreleased

### Added

* Editing - Better user experience with 1-n relations: the data tables of the related child layers
  now respect the position configured in the QGIS editing drag&drop designer.
* Popup/Editing - Add a combobox in the popup to allow creating a new child feature for the related
  layers. This will allow creating child features directly from the parent popup.
* New display for measurements on the map when drawing
* Better management of **QGIS projects** about versions (desktop, plugin versions, etc.)
* **Form filter**: Allow using a second field for the numeric type like it is already possible for dates.
  This is useful when the layer features contain two fields describing a minimum and maximum value of the same property.
* **Action module**:
  * New support for `project` and `layer` scopes: the actions can now be used outside the popup, for a specific chosen layer or as a generic project action.
    - A **new web component** `<lizmap-action-selector>` is used to let the user choose an action and run it (for the layer and project scopes)
    - A **new dock** is available and shows the list of the **project actions**, with buttons to run an action and another to reset the results.
    - For the layers with actions configured, a click on the layer in the legend also shows the action selector and buttons and allow running this **layer actions**
  * A **SVG icon** can be used instead of a bootstrap icon as a background of the popup action buttons
  * the current **map extent** and **map center** are sent as parameters in `WKT` format (projection `EPSG:4326`) and can be used in the PostgreSQL function
  * Actions can be run from external **JavaScript** scripts, for example:
    ```javascript
    // Run an action
    lizMap.mainLizmap.action.runLizmapAction(actionName, scope = 'feature', layerId = null, featureId = null, wkt = null);
    // Reset the action
    lizMap.mainLizmap.action.resetLizmapAction()
    ```
  * A WKT in `EPSG:4326` can also be sent as an **additional parameter**. This is only possible when running the action with JavaScript. This allows to **send a geometry** to be used by the PostgreSQL action (for example to get data from another table with geometries intersecting this passed WKT geometry)
  * The **JavaScript and HTML code** has been **modernized** (no more jQuery calls, usage of web components, etc.)
* **Dataviz** The editor can now configure how the plots will be organized in the web interface.
  * A new **Drag & Drop layout** tab has been added in Lizmap plugin Dataviz tab,
    which allows to create **tabs and groups** like it can be done for forms.
* New print configurations. For each layout, you can:
  * enable/disable it
  * set allowed groups
  * set formats and default one
  * set DPIs and default one
  * for atlas, choose an icon used for the button launching print in the feature's popup
* New display of print options
  * print area is now display as a [mask on the map](https://user-images.githubusercontent.com/2145040/216579235-8b438ea5-7ea3-4549-95fa-398dea1450e8.png)
  * an advanced panel allows you to:
    * set X/Y parameters for the grid
    * set main map rotation
    * set DPI
* Refactoring of the legend:
  * `project-background-color`
* Add a button to paste a geometry
* Add [MGRS](https://en.wikipedia.org/wiki/Military_Grid_Reference_System) coordinates display on the map

### Fixed

* The "locate by layer" selector shows the layer title when unselected on mobile
* Display the reverse geometry button only for linestrings and polygons, not for points

### Changed

* Avoid downloading default project image multiple times. This improves first load of projects page
* Update home page title configuration

### Updated

* New drawing toolbar, migration from OpenLayers 2 to OpenLayers 6
* Update Plotly.js to 2.16.3
* Update proj4 library

### Translations

* Update translated strings from the Transifex website

### Deprecated

* The AtlasPrint QGIS server plugin should be removed from the installation. It's not used anymore.

### Backend

* A lot of JavaScript code cleanups
* Update some JavaScript dependencies
* Remove some old code about QGIS Server 2
* Update the OpenLayers library to version 7.3.0
* Fix some issues when deployed with Docker
* Switch to PHP 8.1 in the docker image
* Upgrade Lizmap Web Client target minimum version to 3.4

### Funders

* **[ICRC](https://www.icrc.org/)**
* **[Terre de Provence Agglomération](https://www.terredeprovence-agglo.com)**
* **[Avignon city](https://www.avignon.fr)**
* **[Parc naturel régional du Haut-Jura](http://www.parc-haut-jura.fr/)**
* **[Geolab.re](https://geolab.re/)**
