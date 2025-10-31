import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

class FeatureRequestWidget {
  constructor() {
    this.instances = new Map();
  }

  init({ elementId, customerId, config = {} }) {
    if (!elementId) {
      console.error('FeatureRequestWidget: elementId is required');
      return;
    }

    const container = document.getElementById(elementId);
    if (!container) {
      console.error(`FeatureRequestWidget: Element with id "${elementId}" not found`);
      return;
    }

    if (this.instances.has(elementId)) {
      console.warn(`FeatureRequestWidget: Widget already initialized for "${elementId}"`);
      return;
    }

    const root = ReactDOM.createRoot(container);
    root.render(
      <React.StrictMode>
        <App customerId={customerId} {...config} />
      </React.StrictMode>
    );

    this.instances.set(elementId, { root, container });

    return this;
  }

  destroy(elementId) {
    const instance = this.instances.get(elementId);
    if (instance) {
      instance.root.unmount();
      this.instances.delete(elementId);
    }
  }

  destroyAll() {
    this.instances.forEach((instance) => {
      instance.root.unmount();
    });
    this.instances.clear();
  }
}

// Global instance
const widgetInstance = new FeatureRequestWidget();

// Expose to window for UMD builds
if (typeof window !== 'undefined') {
  window.FeatureRequestWidget = widgetInstance;
}

// ES module export
export default widgetInstance;
