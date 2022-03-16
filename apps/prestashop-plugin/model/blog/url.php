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

class ModelBlogUrl extends Model
{
    public function link($params)
    {
        $base_url_blog = 'blog';

        $param = null;
        $ok_rewrite = '';
        $ok_rewrite_id = '';
        $ok_rewrite_do = '';
        $ok_rewrite_cat = '';
        $ok_rewrite_categorie = '';
        $ok_rewrite_page = '';
        $ok_rewrite_titre = '';
        $ok_rewrite_seo = '';
        $ok_rewrite_year = '';
        $ok_rewrite_month = '';

        if (isset($params['do']) && $params['do'] != '') {
            $ok_rewrite_do = $params['do'];
            $param += 1;
        }
        if (isset($params['id']) && $params['id'] != '') {
            $ok_rewrite_id = '-n' . $params['id'];
            $param += 1;
        }
        if (isset($params['c']) && $params['c'] != '') {
            $ok_rewrite_cat = '-c' . $params['c'];
            $param += 1;
        }
        if (isset($params['start']) && isset($params['p']) && $params['start'] != '' && $params['p'] != '') {
            $ok_rewrite_page = $params['start'] . 'p' . $params['p'];
            $param += 1;
        }
        if (isset($params['titre']) && $params['titre'] != '') {
            $ok_rewrite_titre = $this->prestablogFilter(Tools::link_rewrite($params['titre']));
            $param += 1;
        }
        if (isset($params['categorie']) && $params['categorie'] != '') {
            $ok_rewrite_categorie = $this->prestablogFilter(Tools::link_rewrite($params['categorie']));
            if (isset($params['start']) && isset($params['p']) && $params['start'] != '' && $params['p'] != '') {
                $ok_rewrite_categorie .= '-';
            } else {
                $ok_rewrite_categorie .= '';
            }
            $param += 1;
        }
        if (isset($params['seo']) && $params['seo'] != '') {
            $ok_rewrite_titre = $this->prestablogFilter(Tools::link_rewrite($params['seo']));
            $param += 1;
        }
        if (isset($params['y']) && $params['y'] != '') {
            $ok_rewrite_year = 'y' . $params['y'];
            $param += 1;
        }
        if (isset($params['m']) && $params['m'] != '') {
            $ok_rewrite_month = '-m' . $params['m'];
            $param += 1;
        }
        if (isset($params['seo']) && $params['seo'] != '') {
            $ok_rewrite_seo = $params['seo'];
            $ok_rewrite_titre = '';
            $param += 1;
        }
        if (isset($params) && count($params) > 0 && !isset($params['rss'])) {
            $ok_rewrite = $base_url_blog . '/' . $ok_rewrite_do . $ok_rewrite_categorie . $ok_rewrite_page;
            $ok_rewrite .= $ok_rewrite_year . $ok_rewrite_month . $ok_rewrite_titre . $ok_rewrite_seo;
            $ok_rewrite .= $ok_rewrite_cat . $ok_rewrite_id;
        } elseif (isset($params['rss'])) {
            if ($params['rss'] == 'all') {
                $ok_rewrite = 'rss';
            } else {
                $ok_rewrite = 'rss/' . $params['rss'];
            }
        } else {
            $ok_rewrite = $base_url_blog;
        }

        if (!isset($params['id_lang'])) {
            (int)$params['id_lang'] = null;
        }

        return $ok_rewrite;
    }

    public function prestablogFilter($retourne)
    {
        $search = array('/--+/');
        $replace = array('-');

        $retourne = Tools::strtolower(preg_replace($search, $replace, $retourne));

        $url_replace = array(
            '/А/' => 'A', '/а/' => 'a',
            '/Б/' => 'B', '/б/' => 'b',
            '/В/' => 'V', '/в/' => 'v',
            '/Г/' => 'G', '/г/' => 'g',
            '/Д/' => 'D', '/д/' => 'd',
            '/Е/' => 'E', '/е/' => 'e',
            '/Ж/' => 'J', '/ж/' => 'j',
            '/З/' => 'Z', '/з/' => 'z',
            '/И/' => 'I', '/и/' => 'i',
            '/Й/' => 'Y', '/й/' => 'y',
            '/К/' => 'K', '/к/' => 'k',
            '/Л/' => 'L', '/л/' => 'l',
            '/М/' => 'M', '/м/' => 'm',
            '/Н/' => 'N', '/н/' => 'n',
            '/О/' => 'O', '/о/' => 'o',
            '/П/' => 'P', '/п/' => 'p',
            '/Р/' => 'R', '/р/' => 'r',
            '/С/' => 'S', '/с/' => 's',
            '/Т/' => 'T', '/т/' => 't',
            '/У/' => 'U', '/у/' => 'u',
            '/Ф/' => 'F', '/ф/' => 'f',
            '/Х/' => 'H', '/х/' => 'h',
            '/Ц/' => 'C', '/ц/' => 'c',
            '/Ч/' => 'CH', '/ч/' => 'ch',
            '/Ш/' => 'SH', '/ш/' => 'sh',
            '/Щ/' => 'SHT', '/щ/' => 'sht',
            '/Ъ/' => 'A', '/ъ/' => 'a',
            '/Ь/' => 'X', '/ь/' => 'x',
            '/Ю/' => 'YU', '/ю/' => 'yu',
            '/Я/' => 'YA', '/я/' => 'ya',
        );

        $cyrillic_find = array_keys($url_replace);
        $cyrillic_replace = array_values($url_replace);

        $retourne = Tools::strtolower(preg_replace($cyrillic_find, $cyrillic_replace, $retourne));

        return $retourne;
    }
}
