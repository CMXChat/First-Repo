(() => {
  'use strict';

  const descriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
  if (!descriptor?.get || !descriptor?.set) return;

  ['viewModeButton', 'sharedToggleInside'].forEach(id => {
    const element = document.getElementById(id);
    if (!element || element.dataset.guardedInnerHtml === 'true') return;
    element.dataset.guardedInnerHtml = 'true';
    Object.defineProperty(element, 'innerHTML', {
      configurable: true,
      get() {
        return descriptor.get.call(this);
      },
      set(value) {
        const next = String(value);
        if (descriptor.get.call(this) !== next) descriptor.set.call(this, next);
      }
    });
  });
})();
