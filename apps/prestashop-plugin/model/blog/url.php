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
            '/??/' => 'A', '/??/' => 'a',
            '/??/' => 'B', '/??/' => 'b',
            '/??/' => 'V', '/??/' => 'v',
            '/??/' => 'G', '/??/' => 'g',
            '/??/' => 'D', '/??/' => 'd',
            '/??/' => 'E', '/??/' => 'e',
            '/??/' => 'J', '/??/' => 'j',
            '/??/' => 'Z', '/??/' => 'z',
            '/??/' => 'I', '/??/' => 'i',
            '/??/' => 'Y', '/??/' => 'y',
            '/??/' => 'K', '/??/' => 'k',
            '/??/' => 'L', '/??/' => 'l',
            '/??/' => 'M', '/??/' => 'm',
            '/??/' => 'N', '/??/' => 'n',
            '/??/' => 'O', '/??/' => 'o',
            '/??/' => 'P', '/??/' => 'p',
            '/??/' => 'R', '/??/' => 'r',
            '/??/' => 'S', '/??/' => 's',
            '/??/' => 'T', '/??/' => 't',
            '/??/' => 'U', '/??/' => 'u',
            '/??/' => 'F', '/??/' => 'f',
            '/??/' => 'H', '/??/' => 'h',
            '/??/' => 'C', '/??/' => 'c',
            '/??/' => 'CH', '/??/' => 'ch',
            '/??/' => 'SH', '/??/' => 'sh',
            '/??/' => 'SHT', '/??/' => 'sht',
            '/??/' => 'A', '/??/' => 'a',
            '/??/' => 'X', '/??/' => 'x',
            '/??/' => 'YU', '/??/' => 'yu',
            '/??/' => 'YA', '/??/' => 'ya',
        );

        $cyrillic_find = array_keys($url_replace);
        $cyrillic_replace = array_values($url_replace);

        $retourne = Tools::strtolower(preg_replace($cyrillic_find, $cyrillic_replace, $retourne));

        return $retourne;
    }
}
