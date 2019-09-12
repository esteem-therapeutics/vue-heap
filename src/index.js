const HEAP_INSTANCE_METHODS = [
  'addEventProperties',
  'addUserProperties',
  'clearEventProperties',
  'identify',
  'resetIdentity',
  'removeEventProperty',
  'setEventProperties',
  'track',
  'unsetEventProperty'
];

const VueHeap = {
  createHeap: function(key, config) {
    // initialize heap if necessary
    window.heap = window.heap || [];

    // set configuration properties
    window.heap.appid = key;
    window.heap.config = config || {};

    // while we are waiting for the heap script to load we still need to be
    // able to capture any events that are meant to be logged by heap. once the
    // script is loaded, these events will be uploaded to heap
    for (let i = 0; i < HEAP_INSTANCE_METHODS.length; i++) {
      window.heap[HEAP_INSTANCE_METHODS[i]] = function() {
        if (window.heap && window.heap.push) {
          window.heap.push(
            [HEAP_INSTANCE_METHODS[i]].concat(
              Array.prototype.slice.call(arguments, 0)
            )
          );
        }
      };
    }
  },
  addHeapScript: function(key, config) {
    const useHTTPS = config.forceSSL || 'https:' === document.location.protocol;

    const heapScript = document.createElement('script');
    heapScript.type = 'text/javascript';
    heapScript.async = true;
    heapScript.src = `${
      useHTTPS ? 'https:' : 'http:'
    }//cdn.heapanalytics.com/js/heap-${key}.js`;

    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(heapScript, firstScriptTag);
  },
  install: function(Vue, options) {
    if (options.key === undefined) {
      throw new Error('No Heap App ID specified.');
    }

    // create a heap instance
    this.createHeap(options.key, options);

    if (options.enable) {
      // load the heap script onto the page
      this.addHeapScript(options.key, options);
    }

    // add $heap reference so components can use this.$heap
    Vue.prototype.$heap = window.heap;
  }
};

export default VueHeap;
