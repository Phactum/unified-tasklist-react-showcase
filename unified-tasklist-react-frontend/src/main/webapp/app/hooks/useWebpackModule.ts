import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as tslib from 'tslib';
import * as Moment from 'moment';
import * as FastDeepEqual from 'fast-deep-equal';
import * as UnifiedTasklistCommon from '@unified-tasklist/common';

import loadJS from 'loadjs';

import { ExportComponents } from '@unified-tasklist/common/types/tasklist-types';

type LoaderState = 'error' | 'success' | 'loading' | 'pending';

interface ComponentEvent {
  state: LoaderState;
  payload?: object;
}

// this list has to consist of dependencies of commons-react and tasklist
// otherwise "tree-shaking" would remove them and they wouldn't be found by
// external loaded modules
const knownModules = {
  '@unified-tasklist/common': UnifiedTasklistCommon,
  // from unified-tasklist-react-common/package.json "dependencies":
  'moment': Moment,
  'fast-deep-equal': FastDeepEqual,
  'react-dom': ReactDOM,
  'react': React,
  // from tasklist for external modules:
  'tslib': tslib,
};

const getComponentFromSource: (source: string) => any
    = (source: string) => {

  // build local scope similar for eval
  const exports = {};

  function require(name: string) { // Hijacking require call to importing internal dependencies.

    // find module from list (e.g. '@unified-tasklist/common')
    const moduleInfo = Object
        .keys(knownModules)
        .filter(knownModule => (name === knownModule)
          || name.startsWith(knownModule + '/'))
        .map(knownModule => {
          return {
            name: knownModule,
            sub: name.substr(knownModule.length),
            module: knownModules[knownModule]
          };
        })
        .reduce((result, info) => info, undefined);
    if (!moduleInfo) {
      throw new Error(`Didn't find module '${name}' -> extend knownModules in useWebpackModule.ts!`);
    }

    // find sub module (e.g. '@unified-tasklist/common/components/MyUiComponent')
    const parts = moduleInfo.sub.split('/');
    let requiredModule = moduleInfo.module;
    let lastPart = null;
    parts.forEach(part => {
        if (requiredModule && (part.length > 0)) {
          lastPart = part.replace(/-/g, '');
          requiredModule = requiredModule[lastPart];
        }
      });
    if (!requiredModule) {
      console.warn(`Imported module '${moduleInfo.name}':`, moduleInfo.module);
      throw new Error(`Didn't find export '${moduleInfo.sub}' in module '${moduleInfo.name}' -> extend index.ts in that submodule to export it as '${lastPart}'!`);
    }

    return requiredModule;

  }

  try {
    eval(source);
  } catch (e) {
    console.error(e);
  }

  return exports;
  
};

const getComponentsLoader = (webpackJsonUrl: string, baseUrl: string, useCase: string) => {

  const callbacks = [];
  let state: LoaderState = 'pending';
  let components = null;

  const load = async () => {

    const url = useCase === 'list' ? webpackJsonUrl + '_list' : webpackJsonUrl;
    const json = await (await fetch(url)).json();
    if (!json.modules) {
      throw new Error(`Could not load webpack module information from url '${url}'! Got this instead:\n` + JSON.stringify(json));
    }

    const modulePattern = new RegExp(`/${json.moduleName}(\.[a-z0-9]+)?\.bundle\.js$`);
    const moduleUrl: string | undefined = json
        .modules
        .find(bundlePath => modulePattern.test(bundlePath));
    if (!moduleUrl) {
      throw new Error(`Unidentifiable module URL in response of ${url}! Got this:\n` + JSON.stringify(json));
    }

    const chunkUrls = json
        .modules
        .filter(bundlePath => !modulePattern.test(bundlePath))
        .map(bundlePath => baseUrl + bundlePath);
    const [source] = await Promise.all([
      fetch(baseUrl + moduleUrl)
          .then(response => response.status === 200 ? response.text() : ''),
      chunkUrls.length
          ? loadJS(chunkUrls, { async: true, returnPromise: true, numRetries: 2 })
          : Promise.resolve(),
    ]);

    const loadedComponents = getComponentFromSource(source).components;
    if (!loadedComponents) {
      throw new Error(`Loading module according to ${url} failed!`);
    }

    if (useCase === 'list') {
      const newComponents = loadedComponents as ExportComponents.ListCollection;
      if (!newComponents.List) {
        throw new Error(`List-Module loaded according to ${url} did not provide at least of this components: List!`);
      }
    } else {
      const newComponents = loadedComponents as ExportComponents.ComponentCollection;
      if (!newComponents.Form) {
        throw new Error(`Module loaded according to ${url} did not provide at least of this components: Form!`);
      }
    }

    return loadedComponents;
    
  };

  const retry = async () => {

    if (state === 'loading') return;
    state = 'loading';
    publish({ state });
    try {
      components = await load();
      state = 'success';
      publish({ state, payload: components });
    } catch (e) {
      console.error(e);
      state = 'error';
      publish({ state });
    }

  };

  const publish = (event: ComponentEvent) => callbacks
      .forEach(callback => callback(event));

  const subscribe = (callback: (event: ComponentEvent) => void) => {

    if (!callbacks.includes(callback)) {
      callbacks.push(callback);
      const payload = state === 'success'
          ? { payload: components }
          : {};
      callback({ state, ...payload });
    }

  };

  const unsubscribe = (callback: (event: ComponentEvent) => void) => {

    const index = callbacks.indexOf(callback);
    if (index !== -1) {
      callbacks.splice(index, 1);
    }

  };

  void retry();

  return {
    subscribe,
    unsubscribe,
    retry,
  };

};

const loaderCache = {};

const memoizedGetComponentsLoader = (webpackJsonUrl: string, baseUrl: string, useCase: string) => {

  const key = webpackJsonUrl + '___' + baseUrl + '___' + useCase;
  const loader = loaderCache[key];
  if (loader) {
    return loader;
  }

  const newLoader = getComponentsLoader(webpackJsonUrl, baseUrl, useCase);
  loaderCache[key] = newLoader;
  return newLoader;

}

// Default hook export with state and effect handler
export default (url: string, path: string, useCase: string) => {

  const [components, setComponents] = React.useState(null);
  const [loaded, setLoaded] = React.useState(false);
  const [error, setError] = React.useState(false);

  const retry = () => memoizedGetComponentsLoader(url + path, url, useCase).retry();

  const handleEvent = (event: ComponentEvent) => {

    switch (event.state) {
      case 'error':
        setError(true);
        setLoaded(false);
        break;
      case 'loading':
        setError(false);
        setLoaded(false);
        break;
      case 'success':
        setError(false);
        setComponents(event.payload);
        setLoaded(true);
        break;
      default:
      // nothing
    }

  };

  React.useEffect(() => {
    const { subscribe, unsubscribe } = memoizedGetComponentsLoader(url + path, url, useCase);
    subscribe(handleEvent);
    return () => unsubscribe(handleEvent);
  }, [url, path, useCase]);

  return {
    components,
    loaded,
    error,
    retry, // may be used if loading failed and one likes to offer a button for retrying
  };

};
