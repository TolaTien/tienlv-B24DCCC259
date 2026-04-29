import { Request, Response } from 'express';
import { Post, Tag } from '../src/types/blog';

let posts: Post[] = [
  {
    id: '1',
    title: 'Giới thiệu về React 18',
    slug: 'gioi-thieu-ve-react-18',
    summary: 'Tìm hiểu các tính năng mới trong React 18 như Concurrent Mode, Automatic Batching và Suspense.',
    content: '# Giới thiệu về React 18\n\nReact 18 là một bản cập nhật lớn...\n\n## Tính năng nổi bật\n- **Concurrent Rendering**\n- **Automatic Batching**\n- **Transitions**',
    thumbnail: 'https://img.freepik.com/free-photo/programming-background-with-person-working-with-codes-on-computer_23-2150010125.jpg',
    author: 'Admin',
    publishedAt: '2023-10-01',
    tags: ['React', 'Frontend'],
    status: 'published',
    views: 120,
  },
  {
    id: '2',
    title: 'Mastering TypeScript',
    slug: 'mastering-typescript',
    summary: 'Hướng dẫn chi tiết từ cơ bản đến nâng cao về TypeScript cho lập trình viên JavaScript.',
    content: '# Mastering TypeScript\n\nTypeScript mang lại sự an toàn về kiểu dữ liệu...\n\n```typescript\ninterface User {\n  name: string;\n  age: number;\n}\n```',
    thumbnail: 'https://img.freepik.com/free-vector/gradient-ui-ux-elements-background_23-2149056159.jpg',
    author: 'Admin',
    publishedAt: '2023-10-05',
    tags: ['TypeScript', 'JavaScript'],
    status: 'published',
    views: 85,
  },
  {
    id: '3',
    title: 'Xây dựng API với Node.js và Express',
    slug: 'xay-dung-api-voi-nodejs-express',
    summary: 'Cách tạo ra một hệ thống RESTful API mạnh mẽ và bảo mật sử dụng Node.js.',
    content: '# Xây dựng API với Node.js\n\nNode.js là môi trường thực thi tuyệt vời cho backend...',
    thumbnail: 'https://img.freepik.com/free-photo/standard-quality-control-concept-m_23-2150041848.jpg',
    author: 'Admin',
    publishedAt: '2023-10-10',
    tags: ['Node.js', 'Backend'],
    status: 'published',
    views: 200,
  },
];

let tags: Tag[] = [
  { id: '1', name: 'React', count: 1 },
  { id: '2', name: 'Frontend', count: 1 },
  { id: '3', name: 'TypeScript', count: 1 },
  { id: '4', name: 'JavaScript', count: 1 },
  { id: '5', name: 'Node.js', count: 1 },
  { id: '6', name: 'Backend', count: 1 },
];

export default {
  'GET /api/blog/posts': (req: Request, res: Response) => {
    const { title, tag, status, current = 1, pageSize = 9 } = req.query;
    let filteredPosts = [...posts];

    if (title) {
      filteredPosts = filteredPosts.filter((p) => p.title.toLowerCase().includes((title as string).toLowerCase()));
    }
    if (tag) {
      filteredPosts = filteredPosts.filter((p) => p.tags.includes(tag as string));
    }
    if (status) {
      filteredPosts = filteredPosts.filter((p) => p.status === status);
    }

    const start = (Number(current) - 1) * Number(pageSize);
    const end = start + Number(pageSize);
    const list = filteredPosts.slice(start, end);

    res.json({
      data: list,
      total: filteredPosts.length,
      success: true,
    });
  },

  'GET /api/blog/posts/:slug': (req: Request, res: Response) => {
    const { slug } = req.params;
    const post = posts.find((p) => p.slug === slug);
    if (post) {
      post.views += 1;
      res.json({ data: post, success: true });
    } else {
      res.status(404).json({ success: false, message: 'Post not found' });
    }
  },

  'POST /api/blog/posts': (req: Request, res: Response) => {
    const newPost = { ...req.body, id: Date.now().toString(), views: 0 };
    posts.unshift(newPost);
    res.json({ data: newPost, success: true });
  },

  'PUT /api/blog/posts/:id': (req: Request, res: Response) => {
    const { id } = req.params;
    const index = posts.findIndex((p) => p.id === id);
    if (index !== -1) {
      posts[index] = { ...posts[index], ...req.body };
      res.json({ data: posts[index], success: true });
    } else {
      res.status(404).json({ success: false, message: 'Post not found' });
    }
  },

  'DELETE /api/blog/posts/:id': (req: Request, res: Response) => {
    const { id } = req.params;
    posts = posts.filter((p) => p.id !== id);
    res.json({ success: true });
  },

  'GET /api/blog/tags': (req: Request, res: Response) => {
    res.json({ data: tags, success: true });
  },

  'POST /api/blog/tags': (req: Request, res: Response) => {
    const newTag = { ...req.body, id: Date.now().toString(), count: 0 };
    tags.push(newTag);
    res.json({ data: newTag, success: true });
  },

  'PUT /api/blog/tags/:id': (req: Request, res: Response) => {
    const { id } = req.params;
    const index = tags.findIndex((t) => t.id === id);
    if (index !== -1) {
      tags[index] = { ...tags[index], ...req.body };
      res.json({ data: tags[index], success: true });
    } else {
      res.status(404).json({ success: false, message: 'Tag not found' });
    }
  },

  'DELETE /api/blog/tags/:id': (req: Request, res: Response) => {
    const { id } = req.params;
    tags = tags.filter((t) => t.id !== id);
    res.json({ success: true });
  },
};
