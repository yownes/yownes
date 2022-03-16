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

use PrestaShop\PrestaShop\Adapter\BestSales\BestSalesProductSearchProvider;
use PrestaShop\PrestaShop\Core\Product\Search\ProductSearchContext;
use PrestaShop\PrestaShop\Core\Product\Search\ProductSearchQuery;
use PrestaShop\PrestaShop\Core\Product\Search\SortOrder;


require_once dirname(__FILE__) . '/../../classes/ProductSearch.php';

class ModelStoreProduct extends Model
{
    //prestashop doesn't have related products, so we pull 4 related products from the same category
    public function getProductRelated($product_id, $limit = 4)
    {
        $product = $this->getProduct($product_id);
        return $this->getProducts(
            array(
                'filter_category_id' => $product->id_category_default,
                'limit' => $limit,
                'sort' => '',
                'order' => '',
                'start' => 0
            )
        );
    }

    public function getProductImages($product_id)
    {
        $product = new Product($product_id, true, $this->context->language->id, $this->context->shop->id);

        $images = Db::getInstance()->ExecuteS(
            'SELECT `id_image` FROM `' . _DB_PREFIX_ . 'image` WHERE `id_product` = ' . (int)($product_id)
        );

        
        $prod['id_product'] = (int)$product_id;

        $groups = Tools::getValue('group');
        $idpa = Tools::getValue('id_product_attribute');
        if (empty($groups)) {
            $groups = false;
        }

        error_log($product_id);
        error_log($groups);
        error_log($idpa);


        // $id_product_attribute =  Product::getIdProductAttributeByIdAttributes(
        //     $product_id,
        //     $groups,
        //     true
        // );

        // $id_product_attribute = 2;



        $prod['id_product_attribute'] = Product::getDefaultAttribute($this->product->id);//$id_product_attribute;

        $combinations = $product->getAttributesResume($this->context->language->id);

        error_log(json_encode($combinations));
        $product_full = Product::getProductProperties($this->context->language->id, $prod, $this->context);

        error_log(json_encode($product_full));
        // $product_full = $this->addProductCustomizationData($product_full);



        foreach ($images as $key => $image_id) {
            $images[$key]['image'] = $this->context->link->getImageLink(
                $product->link_rewrite,
                $image_id['id_image'],
                ImageType::getFormatedName("small")
            );
            $images[$key]['imageLazy'] = $this->context->link->getImageLink(
                $product->link_rewrite,
                $image_id['id_image'],
                ImageType::getFormatedName("large")
            );
            $images[$key]['imageBig'] = $this->context->link->getImageLink(
                $product->link_rewrite,
                $image_id['id_image'],
                ImageType::getFormatedName("large")
            );
        }

        return $images;
    }

    public function getProductOptions($product_id)
    {
        $result = Product::getAttributesInformationsByProduct($product_id);

        $attributes = array();
        if ($result) {
            foreach ($result as $item) {
                $attributes[$item['id_attribute_group']]['id'] = $item['id_attribute_group'];
                $attributes[$item['id_attribute_group']]['name'] = $item['group'];
                $attributes[$item['id_attribute_group']]['type'] = 'radio';
                $attributes[$item['id_attribute_group']]['values'][] = array(
                    'id' => $item['id_attribute'],
                    'name' => $item['attribute'],
                );
            }
        }

        return $attributes;
    }

    // PrestaShop does not have attributes like OpenCart.
    // PrestaShop Attributes are OpenCart Options. SO will just use options reduced.
    public function getProductAttributes($product_id)
    {
        $result = Product::getAttributesInformationsByProduct($product_id);

        $attributes = array();
        if ($result) {
            foreach ($result as $item) {
                $attributes[$item['id_attribute_group']]['name'] = $item['group'];
                $attributes[$item['id_attribute_group']]['options'][] = $item['attribute'];
            }
        }

        return $attributes;
    }

    public function getProduct($product_id)
    {
        $product = new Product($product_id, true, $this->context->language->id, $this->context->shop->id);
        return $product;
    }

    public function getProductsAndCount($data = array())
    {
        $sort = 'position';
        $order = 'desc';

        if ($data['sort'])
        {
            $sort = $data['sort'];
        }

        if ($data['order'])
        {
            $order = $data['order'];
        }

        $searchOrder = 'product.' . $sort . '.' . $order;
        
        $productSearch = new ProductSearch($this->context);
        $productSearch->setLimit($data['limit']);
        $productSearch->setOrder($searchOrder);
        $productSearch->setPage($data['start']);

        if ($data['filter_search'])
        {
            $productSearch->setSearchString($data['filter_search']);
        } else {
            if (!$data['filter_category_id']) {
                $defaultCategory = Configuration::get('PS_HOME_CATEGORY');
                $_GET['id_category'] = $defaultCategory;
                $productSearch->setCategoryId($defaultCategory);
            }
        }
        
        if ($data['filter_category_id'])
        {
            // So facetedSearch can get it from Toos::getValue('id_category')
            $_GET['id_category'] = $data['filter_category_id'];
            $productSearch->setCategoryId($data['filter_category_id']);
        }
        if ($data['filter_facets'])
        {
            $productSearch->setFacets($data['filter_facets']);
        }

        $productSearchResult = $productSearch->getProductsSearch();

        return array(
            'products' => $productSearchResult->getProducts(),
            'count' => $productSearchResult->getTotalProductsCount(),
            'facets' => $this->prepareFacets($productSearchResult),
            'sortOrders' => $this->prepareOrders($productSearchResult->getAvailableSortOrders())
        );
    }

    public function getBestSalesProducts()
    {
        $searchProvider = new BestSalesProductSearchProvider(
            $this->context->getTranslator()
        );

        $context = new ProductSearchContext($this->context);

        $query = new ProductSearchQuery();

        // $nProducts = (int) Configuration::get('PS_BLOCK_BESTSELLERS_TO_DISPLAY');

        $query
            ->setResultsPerPage(6)
            ->setPage(1)
        ;

        $query->setSortOrder(SortOrder::random());

        $result = $searchProvider->runQuery(
            $context,
            $query
        );

        return $result->getProducts();
    }

    private function prepareFacets($result)
    {
        $facetCollection = $result->getFacetCollection();
        // not all search providers generate menus
        if (empty($facetCollection)) {
            return null;
        }

        $facetsVar = array_map(
            [$this, 'prepareFacet'],
            $facetCollection->getFacets()
        );

        $displayedFilters = [];
        foreach ($facetsVar as $facet) {
            if ($facet['displayed']) {
                $displayedFilters[] = $facet;
            }
        }

        return $displayedFilters;
    }

    private function prepareFacet($facet)
    {
        $facetsArray = $facet->toArray();
        foreach ($facetsArray['filters'] as &$filter) {
            $filter['facetLabel'] = $facet->getLabel();
            $filter['value'] = $filter['nextEncodedFacets'];
        }
        unset($filter);

        return $facetsArray;
    }

    private function prepareOrder($order)
    {
        return $order->toArray();
    }

    private function prepareOrders($orders)
    {
        return array_map(
            [$this, 'prepareOrder'],
            $orders
        );
    }
}
