const thirdUrls = Array.from(document.querySelectorAll('script[data-resource-src]')).map((v: any) => {
  return v.dataset.resourceSrc;
})

interface umdItem {
  [name: string]: Promise<any> | undefined;
}

const umdList: umdItem = {};

let resourcePromise: Promise<any>;

export const loadResources = (url: string, id?: string) => {
  if (url && umdList[url]) {
    return umdList[url];
  }
  const loadPromise = new Promise((resolve) => {
    const scriptEle = document.createElement('script');
    scriptEle.setAttribute('data-type', id ? 'umd' : 'third');
    // 携带id为umd
    if (id) {
      scriptEle.id = url;
    }
    scriptEle.src = url;
    scriptEle.onload = () => {
      scriptEle.onload = null;
      resolve(true);
    }
    scriptEle.onerror = () => {
      scriptEle.onerror = null;
      scriptEle.parentNode && scriptEle.parentNode.removeChild(scriptEle);
      resolve(false);
    }
    document.head.appendChild(scriptEle);
  })
  if (id) {
    umdList[url] = loadPromise;
  }
  return loadPromise;
}

export const initThirdResources = () => {
  if (resourcePromise) {
    return resourcePromise;
  }
  resourcePromise = Promise.all(thirdUrls.map(url => loadResources(url)));
  return resourcePromise;
}
