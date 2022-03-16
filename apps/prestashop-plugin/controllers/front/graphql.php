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
class YownesGraphqlModuleFrontController extends ModuleFrontController
{
    private $codename = "yownes";
    private $route = "yownes";

    public function setMedia()
    {
        parent::setMedia();
        $this->context->controller->registerStylesheet(
            'modules-yownes-front-css',
            'modules/yownes/views/css/index.css',
            array('media' => 'all', 'priority' => 200)
        );

        $this->context->controller->registerJavascript(
            'modules-yownes-front-js',
            'modules/yownes/views/js/middleware.js',
            array('position' => 'head', 'priority' => 0)
        );
    }

    public function initContent()
    {
        parent::initContent();
        if (!empty($_SERVER['HTTP_ACCEPT'])) {
            $accepts = explode(',', $_SERVER['HTTP_ACCEPT']);
            if (in_array('text/html', $accepts)) {
                $this->context->smarty->assign(array(
                    'hello' => 'Hello World!!!',
                    'target' => __PS_BASE_URI__.'index.php?controller=graphql&module=yownes&fc=module'
                ));

                $this->setTemplate('module:yownes/views/templates/front/d_yownes.tpl');
                return;
            }
        }

        start($this->context, $this->getTranslator(), $this->objectPresenter);
    }
}
