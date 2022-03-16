<?php
/**
 * 2021 (c) Yownes
 *
 * MODULE Yownes
 *
 * @author    Yownes
 * @copyright Copyright (c) permanent, Yownes
 * @license   MIT
 *
 * @version   0.1.0
 */
use PrestaShop\PrestaShop\Adapter\Product\PriceFormatter;
use PrestaShop\PrestaShop\Adapter\Presenter\Object\ObjectPresenter;

class ModelStoreCarrier extends Model
{
    function getCarriers($context, $translator) {
        $do = new DeliveryOptionsFinderCore($context,
            $translator,
            new ObjectPresenter(),
            new PriceFormatter()
        );

        $all = $do->getDeliveryOptions();
        return $all;
    }
}