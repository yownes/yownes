<?php
/**
 * Starter Module
 *
 *  @author    PremiumPresta <office@premiumpresta.com>
 *  @copyright PremiumPresta
 *  @license   http://creativecommons.org/licenses/by/4.0/ CC BY 4.0
 */

if (!defined('_PS_VERSION_')) {
    exit;
}

class Yownes extends Module
{

    /** @var array Use to store the configuration from database */
    public $config_values;

    /** @var array submit values of the configuration page */
    protected static $config_post_submit_values = array('saveConfig');

    public function __construct()
    {
        $this->name = 'yownes'; // internal identifier, unique and lowercase
        $this->tab = 'front_office_features'; // backend module coresponding category
        $this->version = '2.0.0'; // version number for the module
        $this->author = 'Yownes'; // module author
        $this->need_instance = 0; // load the module when displaying the "Modules" page in backend
        $this->bootstrap = true;

        parent::__construct();

        $this->displayName = $this->l('Yownes'); // public name
        $this->description = $this->l('CMS Connect App for PrestaShop'); // public description

        $this->confirmUninstall = $this->l('Are you sure you want to uninstall?'); // confirmation message at uninstall

        $this->ps_versions_compliancy = array('min' => '1.6', 'max' => _PS_VERSION_);
        // $this->module_key = '1d77752fd71e98268cd50f200cb5f5ce';
    }

    /**
     * Install this module
     * @return boolean
     */
    public function install()
    {
        return parent::install() &&
        $this->registerAdminTab() && $this->registerAdminAjaxTab() && $this->installDatabase() && $this->registerHook('paymentOptions');
    }

    /**
     * Uninstall this module
     * @return boolean
     */
    public function uninstall()
    {
        return Configuration::deleteByName($this->name) &&
        parent::uninstall() &&
        $this->deleteAdminTab() && $this->uninstallDatabase();
    }

    /**
     * Configuration page
     */
    public function getContent()
    {
        $this->config_values = $this->getConfigValues();

        $this->context->smarty->assign(array(
            'module' => array(
                'class' => get_class($this),
                'name' => $this->name,
                'displayName' => $this->displayName,
                'dir' => $this->_path
            )
        ));

        $app = json_decode(file_get_contents(__DIR__ . '/views/js/yownes/asset-manifest.json'), true);
        $base_path = $this->_path . 'views/js/yownes/';
        $scripts = [];

        $index_html = $app['index.html'];
        $index_js = $index_html['file'];

        foreach ($index_html['imports'] as $key) {
            $file_path = $app[$key]['file'];
            array_push($scripts, $base_path . $file_path);
        }
        array_push($scripts, $base_path . $index_js);

        foreach ($index_html['css'] as $key) {
            $this->context->controller->addCSS($base_path . $key, [
                'media' => 'all',
                'priority' => 1000
            ]);
        }


        $this->context->smarty->assign(array(
            'catalog' => Tools::getHttpHost(true).
            __PS_BASE_URI__.'index.php?controller=graphql&module=yownes&fc=module',
            'blog' => Module::isInstalled('prestablog'),
            'baseUrl' => '',
            'scripts' => $scripts,
            'shopName' => Configuration::get('PS_SHOP_NAME'),
            'siteUrl' => Tools::getHttpHost(true).
            __PS_BASE_URI__,
            'tokenYownes' => Tools::getAdminTokenLite('AdminYownesAjax')
        ));

        return $this->display(__FILE__, 'views/templates/admin/configure.tpl');
    }

    /**
     * Get configuration array from database
     * @return array
     */
    public function getConfigValues()
    {
        return json_decode(Configuration::get($this->name), true);
    }

    public function registerAdminAjaxTab()
    {

        $tab = new Tab();
        $tab->class_name = 'AdminYownesAjax';
        $tab->module = 'yownes';

        foreach (Language::getLanguages(false) as $lang) {
          $tab->name[$lang['id_lang']] = 'Yownes';
        }

        $tab->id_parent = -1;
        
        return $tab->save();
    }
    public function registerAdminTab()
    {
        $tab = new Tab();
        $tab->class_name = 'AdminYownes';
        foreach (Language::getLanguages(false) as $lang) {
            $tab->name[$lang['id_lang']] = 'Yownes';
        }

        $tab->id_parent = (int)Tab::getIdFromClassName('AdminTools');
        $tab->module = 'yownes';
        $tab->icon = 'library_books';

        return $tab->save();
    }

    public function deleteAdminTab()
    {
        foreach (array('AdminYownes') as $tab_name) {
            $id_tab = (int)Tab::getIdFromClassName($tab_name);
            if ($id_tab) {
                $tab = new Tab($id_tab);
                $tab->delete();
            }
        }

        return true;
    }

    /**
     * Install the database modifications required for this module.
     *
     * @return bool
     */
    private function installDatabase()
    {
        $queries = [
            'CREATE TABLE IF NOT EXISTS `'._DB_PREFIX_.'yownes_payments` (
              `customer_id` int(11) NOT NULL,
              `stripe_id` varchar(32) NOT NULL,
              PRIMARY KEY (`customer_id`)
            ) ENGINE='._MYSQL_ENGINE_.' DEFAULT CHARSET=utf8;',
        ];

        return $this->executeQueries($queries);
    }

    /**
     * Uninstall database modifications.
     *
     * @return bool
     */
    private function uninstallDatabase()
    {
        $queries = [
            'DROP TABLE IF EXISTS `'._DB_PREFIX_.'yownes_payments`',
        ];

        return $this->executeQueries($queries);
    }

    /**
     * A helper that executes multiple database queries.
     *
     * @param array $queries
     *
     * @return bool
     */
    private function executeQueries(array $queries)
    {
        foreach ($queries as $query) {
            if (!Db::getInstance()->execute($query)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Add payment option at the checkout in the front office (prestashop 1.7)
     *
     * @param array $params
     *
     * @return array
     */
    public function hookPaymentOptions($params)
    {
        if (!$this->active) {
            return [];
        }

        if (!$this->checkCurrency($params['cart'])) {
            return [];
        }

        $this->smarty->assign(
            $this->getTemplateVarInfos()
        );

        $newOption = new PaymentOption();
        $newOption->setModuleName($this->name)
                ->setCallToActionText($this->trans('Pago desde App Yownes', array(), 'Modules.Yownes.Shop'));
        $payment_options = [
            $newOption,
        ];

        return $payment_options;
    }
}
