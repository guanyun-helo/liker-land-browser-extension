/* eslint-disable no-plusplus */
import { debounce } from 'lodash';
import LikeClap from '../../assets/likecoin-button/like-clap.svg';
import eventCenter from '../Message';

class _Twitter {
  private buttonTemplate: Element | null = null;

  private knownAccounts: Map<string, boolean> = new Map();

  public inject() {
    // eslint-disable-next-line no-restricted-globals
    if (!location.origin.match(/https:\/\/(mobile\.)?twitter\.com/)) return;
    this.onPageLoaded();
  }

  private onPageLoaded() {
    if (!document.querySelector('main')) {
      setTimeout(() => {
        this.onPageLoaded();
      }, 500);
    } else {
      const pageUpdate = debounce(this.onPageUpdate.bind(this), 400);
      const mutationObserver = new MutationObserver(pageUpdate);
      mutationObserver.observe(document.querySelector('main') as Element, { childList: true, subtree: true });
    }
  }

  private onPageUpdate() {
    const tweets = document.querySelectorAll('[data-testid="tweet"]');
    tweets.forEach(element => {
      if (element.attributes['data-likecoin']) return;
      const originLike = element.querySelector('[role="group"]');
      if (!originLike) return;
      this.getLinks(element).then(postMeta => {
        if (!postMeta) {
          element.setAttribute('data-likecoin', 'skip');
          return;
        }
        // if (originLike)
        this.createLikeCoinButton(postMeta!.likerID, postMeta!.postURL)
          .then(cloneLike => {
            originLike.appendChild(cloneLike);
            element.setAttribute('data-likecoin', 'true');
          })
          .catch(_ => {
            console.debug(`[LikerLand] Create LikeCoin Button for ${postMeta!.postURL} failed, will retry later.`);
          });
      });
    });
  }

  private getLinks(element: Element): Promise<{ likerID: string; postURL: string } | null> {
    return new Promise((resolve, reject) => {
      // Links should be [ AvatarLink, UsernameLink, TimestampLink]
      const links = element.querySelectorAll('a');
      const inferUsername = links[0].href.replace('https://twitter.com/', '');
      const inferPostURL = links[2].href;

      if (!this.knownAccounts.has(inferUsername)) {
        eventCenter.sendMessage('social', { likerID: inferUsername }, data => {
          const metaData = data.data.data;
          if (metaData.twitter && metaData.twitter.displayName) {
            resolve({ likerID: metaData.twitter.displayName, postURL: inferPostURL });
          }
        });
      }
    });
  }

  private async createLikeCoinButton(likerID: string, postURL: string): Promise<Element> {
    if (!this.buttonTemplate) this.initTemplate();
    const cloneLike = this.buttonTemplate!.cloneNode(true) as Element;
    const cloneLikeSVG = cloneLike.querySelector('.likecoin-svg')! as HTMLElement;
    const cloneLikeCount = cloneLike.querySelector('.likecoin-count')! as HTMLElement;
    let likeLimit = 5;

    cloneLike.addEventListener('mouseenter', () => {
      (cloneLikeSVG.previousElementSibling! as HTMLElement).style.background = '#aaf1e7';
    });
    cloneLike.addEventListener('mouseleave', () => {
      (cloneLikeSVG.previousElementSibling! as HTMLElement).style.background = '';
    });
    cloneLike.addEventListener('click', () => {
      if (likeLimit <= 0) return;
      likeLimit--;
      cloneLikeSVG.style.color = 'rgb(40, 100, 110)';
      cloneLikeCount.innerHTML = ((parseInt(cloneLikeCount.innerHTML.replace(/,/g, '')) || 0) + 1).toLocaleString();
      eventCenter.sendMessage('like', { likerID, postURL }, data => {
        if (data.data !== 'OK') {
          cloneLikeCount.innerHTML = (Number(cloneLikeCount.innerHTML.toLocaleString()) - 1).toLocaleString();
        }
      });
    });
    eventCenter.sendMessage('total', { likerID, postURL }, totalData => {
      likeLimit = 5 - totalData.data.total;
      if (totalData.data.total > 0) cloneLikeCount.innerHTML = totalData.data.total.toLocaleString();
    });

    return cloneLike;
  }

  private initTemplate() {
    const originLike = document.querySelector('[data-testid="tweet"] [data-testid="like"]')!.parentElement!;
    const cloneLike = originLike.cloneNode(true) as Element;

    const cloneLikeSVG = cloneLike.querySelector('svg')!;
    const likeClapSVG = new DOMParser().parseFromString(LikeClap, 'text/html').body.firstChild as HTMLElement;
    cloneLike.setAttribute('data-testid', 'likecoin-like');
    cloneLikeSVG.setAttribute('viewBox', likeClapSVG.getAttribute('viewBox')!);
    cloneLikeSVG.innerHTML = likeClapSVG.innerHTML;
    cloneLikeSVG.classList.add('likecoin-svg');

    const cloneLikeCount = cloneLike.querySelector('span > span')!;
    cloneLikeCount.innerHTML = '';
    cloneLikeCount.classList.add('likecoin-count');

    this.buttonTemplate = cloneLike;
  }
}

const Twitter = new _Twitter();
export default Twitter;
