<?php
/**
 * Manage and give access to lizmap log configuration.
 *
 * @author    3liz
 * @copyright 2012 3liz
 *
 * @see      http://3liz.com
 *
 * @license Mozilla Public License : http://www.mozilla.org/MPL/
 */

namespace Lizmap\Logger;

use Lizmap\App;

class Config
{
    // Lizmap log configuration data
    private $data = array();

    // general properties
    private $properties = array(
        'active',
        'profile',
    );

    // list of the logItems of the ini file
    protected $logItems = array();
    // If the log is active globally or not
    private $active = '';

    // database profile
    private $profile = '';

    protected $appContext;

    public function __construct($readConfigPath, App\AppContextInterface $appContext)
    {
        $this->data = $readConfigPath;
        $this->appContext = $appContext;

        // set generic parameters
        foreach ($this->properties as $prop) {
            if (isset($readConfigPath['general'][$prop])) {
                $this->{$prop} = $readConfigPath['general'][$prop];
            }
        }
    }

    public function getProperties()
    {
        return $this->properties;
    }

    /**
     * Get a log item.
     *
     * @param string $key Key of the log item to get
     *
     * @return lizmapLogItem
     */
    public function getLogItem($key)
    {
        if (!key_exists($key, $this->logItems)) {
            if (!key_exists('item:'.$key, $this->data)) {
                return null;
            }
            $this->logItems[$key] = new Item($key, $this->data['item:'.$key], $this->appContext);
        }

        return $this->logItems[$key];
    }

    /**
     * Get a list of log items names.
     *
     * @return string[] list of names
     */
    public function getLogItemList()
    {
        $logItemList = array();

        foreach ($this->data as $section => $data) {
            $match = preg_match('#(^item:)#', $section, $matches);
            if (isset($matches[0])) {
                $logItemList[] = str_replace($matches[0], '', $section);
            }
        }

        return $logItemList;
    }

    /**
     * Modify the general options.
     *
     * @param array $data array containing the global config data
     */
    public function modify($data)
    {
        $modified = false;
        if (!$data) {
            return $modified;
        }
        foreach ($data as $k => $v) {
            if (in_array($k, $this->properties)) {
                $this->data['general'][$k] = $v;
                $this->{$k} = $v;
                $modified = true;
            }
        }

        return $modified;
    }

    /**
     * Update the global config data. (modify and save).
     *
     * @param array      $data array containing the data of the general options
     * @param null|mixed $ini
     */
    public function update($data, $ini = null)
    {
        $modified = $this->modify($data);
        if ($modified) {
            $modified = $this->save($ini);
        }

        return $modified;
    }

    /**
     * save the global configuration data.
     *
     * @param null|mixed $ini
     */
    public function save($ini = null)
    {
        if (!$ini) {
            $iniFile = $this->appContext->appConfigPath('lizmapLogConfig.ini.php');
            $ini = $this->appContext->getIniModifier($iniFile);
        }
        foreach ($this->properties as $prop) {
            if ($this->{$prop} !== '' && $this->{$prop} !== null) {
                $ini->setValue($prop, $this->{$prop}, 'general');
            } else {
                $ini->removeValue($prop, 'general');
            }
        }

        // Save the ini file
        $ini->save();

        return $ini->isModified();
    }
}
