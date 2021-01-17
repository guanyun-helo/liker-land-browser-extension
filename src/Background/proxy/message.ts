import { browser } from 'webextension-polyfill-ts';
import Api from './likerProxy';

class BgMessageConnecter {
  portFromCs: any = null;

  constructor() {
    browser.runtime.onConnect.addListener(this.onConnected.bind(this));
  }

  onConnected(p: { name: string }) {
    const ctx = this;
    if (p.name === 'port-from-cs') {
      this.portFromCs = p;
      this.portFromCs.onMessage.addListener((e: { type: string; data: any }) => {
        ctx.onPortMessage(e);
      });
    }
  }

  private sendPortMessage(nid, data) {
    this.portFromCs.postMessage({ nid, data });
  }

  private onPortMessage(e: { type: string; data: any }) {
    if (!this.portFromCs) return;
    if (e.type === 'social') {
      Api.getSoicalUrl(e.data.content).then(res => {
        this.sendPortMessage(e.data?.nid, res);
      });
    }
    if (e.type === 'like') {
      Api.like(e.data.content).then(res => {
        this.sendPortMessage(e.data?.nid, res);
      });
    }
    if (e.type === 'total') {
      Api.totalLikesRequest(e.data.content).then(res => {
        this.sendPortMessage(e.data?.nid, res);
      });
    }
  }
}

const bgMessageConnecter = new BgMessageConnecter();
