<?php
/**
 *
 * supported: PRESTABLOG
 *
 * Thanks to the team from PrestaBlog for providing the codebase
 * and assisting with the integration of VueFrongt with PrestaBlog.
 *
 * Since prestaShop does not have a blog by default, we have implemented
 * support for one of the most popular Blog modules - PrestaBlog
 *
 * If you have another blog, you can use this model to modify it to
 * add support for your current blog
 *
 * MODULE Yownes
 *
 * @author    VueFront, Yownes
 * @copyright Copyright (c) permanent, VueFront
 * @copyright Copyright (c) permanent, Yownes
 * @license   MIT
 * @version   0.1.0
 */

include_once _PS_MODULE_DIR_ . 'prestablog/class/categories.class.php';

class ModelBlogCategory extends Model
{
    public function getCategory($category_id)
    {
        $category = new CategoriesClass((int) $category_id, (int) $this->context->language->id, 1);

        $this->load->model('blog/url');

        $url = $this->model_blog_url->link(array(
            'c' => $category->id,
            'categorie' => $category->link_rewrite
        ));

        return array(
            'id' => $category->id,
            'name' => $category->title,
            'description' => html_entity_decode($category->description, ENT_QUOTES, 'UTF-8'),
            'parent_id' => $category->parent,
            'image' => $this->getImage($category->id),
            'imageLazy' => $this->getImageLazy($category->id),
            'keyword' => $url,
            'meta' => array(
                'title' => $category->meta_title,
                'description' => $category->meta_description,
                'keyword' => $category->meta_keywords,
            ),
        );
    }

    public function getImage($category_id)
    {
        $uri = __PS_BASE_URI__ . 'modules/prestablog/views/img/' .
         Configuration::get('prestablog_theme') . '/up-img/c/' . $category_id . '.jpg';
        return $this->context->link->protocol_content . Tools::getMediaServer($uri) . $uri;
    }

    public function getImageLazy($category_id)
    {
        $uri = __PS_BASE_URI__ . 'modules/prestablog/views/img/' .
         Configuration::get('prestablog_theme') . '/up-img/c/thumb_' . $category_id . '.jpg';
        return $this->context->link->protocol_content . Tools::getMediaServer($uri) . $uri;
    }


    public function getCategories($data = array())
    {
        $sort = 'c.`id_prestablog_categorie`';
        if (!empty($data['sort'])) {
            if ($data['sort'] == 'sort_order') {
                $sort = 'c.`id_prestablog_categorie`, c.`position`';
            }
            if ($data['sort'] == 'name') {
                $sort = 'cl.`name`';
            }
        }

        $language_id = $this->context->language->id;
        $order = !empty($data['order'])? $data['order']: 'ASC';

        $sql = new DbQuery();
        $sql->select('*');
        $sql->from('prestablog_categorie', 'c');
        $sql->leftJoin('prestablog_categorie_lang', 'cl', 'cl.`id_prestablog_categorie` = c.`id_prestablog_categorie`');
        $sql->where('c.`actif` = 1');
        $sql->where('cl.`id_lang` = ' . (int) $language_id);

        if (isset($data['filter_parent_id'])) {
            $sql->where('c.`parent` = ' . (int)$data['filter_parent_id']);
        }

        $sql->orderBy($sort . ' ' . $order);

        if (!empty($data['limit']) && $data['limit'] != -1) {
            $sql->limit($data['limit'], $data['start']);
        }

        $result = Db::getInstance(_PS_USE_SQL_SLAVE_)->executeS($sql);

        return $result ? $result : array();
    }

    public function getTotalCategories($data = array())
    {
        $parent_id = false;
        if (!empty($data['filter_parent_id']) && $data['filter_parent_id'] !== -1) {
            $parent_id = $data['filter_parent_id'];
        }

        $language_id = $this->context->language->id;

        $sql = new DbQuery();
        $sql->select('count(*)');
        $sql->from('prestablog_categorie', 'c');
        $sql->leftJoin('prestablog_categorie_lang', 'cl', 'cl.`id_prestablog_categorie` = c.`id_prestablog_categorie`');
        $sql->where('c.`actif` = 1');
        $sql->where('cl.`id_lang` = ' . (int) $language_id);

        if ($parent_id) {
            $sql->where('c.`id_parent` = ' . (int) $parent_id);
        }

        $result = Db::getInstance(_PS_USE_SQL_SLAVE_)->getRow($sql);
        return $result['count(*)'];
    }

    public function getCategoryByPostId($post_id)
    {
        $result = Db::getInstance(_PS_USE_SQL_SLAVE_)->ExecuteS('
        SELECT    cl.`title`, cl.`link_rewrite`, cc.`categorie`
        FROM `'.bqSQL(_DB_PREFIX_.'prestablog_correspondancecategorie').'` as cc
        LEFT JOIN `'.bqSQL(_DB_PREFIX_).'prestablog_categorie` as c
            ON (cc.`categorie` = c.`id_prestablog_categorie`)
        LEFT JOIN `'.bqSQL(_DB_PREFIX_).'prestablog_categorie_lang` as cl
            ON (cc.`categorie` = cl.`id_prestablog_categorie`)
        WHERE cc.`news` = '.(int)$post_id.'
            AND cl.`id_lang` = '.(int)$this->context->cookie->id_lang.'
            AND c.`actif` = 1
        ORDER BY cl.`title`');

        return $result;
    }
}
