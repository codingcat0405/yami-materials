import {useState} from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import {Button, Layout, Menu, theme} from 'antd';
import {SiMaterialdesignicons} from "react-icons/si";
import {Outlet, useNavigate} from "react-router-dom";
import {AiOutlineCloudUpload} from "react-icons/ai";


const {Header, Sider, Content} = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: {colorBgContainer, borderRadiusLG},
  } = theme.useToken();
  const navigate = useNavigate();

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical"/>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          onClick={(e) => {
            if (e.key === '1') {
              navigate('/');
            }
            if (e.key === '2') {
              navigate('/upload');
            }
          }}
          items={[
            {
              key: '1',
              icon: <SiMaterialdesignicons/>,
              label: 'Vật tư',
            },
            {
              key: '2',
              icon: <AiOutlineCloudUpload/>,
              label: 'Upload data',
            }
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{padding: 0, background: colorBgContainer}}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: '90vh',
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet/>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
