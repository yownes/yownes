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

define('DIR_PLUGIN', realpath(_PS_MODULE_DIR_.'yownes/').'/');

require_once(DIR_PLUGIN . 'system/engine/action.php');
require_once(DIR_PLUGIN . 'system/engine/resolver.php');
require_once(DIR_PLUGIN . 'system/engine/loader.php');
require_once(DIR_PLUGIN . 'system/engine/model.php');
require_once(DIR_PLUGIN . 'system/engine/registry.php');
require_once(DIR_PLUGIN . 'system/engine/proxy.php');
require_once(DIR_PLUGIN . 'vendor/autoload.php');
require_once(DIR_PLUGIN . 'system/helper/MySafeException.php');

function start($context, $translator, $objectPresenter)
{
    $registry = new Registry();

    $loader = new Loader($registry);
    $registry->set('load', $loader);

    $registry->set('context', $context);

    $registry->set('translator', $translator);

    $registry->set('objectPresenter', $objectPresenter);

    $registry->get('load')->resolver('startup/startup');
}

function callback($context)
{
    $registry = new Registry();

    $loader = new Loader($registry);
    $registry->set('load', $loader);

    $registry->set('context', $context);

    $registry->get('load')->resolver('store/checkout/callback');
}
