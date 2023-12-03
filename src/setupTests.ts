// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';

// Mock matchmedia
window.matchMedia = window.matchMedia || function() {
  return {
      matches: false,
      addListener: function() {},
      removeListener: function() {}
  };
};

// @ts-ignore
window.authConfig = {
  "authServerUrl": "https://login.ourproject.at/auth/",
  "clientSecret": "LxUXJLXP2Ra57y4RcIzXPYgNHvJF7H1j",
  "realm": "VFEEG",
  "clientId": "at.ourproject.vfeeg.app"
}