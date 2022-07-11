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

class ResolverStoreProduct extends Resolver
{
    public function __construct($registry)
    {
        parent::__construct($registry);

        $this->load->model('store/product');
    }

    public function get($args)
    {
        $product = $this->model_store_product->getProduct($args['id']);

        $price = Product::convertAndFormatPrice($product->getPriceWithoutReduct());
        $special = Product::convertAndFormatPrice($product->getPrice());

        $images = Product::getCover($args['id']);
        if (!empty($images['id_image'])) {
            $image = $this->context->link->getImageLink(
                $product->link_rewrite,
                $images['id_image'],
                ImageType::getFormatedName("large")
            );
            $imageLazy = $this->context->link->getImageLink(
                $product->link_rewrite,
                $images['id_image'],
                ImageType::getFormatedName("small")
            );
        } else {
            $image = '';
            $imageLazy = '';
        }

        $that = $this;

        $link = $this->context->link->getProductLink(
            $product,
            null,
            null,
            null,
            null,
            null,
            0,
            true
        );

        $this->load->model('store/wishlist');
        $results = $this->model_store_wishlist->getWishlist();

        $link = str_replace($this->context->link->getPageLink(''), '', $link);
        return array(
            'id'               => $product->id,
            'name'             => $product->name,
            'description'      => $product->description,
            'shortDescription' => $product->description_short,
            'manufacturer'     => $product->manufacturer_name,
            'price'            => $price,
            'special'          => $price != $special ? $special : '',
            'model'            => $product->reference,
            'image'            => $image,
            'imageBig'         => $image,
            'imageLazy'        => $imageLazy,
            'stock'            => $product->quantity,
            'rating'           => (float)0,
            'inWishlist'       => in_array($product->id,$results),
            'keyword'          => $link,
            'meta'             => array(
                'title' => $product->meta_title,
                'description' => $product->meta_description,
                'keyword' => $product->meta_keywords
            ),
            'images' => function ($root, $args) use ($that) {
                return $that->getImages(array(
                    'parent' => $root,
                    'args' => $args
                ));
            },
            'products' => function ($root, $args) use ($that) {
                return $that->getRelatedProducts(array(
                    'parent' => $root,
                    'args' => $args
                ));
            },
            'attributes' => function ($root, $args) use ($that) {
                return $that->getAttributes(array(
                    'parent' => $root,
                    'args' => $args
                ));
            },
            'reviews' => function ($root, $args) use ($that) {
                return $that->load->resolver('store/review/get', array(
                    'parent' => $root,
                    'args' => $args
                ));
            },
            'options' => function ($root, $args) use ($that) {
                return $that->getOptions(array(
                    'parent' => $root,
                    'args' => $args
                ));
            }
        );
    }
    public function getList($args)
    {
        $this->load->model('store/product');
        $filter_data = array(
            'sort'  => $args['sort'],
            'order' => $args['order'],
        );

        if ($args['size'] != '-1') {
            $filter_data['start'] = ((int)$args['page'] - 1) * (int)$args['size'];
            $filter_data['limit'] = $args['size'];
        }

        if ($filter_data['sort'] == 'id') {
            $filter_data['sort'] = 'product_id';
        }

        if ($args['category_id'] !== 0) {
            $filter_data['filter_category_id'] = $args['category_id'];
        }

        if (!empty($args['ids'])) {
            $filter_data['filter_ids'] = $args['ids'];
        }

        if (!empty($args['special'])) {
            $filter_data['filter_special'] = true;
        }

        if (!empty($args['search'])) {
            $filter_data['filter_search'] = $args['search'];
        }
        
        if (!empty($args['filter'])) {
            $filter_data['filter_facets'] = $args['filter'];
        }

        $results = $this->model_store_product->getProductsAndCount($filter_data);
        
        $product_total = $results['count'];
        $products = [];
        $facets = $results['facets'];
        $sortOrders = $results['sortOrders'];

        foreach ($results['products'] as $product) {
            $products[] = $this->get(array( 'id' => $product['id_product'] ));
        }

        return array(
            'content'          => $products,
            'facets'           => $facets,
            'sortOrders'       => $sortOrders,
            'first'            => $args['page'] === 1,
            'last'             => $args['page'] === ceil($product_total / $args['size']),
            'number'           => (int) $args['page'],
            'numberOfElements' => count($products),
            'size'             => (int) $args['size'],
            'totalPages'       => (int) ceil($product_total / $args['size']),
            'totalElements'    => (int) $product_total,
        );
    }

    public function getBestList($args)
    {
        $this->load->model('store/product');
        $filter_data = array(
            'sort'  => $args['sort'],
            'order' => $args['order'],
        );

        if ($args['size'] != '-1') {
            $filter_data['start'] = ((int)$args['page'] - 1) * (int)$args['size'];
            $filter_data['limit'] = $args['size'];
        }

        if ($filter_data['sort'] == 'id') {
            $filter_data['sort'] = 'product_id';
        }

        if ($args['category_id'] !== 0) {
            $filter_data['filter_category_id'] = $args['category_id'];
        }

        if (!empty($args['ids'])) {
            $filter_data['filter_ids'] = $args['ids'];
        }

        if (!empty($args['special'])) {
            $filter_data['filter_special'] = true;
        }

        if (!empty($args['search'])) {
            $filter_data['filter_search'] = $args['search'];
        }

        $results = $this->model_store_product->getBestSalesProducts($filter_data);
        $products = [];
        foreach ($results as $product) {
            $products[] = $this->get(array( 'id' => $product['id_product'] ));
        }

        return $products;
    }
    public function getRelatedProducts($data)
    {
        $product = $data['parent'];
        $args = $data['args'];

        $upsell_ids = $this->model_store_product->getProductRelated($product['id'], $args['limit']);

        $products = array();

        foreach ($upsell_ids as $product) {
            $products[] = $this->get(array( 'id' => $product['id_product'] ));
        }


        return $products;
    }
    public function getAttributes($data)
    {
        $product = $data['parent'];
        $results = $this->model_store_product->getProductAttributes($product['id']);

        return $results;
    }
    public function getOptions($data)
    {
        $this->load->model('store/product');
        $product = $data['parent'];
       
        $results = $this->model_store_product->getProductOptions($product['id']);
        return $results;
    }
    public function getImages($data)
    {
        $product = $data['parent'];
        $args = $data['args'];
        
        $result = $this->model_store_product->getProductImages($product['id'], $args['limit']);
        $images = Product::getCover($product['id']);

        $result = array_filter($result, function ($value) use ($images) {
            return $value['id_image'] != $images['id_image'];
        });

        return $result;
    }
}
