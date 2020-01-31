import * as api from '../utils/api/likerland';

const bookmarks = new Set();

export async function addBookMark(url: string) {
  await api.addBookmark(url);
  bookmarks.add(encodeURIComponent(url));
}

export async function removeBookMark(url: string) {
  await api.removeBookmark(url);
  bookmarks.delete(encodeURIComponent(url));
}

export function isBookMarked(url: string): boolean {
  return bookmarks.has(encodeURIComponent(url));
}
