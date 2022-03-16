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

class ResolverCommonHome extends Resolver
{
    public function get()
    {
        $meta_info = Meta::getMetaByPage('index', $this->context->language->id);

        $imgname = Configuration::get('BANNER_IMG', $this->context->language->id);
        $banner_img = $this->context->link->protocol_content . Tools::getMediaServer($imgname) . __PS_BASE_URI__ . 'modules/ps_banner/img/' . $imgname;
        $slides = Module::getInstanceByName('ps_imageslider')->getWidgetVariables();

        return array(
            'meta' => array(
                'title' => $meta_info['title'],
                'description' => $meta_info['description'],
                'keyword' => $meta_info['keywords'],
            ),
            'banner' => $banner_img,
            'slides' => $this->parseSlides($slides)
        );
    }

    private function parseSlides($raw)
    {
        $homeslides = $raw['homeslider'];
        $slides = [];

        foreach ($homeslides['slides'] as $s) {
            $slides[] = array(
                'id' => $s['id_slide'],
                'position' => $s['position'],
                'active' => $s['active'],
                'url' => $s['url'],
                'imageUrl' => $s['image_url'],
                'legend' => $s['legend'],
                'title' => $s['title'],
                'description' => $s['description'],
                'size' => array(
                    'width' => $s['sizes']['0'],
                    'height' => $s['sizes']['1'],
                ),
            );
        }
        return array(
            'speed' => $homeslides['speed'],
            'slides' => $slides
        );
        
    }
}
