export interface Tag {
  id: string;
  name: string;
  count?: number;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string; // Markdown content
  thumbnail: string;
  author: string;
  publishedAt: string;
  tags: string[]; // Array of tag names or IDs
  status: 'draft' | 'published';
  views: number;
}

export interface Author {
  name: string;
  avatar: string;
  bio: string;
  skills: string[];
  socials: {
    facebook?: string;
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
}
