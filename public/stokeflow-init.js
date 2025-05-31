/**
 * StokeFlow Initialization Helper
 * Ensures proper loading order for manual widget creation
 */

(function() {
  'use strict';

  // Queue for callbacks waiting for StokeFlow to load
  window.StokeFlowReadyCallbacks = window.StokeFlowReadyCallbacks || [];

  // Helper function to ensure StokeFlow is loaded before creating widgets
  window.StokeFlowReady = function(callback) {
    if (window.StokeFlowLoaded && window.StokeFlow) {
      // StokeFlow is already loaded, execute immediately
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
      } else {
        callback();
      }
    } else {
      // StokeFlow not loaded yet, queue the callback
      window.StokeFlowReadyCallbacks.push(callback);
    }
  };

  // Alternative syntax for easier use
  window.onStokeFlowReady = window.StokeFlowReady;

})();
