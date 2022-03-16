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

class Action
{
    private $id;
    private $route;
    private $method = 'index';

    public function __construct($route)
    {
        $this->id = $route;
        
        $parts = explode('/', preg_replace('/[^a-zA-Z0-9_\/]/', '', (string)$route));

        // Break apart the route
        while ($parts) {
            $file = DIR_PLUGIN . 'resolver/' . implode('/', $parts) . '.php';
            if (is_file($file)) {
                $this->route = implode('/', $parts);
                
                break;
            } else {
                $this->method = array_pop($parts);
            }
        }
    }

    public function getId()
    {
        return $this->id;
    }
    
    public function execute($registry, array $args = array())
    {
        if (Tools::substr($this->method, 0, 2) == '__') {
            return new \Exception('Error: Calls to magic methods are not allowed!');
        }

        $file  = DIR_PLUGIN . 'resolver/' . $this->route . '.php';
        $class = 'Resolver' . preg_replace('/[^a-zA-Z0-9]/', '', $this->route);
        if (is_file($file)) {
            include_once($file);
        
            $resolver = new $class($registry);
        } else {
            return new \Exception('Error: Could not call ' . $this->route . '/' . $this->method . '!');
        }
        $reflection = new ReflectionClass($class);
        
        if ($reflection->hasMethod($this->method) &&
            $reflection->getMethod($this->method)->getNumberOfRequiredParameters() <= count($args)) {
            return call_user_func_array(array($resolver, $this->method), $args);
        } else {
            return new \Exception('Error: Could not call ' . $this->route . '/' . $this->method . '!');
        }
    }
}
