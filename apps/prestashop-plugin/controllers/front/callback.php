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

require_once dirname(__FILE__) . '/../../system/startup.php';

/**
 * yownes
 * yownes.php
 */
class YownesCallbackModuleFrontController extends ModuleFrontController
{
    private $codename = "yownes";
    private $route = "yownes";

    public function initContent()
    {
        parent::initContent();

        callback($this->context);
    }
}
