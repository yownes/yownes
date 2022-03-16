<?php
/**
 * 2020 (c) Yownes
 *
 * MODULE Yownes
 *
 * @author    Yownes
 * @copyright Copyright (c) permanent, Yownes
 * @license   MIT
 * @version   0.1.0
 */

use PrestaShop\PrestaShop\Core\Product\Search\ProductSearchContext;
use PrestaShop\PrestaShop\Core\Product\Search\ProductSearchProviderInterface;
use PrestaShop\PrestaShop\Adapter\Search\SearchProductSearchProvider;
use PrestaShop\PrestaShop\Adapter\Category\CategoryProductSearchProvider;
use PrestaShop\PrestaShop\Core\Product\Search\ProductSearchQuery;
use PrestaShop\PrestaShop\Core\Product\Search\ProductSearchResult;
use PrestaShop\PrestaShop\Core\Product\Search\SortOrder;

class ProductSearch {

    private $shopId;

    private $languageId;

    private $limit = 10;

    private $page = 1;

    private $order = null;

    private $currencyId = 1;

    private $customer = null;
    
    private $facets = false;

    private $categoryId = null;

    private $searchString = "";

    public function __construct($context)
    {
        $this->shopId = $context->shop->id;
        $this->languageId = $context->language->id;
        $this->customer = $context->customer;
        $this->currencyId = $context->currency->id;
    }

    public function setCurrency($currencyId)
    {
        $this->currencyId = $currencyId;
    }
    
    public function setCustomer($customer)
    {
        $this->customer = $customer;
    }
    
    public function setLimit($limit)
    {
        $this->limit = $limit;
    }
    
    public function setOrder($order)
    {
        $this->order = $order;
    }
    
    public function setPage($page)
    {
        $this->page = $page;
    }

    public function setFacets($facets)
    {
        $this->facets = $facets;
    }

    public function setCategoryId($categoryId)
    {
        $this->categoryId = $categoryId;
    }
    
    public function setSearchString($searchString)
    {
        $this->searchString = $searchString;
    }

    protected function getProductSearchContext()
    {
        return (new ProductSearchContext())
            ->setIdShop($this->shopId)
            ->setIdLang($this->languageId)
            ->setIdCurrency($this->currencyId)
            ->setIdCustomer(
                $this->customer ?
                    $this->customer->id :
                    null
            );
    }

    protected function getProductSearchQuery()
    {
        $query = new ProductSearchQuery();
        $query
            ->setSortOrder(new SortOrder('product', 'position', 'desc'))
            ->setSearchString($this->searchString);
        
        if ($this->categoryId) {
            $query->setIdCategory((int) $this->categoryId);
        }

        return $query;
    }

    protected function getProductSearchProviderFromModules($query)
    {
        $providers = Hook::exec(
            'productSearchProvider',
            ['query' => $query],
            null,
            true
        );

        if (!is_array($providers)) {
            $providers = [];
        }

        foreach ($providers as $provider) {
            if ($provider instanceof ProductSearchProviderInterface) {
                return $provider;
            }
        }
    }

    protected function getDefaultProductSearchProvider()
    {
        if ($this->categoryId) {
            $category = new Category(
                $this->categoryId,
                $this->languageId
            );
            return new CategoryProductSearchProvider(
                Context::getContext()->getTranslator(),
                $category
            );
        } else {
            return new SearchProductSearchProvider(
                Context::getContext()->getTranslator()
            );
        }
    }

    /**
     * Sort filters by magnitude
     *
     * @return ProductSearchResult
     */
    public function getProductsSearch()
    {
         // the search provider will need a context (language, shop...) to do its job
         $context = $this->getProductSearchContext();

         // the controller generates the query...
         $query = $this->getProductSearchQuery();
 
         // ...modules decide if they can handle it (first one that can is used)
         $provider = $this->getProductSearchProviderFromModules($query);
 
         // if no module wants to do the query, then the core feature is used
         if (null === $provider) {
             $provider = $this->getDefaultProductSearchProvider();
         }
 
         $resultsPerPage = (int) $this->limit;
         if ($resultsPerPage <= 0) {
             $resultsPerPage = Configuration::get('PS_PRODUCTS_PER_PAGE');
         }
 
         // we need to set a few parameters from back-end preferences
         $query
             ->setResultsPerPage($resultsPerPage)
             ->setPage(max((int) $this->page, 1))
         ;
 
         // set the sort order if provided in the URL
         if ($encodedSortOrder = $this->order) {
             $query->setSortOrder(SortOrder::newFromString(
                 $encodedSortOrder
             ));
         }
 
         /*
          * The controller is agnostic of facets.
          * It's up to the search module to use /define them.
          *
          * Facets are encoded in the "q" URL parameter, which is passed
          * to the search provider through the query's "$encodedFacets" property.
          */
 
         $query->setEncodedFacets($this->facets);

         Hook::exec('actionProductSearchProviderRunQueryBefore', [
            'query' => $query,
        ]);

         // We're ready to run the actual query!

        /** @var ProductSearchResult $result */
        $result = $provider->runQuery(
            $context,
            $query
        );

        Hook::exec('actionProductSearchProviderRunQueryAfter', [
            'query' => $query,
            'result' => $result,
        ]);

        $facets = $result->getFacetCollection();

        // sort order is useful for template,
        // add it if undefined - it should be the same one
        // as for the query anyway
        if (!$result->getCurrentSortOrder()) {
            $result->setCurrentSortOrder($query->getSortOrder());
        }

        return $result;
    }
}