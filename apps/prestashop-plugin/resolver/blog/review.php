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

class ResolverBlogReview extends Resolver
{
    public function add($args)
    {
        $this->load->model('blog/review');

        $reviewData = array(
            'authorName' => $args['author'],
            'image' => '',
            'description' => $args['content'],
            'rating' => $args['rating'],
        );

        $reviewData['status'] = 0;

        // if (!$this->setting['review']['moderate']) {
        //     $reviewData['status'] = 1;
        // }

        $this->model_blog_review->addReview($args['id'], $reviewData);

        return $this->load->resolver('blog/post/get', $args);
    }

    public function get($data)
    {
        $post = $data['parent'];
        $this->load->model('blog/review');
        $result  = $this->model_blog_review->getReviews($post['id']);

        return array(
            'content'=> $result,
            'totalElements' => count($result)
        );
    }
}
