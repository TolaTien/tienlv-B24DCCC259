import React, { useState, useEffect } from 'react';
import { Typography, Tag, Space, Button, Divider, Row, Col, Card, List, Breadcrumb, Skeleton } from 'antd';
import { ArrowLeftOutlined, ClockCircleOutlined, UserOutlined, EyeOutlined, TagOutlined } from '@ant-design/icons';
import { getPost, queryPosts } from '@/services/BlogService';
import { Post } from '@/types/blog';
import { useParams, useHistory, Link } from 'umi';
import moment from 'moment';

const { Title, Text, Paragraph } = Typography;

const PostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const history = useHistory();
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getPost(slug);
      if (res.success) {
        setPost(res.data);
        // Fetch related posts (same tags, exclude current)
        const relatedRes = await queryPosts({ tag: res.data.tags[0] });
        if (relatedRes.success) {
          setRelatedPosts(relatedRes.data.filter((p) => p.id !== res.data.id));
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
        <Skeleton active paragraph={{ rows: 20 }} />
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Title level={3}>Không tìm thấy bài viết</Title>
        <Button onClick={() => history.push('/blog/home')}>Quay lại trang chủ</Button>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      <Breadcrumb style={{ marginBottom: '16px' }}>
        <Breadcrumb.Item>
          <Link to="/blog/home">Blog</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{post.title}</Breadcrumb.Item>
      </Breadcrumb>

      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => history.push('/blog/home')}
        style={{ marginBottom: '24px' }}
      >
        Quay lại danh sách
      </Button>

      <article>
        <img
          src={post.thumbnail}
          alt={post.title}
          style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '8px', marginBottom: '24px' }}
        />

        <Title level={1}>{post.title}</Title>

        <Space split={<Divider type="vertical" />} style={{ marginBottom: '24px', color: '#8c8c8c' }}>
          <span><UserOutlined /> {post.author}</span>
          <span><ClockCircleOutlined /> {moment(post.publishedAt).format('DD/MM/YYYY')}</span>
          <span><EyeOutlined /> {post.views} lượt xem</span>
        </Space>

        <div style={{ marginBottom: '24px' }}>
          <Space wrap>
            <TagOutlined />
            {post.tags.map((tag) => (
              <Tag key={tag} color="blue">{tag}</Tag>
            ))}
          </Space>
        </div>

        <Divider />

        {/* Content Area - Render Markdown here */}
        <div className="blog-content" style={{ fontSize: '18px', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
          {post.content}
        </div>

        <Divider />

        <section style={{ marginTop: '48px' }}>
          <Title level={3}>Bài viết liên quan</Title>
          <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 2 }}
            dataSource={relatedPosts}
            renderItem={(item) => (
              <List.Item>
                <Card
                  hoverable
                  size="small"
                  cover={<img alt={item.title} src={item.thumbnail} style={{ height: '120px', objectFit: 'cover' }} />}
                  onClick={() => history.push(`/blog/post/${item.slug}`)}
                >
                  <Card.Meta title={item.title} description={moment(item.publishedAt).format('DD/MM/YYYY')} />
                </Card>
              </List.Item>
            )}
          />
        </section>
      </article>
    </div>
  );
};

export default PostDetail;
