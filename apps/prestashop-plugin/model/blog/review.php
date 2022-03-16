<?php
/**
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

include_once _PS_MODULE_DIR_ . 'prestablog/class/commentnews.class.php';

class ModelBlogReview extends Model
{
    public function getReviews($post_id)
    {
        $sql = new DbQuery();
        $sql->select('*');
        $sql->from('prestablog_commentnews', 'pcn');
        $sql->where('pcn.`news` = ' . (int) $post_id);

        $results = Db::getInstance(_PS_USE_SQL_SLAVE_)->executeS($sql);
        
        $reviews = array();
        foreach ($results as $result) {
            $reviews[] = array(
                'author' => $result['name'],
                'author_email' => null,
                'content' => $result['comment'],
                'created_at' => $result['date'],
                'rating' => null,
            );
        }
        
        return $reviews;
    }
}
