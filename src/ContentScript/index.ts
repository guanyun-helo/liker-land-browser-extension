import { browser } from 'webextension-polyfill-ts';
// import './LikeProxy';
import messageConnecter from './messageConnecter';

messageConnecter.init();

function injectInpage() {
  const inpage = document.createElement('script');
  inpage.src = browser.runtime.getURL('js/inpage.bundle.js');
  document.body.appendChild(inpage);
}
injectInpage();
