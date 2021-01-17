/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-shadow */
import axios, { AxiosResponse } from 'axios';
import { AxiosResponse, AxiosError } from 'axios'

const api = axios.create({
  baseURL: 'https://like.co',
  timeout: 10000,
  withCredentials: true,
});

const soicalApi = axios.create({
  baseURL: 'https://api.like.co',
  timeout: 10000,
  withCredentials: true,
});
interface LikeEntity {
  selfLikes: { count: number };
  totalLikes: { total: number };
  superLike: {};
}

const currentLiker: { likerID: string; postURL: string } = { likerID: 'likecoin', postURL: '' };

// api.interceptors.response.use(
//   response => {
//     return response;
//   },
//   error => {
//     return error;
//     // console.log('error', error);

//     // if (error.response.status === 401) {
//     //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     //   const register: any = {
//     //     from: currentLiker.likerID,
//     //     utm_source: 'button',
//     //     register: 1,
//     //     // eslint-disable-next-line @typescript-eslint/camelcase
//     //     is_popup: 1,
//     //     redirect: `https://button.like.co/in/like/${currentLiker.likerID}`,
//     //   };
//     //   const params = new URLSearchParams(register);
//     //   // place your reentry code
//     //   // window.open(`https://like.co/in/register?${params.toString()}`, '_blank');
//     // }
//     // return error;
//   }
// );

const Api = {
  selfLikesRequest: (content: { likerID: any; postURL: any }) => {
    return api.get(`/api/like/likebutton/${content.likerID}/self?referrer=${content.postURL}`).then(res => {
      return res.data;
    });
  },
  totalLikesRequest: (content: { likerID: any; postURL: any }) => {
    return api.get(`/api/like/likebutton/${content.likerID}/total?referrer=${content.postURL}`).then(res => {
      return res.data;
    });
  },
  superLikeRequest: (content: { postURL: any }) => {
    return api.get(`/api/like/share/self?referrer=${content.postURL}`).then(res => {
      return res.data;
    });
  },
  like: (content: { likerID: string; postURL: string }) => {
    return api
      .post(`https://like.co/api/like/likebutton/${content.likerID}/like?referrer=${content.postURL}&cookie_support=0`)
      .then(res => {
        if (res.data === 'OK') {
          return res.data;
        }
      })
      .catch((reason: AxiosError) => {
        return reason.response;
      });
  },
  getSoicalUrl: (content: { likerID: string }) => {
    return soicalApi.get(`social/list/${content.likerID}`).then(res => {
      return res;
    });
  },
};

export default Api;
