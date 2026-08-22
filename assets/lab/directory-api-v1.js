(() => {
  'use strict';

  const shared = window.CMXOperatorApi;
  if (!shared) return;

  const api = {
    baseUrl: shared.apiBase,
    operatorSession: () => shared.session({ refresh: true }),
    listPeople: () => shared.listPeople(),
    createPerson: (displayName) => shared.createPerson({ display_name: displayName }),
    updatePerson: (personId, patch) => shared.updatePerson(personId, patch),
    listContactMethods: (personId) => shared.listContacts(personId),
    createEmailContactMethod: (personId, address) => shared.createContact(personId, { channel: 'email', address }),
    setContactMethodLifecycle: (contactId, lifecycle) => shared.setContactLifecycle(contactId, lifecycle),
  };

  window.CMXDirectoryLabApi = Object.freeze(api);
  document.documentElement.dataset.directoryTransport = 'shared-operator-api-v2';
})();
