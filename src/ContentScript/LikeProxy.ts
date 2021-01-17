import axios, { AxiosResponse } from 'axios';
import { onReceive, send, connentToBgScript } from './Message';

// const api = axios.create({
//   baseURL: 'https://like.co',
//   timeout: 10000,
//   withCredentials: true,
// });
// interface LikeEntity {
//   selfLikes: { count: number };
//   totalLikes: { total: number };
//   superLike: {};
// }

// let currentLiker: { likerID: string; postURL: string } = { likerID: 'likecoin', postURL: '' };

// api.interceptors.response.use(
//   response => {
//     return response;
//   },
//   error => {
//     console.log('error', error);

//     if (error.response.status === 401) {
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       const register: any = {
//         from: currentLiker.likerID,
//         utm_source: 'button',
//         register: 1,
//         // eslint-disable-next-line @typescript-eslint/camelcase
//         is_popup: 1,
//         redirect: `https://button.like.co/in/like/${currentLiker.likerID}`,
//       };
//       const params = new URLSearchParams(register);
//       // place your reentry code
//       //window.open(`https://like.co/in/register?${params.toString()}`, '_blank');
//     }
//     return error;
//   }
// );

// onReceive('query', async (content: { likerID: string; postURL: string }) => {
//   currentLiker = content;

//   const selfLikesRequest: Promise<AxiosResponse<LikeEntity>> = api
//     .get(`/api/like/likebutton/${content.likerID}/self?referrer=${content.postURL}`)
//     .then(res => {
//       return res.data;
//     });
//   const totalLikesRequest: Promise<AxiosResponse<LikeEntity>> = api
//     .get(`/api/like/likebutton/${content.likerID}/total?referrer=${content.postURL}`)
//     .then(res => {
//       return res.data;
//     });
//   const superLikeRequest: Promise<AxiosResponse<LikeEntity>> = api
//     .get(`https://like.co/api/like/share/self?referrer=${content.postURL}`)
//     .then(res => {
//       return res.data;
//     });

//   Promise.all([selfLikesRequest, totalLikesRequest, superLikeRequest])
//     .then(res => {
//       console.log(res);
//       const { selfLikes, totalLikes } = res[1].data;
//       send(`query:${content.postURL}`, {
//         postURL: content.postURL,
//         selfLikes: selfLikes.count,
//         totalLikes: totalLikes.total,
//       });
//     })
//     .catch(error => {
//       console.error(error);
//     });
// });

// onReceive('social', async (content: { likerID: string }) => {
//   fetch(`https://api.like.co/social/list/${content.likerID}`)
//     .then(res => {
//       return res.json();
//     })
//     .then(data => {
//       send(`social:${content.likerID}`, data);
//     });
// });

// onReceive('like', (content: { likerID: string; postURL: string }) => {
//   fetch(`https://like.co/api/like/likebutton/${content.likerID}/like?referrer=${content.postURL}&cookie_support=0`, {
//     method: 'POST',
//   })
//     .then(res => {
//       return res.text();
//     })
//     .then(data => {
//       if (data === 'OK') send(`like:${content.postURL}`, { success: true });
//     });
// });
