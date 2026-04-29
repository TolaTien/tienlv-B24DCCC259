import React from 'react';
import { Card, Avatar, Typography, Space, Divider, Tag, Row, Col, Button } from 'antd';
import { GithubOutlined, FacebookOutlined, TwitterOutlined, LinkedinOutlined, MailOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const authorData = {
  name: 'Nguyễn Văn A',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  bio: 'Chào mừng bạn đến với blog của mình! Mình là một Fullstack Developer với niềm đam mê mãnh liệt về Web Development và Open Source. Tại đây, mình chia sẻ những kiến thức, kinh nghiệm và những điều thú vị mà mình học được trong quá trình làm việc.',
  skills: ['React', 'TypeScript', 'Node.js', 'Go', 'Docker', 'Kubernetes', 'AWS'],
  socials: {
    github: 'https://github.com',
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
  },
  email: 'admin@example.com',
};

const AboutPage: React.FC = () => {
  return (
    <div style={{ padding: '48px 24px', maxWidth: '800px', margin: '0 auto' }}>
      <Card bordered={false} style={{ textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Avatar size={160} src={authorData.avatar} style={{ marginBottom: '24px' }} />
        <Title level={1}>{authorData.name}</Title>
        <Text type="secondary" style={{ fontSize: '18px' }}>Fullstack Developer & Tech Enthusiast</Text>
        
        <Divider />
        
        <div style={{ textAlign: 'left' }}>
          <Title level={3}>Giới thiệu</Title>
          <Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
            {authorData.bio}
          </Paragraph>
          
          <Title level={3} style={{ marginTop: '32px' }}>Kỹ năng</Title>
          <Space wrap size={[8, 16]}>
            {authorData.skills.map(skill => (
              <Tag key={skill} color="blue" style={{ padding: '4px 12px', fontSize: '14px' }}>
                {skill}
              </Tag>
            ))}
          </Space>
          
          <Title level={3} style={{ marginTop: '32px' }}>Liên kết</Title>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Button type="link" icon={<GithubOutlined />} href={authorData.socials.github} target="_blank" size="large">
                GitHub
              </Button>
            </Col>
            <Col span={12}>
              <Button type="link" icon={<LinkedinOutlined />} href={authorData.socials.linkedin} target="_blank" size="large">
                LinkedIn
              </Button>
            </Col>
            <Col span={12}>
              <Button type="link" icon={<FacebookOutlined />} href={authorData.socials.facebook} target="_blank" size="large">
                Facebook
              </Button>
            </Col>
            <Col span={12}>
              <Button type="link" icon={<MailOutlined />} href={`mailto:${authorData.email}`} size="large">
                Email
              </Button>
            </Col>
          </Row>
        </div>
      </Card>
    </div>
  );
};

export default AboutPage;
