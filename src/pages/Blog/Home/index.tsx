import React, { useState, useEffect, useCallback } from 'react';
import { Card, List, Input, Tag, Row, Col, Typography, Space, Pagination } from 'antd';
import { SearchOutlined, ClockCircleOutlined, UserOutlined, EyeOutlined } from '@ant-design/icons';
import { queryPosts, queryTags } from '@/services/BlogService';
import { Post, Tag as TagType } from '@/types/blog';
import { useHistory } from 'umi';
import debounce from 'lodash/debounce';
import moment from 'moment';

const { Title, Text, Paragraph } = Typography;

const BlogHome: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [tags, setTags] = useState<TagType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [current, setCurrent] = useState<number>(1);
  const [searchText, setSearchText] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);

  const history = useHistory();

  const fetchPosts = async (params: any) => {
    setLoading(true);
    try {
      const res = await queryPosts({ ...params, pageSize: 9 });
      if (res.success) {
        setPosts(res.data);
        setTotal(res.total);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    const res = await queryTags();
    if (res.success) {
      setTags(res.data);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    fetchPosts({ current, title: searchText, tag: selectedTag });
  }, [current, searchText, selectedTag]);

  const handleSearch = useCallback(
    debounce((value: string) => {
      setSearchText(value);
      setCurrent(1);
    }, 300),
    [],
  );

  const handleTagClick = (tag: string) => {
    const newTag = selectedTag === tag ? undefined : tag;
    setSelectedTag(newTag);
    setCurrent(1);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <Title level={1}>My Personal Blog</Title>
        <Text type="secondary">Chia sẻ kiến thức và kinh nghiệm lập trình</Text>
      </div>

      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} md={12}>
          <Input
            placeholder="Tìm kiếm bài viết..."
            prefix={<SearchOutlined />}
            size="large"
            onChange={(e) => handleSearch(e.target.value)}
            allowClear
          />
        </Col>
        <Col xs={24} md={12}>
          <Space wrap>
            <Text strong>Tags:</Text>
            {tags.map((tag) => (
              <Tag.CheckableTag
                key={tag.id}
                checked={selectedTag === tag.name}
                onChange={() => handleTagClick(tag.name)}
                style={{ fontSize: '14px', padding: '4px 12px' }}
              >
                {tag.name} ({tag.count ?? 0})
              </Tag.CheckableTag>
            ))}
          </Space>
        </Col>
      </Row>

      <List
        grid={{ gutter: 24, xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3 }}
        dataSource={posts}
        loading={loading}
        renderItem={(post) => (
          <List.Item>
            <Card
              hoverable
              cover={
                <img
                  alt={post.title}
                  src={post.thumbnail}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              }
              onClick={() => history.push(`/blog/post/${post.slug}`)}
            >
              <Card.Meta
                title={<Title level={4} ellipsis={{ rows: 2 }}>{post.title}</Title>}
                description={
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#8c8c8c' }}>
                      <span><UserOutlined /> {post.author}</span>
                      <span><ClockCircleOutlined /> {moment(post.publishedAt).format('DD/MM/YYYY')}</span>
                    </div>
                    <Paragraph ellipsis={{ rows: 3 }} type="secondary">
                      {post.summary}
                    </Paragraph>
                    <Space wrap>
                      {post.tags.map((tag) => (
                        <Tag key={tag} color="blue">{tag}</Tag>
                      ))}
                    </Space>
                    <div style={{ textAlign: 'right', fontSize: '12px', color: '#8c8c8c' }}>
                      <EyeOutlined /> {post.views} lượt xem
                    </div>
                  </Space>
                }
              />
            </Card>
          </List.Item>
        )}
      />

      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <Pagination
          current={current}
          total={total}
          pageSize={9}
          onChange={(page) => setCurrent(page)}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default BlogHome;
