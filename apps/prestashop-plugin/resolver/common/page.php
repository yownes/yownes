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
 *
 * @version   0.1.0
 */

class ResolverCommonPage extends Resolver
{
    public function get($args)
    {
        $this->load->model('common/page');
        $page_info = $this->model_common_page->getPage($args['id']);

        return array(
            'id' => $page_info['id'],
            'name' => $page_info['title'],
            'title' => $page_info['title'],
            'description' => $page_info['description'],
            'sort_order' => (int) $page_info['sort_order'],
            'keyword' => $page_info['keyword'],
            'meta' => array(
                'title' => $page_info['meta']['title'],
                'description' => $page_info['meta']['description'],
                'keyword' => $page_info['meta']['keyword'],
            ),
        );
    }

    public function getList($args)
    {
        $this->load->model('common/page');
        $filter_data = array(
            'start' => ($args['page'] - 1) * $args['size'],
            'limit' => $args['size'],
            'sort' => $args['sort'],
            'order' => $args['order'],
        );

        if ($filter_data['sort'] == 'id') {
            $filter_data['sort'] = 'page_id';
        }

        if (!empty($args['search'])) {
            $filter_data['filter_search'] = $args['search'];
        }

        $results = $this->model_common_page->getPages($filter_data);

        $page_total = $this->model_common_page->getTotalPages($filter_data);

        $pages = array();

        foreach ($results as $page) {
            $pages[] = $this->get(array('id' => $page['id_cms']));
        }

        return array(
            'content' => $pages,
            'first' => $args['page'] === 1,
            'last' => $args['page'] === ceil($page_total / $args['size']),
            'number' => (int) $args['page'],
            'numberOfElements' => count($pages),
            'size' => (int) $args['size'],
            'totalPages' => (int) ceil($page_total / $args['size']),
            'totalElements' => (int) $page_total,
        );
    }
}
