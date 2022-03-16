<?php
/**
  * 2019 (c) VueFront
 * 2020 (c) Yownes
 *
 * MODULE Yownes
 *
 * @author    VueFront, Yownes
 * @copyright Copyright (c) permanent, VueFront
 * @copyright Copyright (c) permanent, Yownes
 * @license   MIT
 * @version   0.1.0
 */

class ModelStartupStartup extends Model
{
    public function getResolvers()
    {
        $rawMapping = Tools::file_get_contents(DIR_PLUGIN.'mapping.json');
        $mapping = json_decode($rawMapping, true);
        $result = array();
        foreach ($mapping as $key => $value) {
            $that = $this;
            $result[$key] = function ($root, $args) use ($value, $that) {
                try {
                    return $that->load->resolver($value, $args, $root);
                } catch (Exception $e) {
                    throw new MySafeException($e->getMessage());
                }
            };
        }

        return $result;
    }
}
