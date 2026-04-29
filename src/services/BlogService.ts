import { request } from 'umi';
import { Post, Tag } from '../types/blog';

export async function queryPosts(params?: any) {
  return request<{
    data: Post[];
    total: number;
    success: boolean;
  }>('/api/blog/posts', {
    method: 'GET',
    params,
  });
}

export async function getPost(slug: string) {
  return request<{
    data: Post;
    success: boolean;
  }>(`/api/blog/posts/${slug}`, {
    method: 'GET',
  });
}

export async function addPost(data: Partial<Post>) {
  return request<{
    data: Post;
    success: boolean;
  }>('/api/blog/posts', {
    method: 'POST',
    data,
  });
}

export async function updatePost(id: string, data: Partial<Post>) {
  return request<{
    data: Post;
    success: boolean;
  }>(`/api/blog/posts/${id}`, {
    method: 'PUT',
    data,
  });
}

export async function removePost(id: string) {
  return request<{
    success: boolean;
  }>(`/api/blog/posts/${id}`, {
    method: 'DELETE',
  });
}

export async function queryTags() {
  return request<{
    data: Tag[];
    success: boolean;
  }>('/api/blog/tags', {
    method: 'GET',
  });
}

export async function addTag(data: Partial<Tag>) {
  return request<{
    data: Tag;
    success: boolean;
  }>('/api/blog/tags', {
    method: 'POST',
    data,
  });
}

export async function updateTag(id: string, data: Partial<Tag>) {
  return request<{
    data: Tag;
    success: boolean;
  }>(`/api/blog/tags/${id}`, {
    method: 'PUT',
    data,
  });
}

export async function removeTag(id: string) {
  return request<{
    success: boolean;
  }>(`/api/blog/tags/${id}`, {
    method: 'DELETE',
  });
}
