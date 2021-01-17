import { browser } from 'webextension-polyfill-ts';
import { nanoid } from 'nanoid';

const IDENTIFIER = 'liker-land-extension';

class MessageConnecter {
  port: any;

  init() {
    this.port = browser.runtime.connect({ name: 'port-from-cs' });
    window.addEventListener('message', event => {
      if (event.source !== window || !event.data || event.data._identifier !== IDENTIFIER) return;
      this.postBgMessage(event.data.action, event.data);
    });
    this.onBgMessage();
  }

  postBgMessage(type, data) {
    if (typeof data !== 'object') return;
    this.port.postMessage({ type, data });
  }

  onBgMessage() {
    this.port.onMessage.addListener(e => {
      e.type = 'response';
      window.postMessage(e, window.location.origin);
    });
  }
}
const messageConnecter = new MessageConnecter();

export default messageConnecter;
