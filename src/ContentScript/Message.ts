import { browser } from 'webextension-polyfill-ts';
import { nanoid } from 'nanoid';

const IDENTIFIER = 'liker-land-extension';

class EventCenter {
  actionMap = new Map();

  constructor() {
    this.receviceMessage();
  }

  sendMessage(action: string, content: any, callBack: Function) {
    const nid = nanoid();
    const data = {
      action,
      content,
      nid,
      _identifier: IDENTIFIER,
    };
    window.postMessage(data, window.location.origin);
    this.actionMap.set(nid, callBack);
  }

  receviceMessage() {
    window.addEventListener('message', event => {
      if (event.data.type === 'response') {
        if (this.actionMap.has(event.data.nid)) {
          const callBack = this.actionMap.get(event.data.nid);
          callBack(event.data);
        }
      }
    });
  }
}

const eventCenter = new EventCenter();

export default eventCenter;
