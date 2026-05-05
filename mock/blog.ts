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
    views: 36,
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
    views: 0,
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
    views: 0,
  },
  {
    id: '4',
    title: 'CSS Grid vs Flexbox',
    slug: 'css-grid-vs-flexbox',
    summary: 'Khi nào nên sử dụng CSS Grid và khi nào nên sử dụng Flexbox trong thiết kế layout.',
    content: '# CSS Grid vs Flexbox\n\n...',
    thumbnail: 'https://img.freepik.com/free-vector/website-setup-concept-illustration_114360-4256.jpg',
    author: 'Admin',
    publishedAt: '2023-10-12',
    tags: ['CSS', 'Frontend'],
    status: 'published',
    views: 0,
  },
  {
    id: '5',
    title: 'Hiểu rõ về Docker',
    slug: 'hieu-ro-ve-docker',
    summary: 'Docker là gì? Tại sao các lập trình viên đều cần biết sử dụng Docker?',
    content: '# Hiểu rõ về Docker\n\n...',
    thumbnail: 'https://img.freepik.com/free-vector/cloud-hosting-concept-illustration_114360-4663.jpg',
    author: 'Admin',
    publishedAt: '2023-10-15',
    tags: ['Docker', 'DevOps'],
    status: 'published',
    views: 0,
  },
  {
    id: '6',
    title: 'Quản lý state với Redux Toolkit',
    slug: 'quan-ly-state-voi-redux-toolkit',
    summary: 'Hướng dẫn sử dụng Redux Toolkit để quản lý state hiệu quả trong ứng dụng React.',
    content: '# Quản lý state với Redux Toolkit\n\n...',
    thumbnail: 'https://img.freepik.com/free-vector/gradient-dynamic-blue-lines-background_23-2148995756.jpg',
    author: 'Admin',
    publishedAt: '2023-10-18',
    tags: ['React', 'Frontend'],
    status: 'published',
    views: 0,
  },
  {
    id: '7',
    title: 'Làm quen với GraphQL',
    slug: 'lam-quen-voi-graphql',
    summary: 'GraphQL là gì và tại sao nó lại dần thay thế REST API trong nhiều dự án.',
    content: '# Làm quen với GraphQL\n\n...',
    thumbnail: 'https://img.freepik.com/free-vector/global-data-security-personal-data-security-cyber-data-security-online-concept-illustration-internet-security-information-privacy-protection_1150-37336.jpg',
    author: 'Admin',
    publishedAt: '2023-10-20',
    tags: ['GraphQL', 'Backend'],
    status: 'published',
    views: 0,
  },
  {
    id: '8',
    title: 'Tối ưu hiệu suất ứng dụng Web',
    slug: 'toi-uu-hieu-suat-ung-dung-web',
    summary: 'Các kỹ thuật quan trọng để tăng tốc độ tải trang và cải thiện trải nghiệm người dùng.',
    content: '# Tối ưu hiệu suất ứng dụng Web\n\n...',
    thumbnail: 'https://img.freepik.com/free-vector/speed-test-concept-illustration_114360-2228.jpg',
    author: 'Admin',
    publishedAt: '2023-10-22',
    tags: ['Frontend', 'Performance'],
    status: 'published',
    views: 0,
  },
  {
    id: '9',
    title: 'Học Vue 3 trong 10 phút',
    slug: 'hoc-vue-3-trong-10-phut',
    summary: 'Nắm bắt các khái niệm cốt lõi của Vue 3 với Composition API.',
    content: '# Học Vue 3 trong 10 phút\n\n...',
    thumbnail: 'https://img.freepik.com/free-vector/programmers-using-javascript-programming-language-computer-tiny-people-javascript-language-javascript-engine-js-web-development-concept_335657-2412.jpg',
    author: 'Admin',
    publishedAt: '2023-10-25',
    tags: ['Vue', 'Frontend'],
    status: 'published',
    views: 0,
  },
  {
    id: '10',
    title: 'Giới thiệu về Next.js',
    slug: 'gioi-thieu-ve-nextjs',
    summary: 'Khám phá framework React mạnh mẽ cho phép SSR và SSG.',
    content: '# Giới thiệu về Next.js\n\n...',
    thumbnail: 'https://img.freepik.com/free-vector/gradient-abstract-wireframe-background_23-2148998822.jpg',
    author: 'Admin',
    publishedAt: '2023-10-28',
    tags: ['Next.js', 'React'],
    status: 'published',
    views: 0,
  },
  {
    id: '11',
    title: 'Bảo mật API cơ bản',
    slug: 'bao-mat-api-co-ban',
    summary: 'Những nguyên tắc cơ bản để bảo vệ API của bạn khỏi các cuộc tấn công.',
    content: '# Bảo mật API cơ bản\n\n...',
    thumbnail: 'https://img.freepik.com/free-vector/cyber-security-concept_23-2148533333.jpg',
    author: 'Admin',
    publishedAt: '2023-10-30',
    tags: ['Security', 'Backend'],
    status: 'published',
    views: 0,
  },
  {
    id: '12',
    title: 'Khởi đầu với Kubernetes',
    slug: 'khoi-dau-voi-kubernetes',
    summary: 'Hướng dẫn cơ bản về quản lý container với Kubernetes.',
    content: '# Khởi đầu với Kubernetes\n\n...',
    thumbnail: 'https://img.freepik.com/free-vector/server-room-concept-illustration_114360-1549.jpg',
    author: 'Admin',
    publishedAt: '2023-11-02',
    tags: ['Kubernetes', 'DevOps'],
    status: 'published',
    views: 0,
  }
];

let tags: Tag[] = [
  { id: '1', name: 'React', count: 3 },
  { id: '2', name: 'Frontend', count: 5 },
  { id: '3', name: 'TypeScript', count: 1 },
  { id: '4', name: 'JavaScript', count: 1 },
  { id: '5', name: 'Node.js', count: 1 },
  { id: '6', name: 'Backend', count: 3 },
  { id: '7', name: 'CSS', count: 1 },
  { id: '8', name: 'Docker', count: 1 },
  { id: '9', name: 'DevOps', count: 2 },
  { id: '10', name: 'GraphQL', count: 1 },
  { id: '11', name: 'Performance', count: 1 },
  { id: '12', name: 'Vue', count: 1 },
  { id: '13', name: 'Next.js', count: 1 },
  { id: '14', name: 'Security', count: 1 },
  { id: '15', name: 'Kubernetes', count: 1 },
];


const updateTagCounts = () => {
  
  tags.forEach(tag => tag.count = 0);
  

  posts.forEach(post => {
    if (post.tags && Array.isArray(post.tags)) {
      post.tags.forEach(tagName => {
        const tag = tags.find(t => t.name === tagName);
        if (tag) {
          tag.count = (tag.count || 0) + 1;
        } else {
          tags.push({ id: Date.now().toString() + Math.random().toString(), name: tagName, count: 1 });
        }
      });
    }
  });
};

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
    updateTagCounts();
    res.json({ data: newPost, success: true });
  },

  'PUT /api/blog/posts/:id': (req: Request, res: Response) => {
    const { id } = req.params;
    const index = posts.findIndex((p) => p.id === id);
    if (index !== -1) {
      posts[index] = { ...posts[index], ...req.body };
      updateTagCounts();
      res.json({ data: posts[index], success: true });
    } else {
      res.status(404).json({ success: false, message: 'Post not found' });
    }
  },

  'DELETE /api/blog/posts/:id': (req: Request, res: Response) => {
    const { id } = req.params;
    posts = posts.filter((p) => p.id !== id);
    updateTagCounts();
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
