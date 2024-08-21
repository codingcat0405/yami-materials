import {useEffect, useState} from "react";
import {ACCESS_TOKEN_KEY} from "../constants.ts";
import {useNavigate} from "react-router-dom";
import {Flex, Table, Input, Button, Space} from "antd";
import AddMaterialModal from "../components/AddMaterialModal.tsx";

const Material = () => {
  const [openAddMaterial, setOpenAddMaterial] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const isLoggedIn = !!localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, []);

  const columns = [
    {
      title: 'Mã tem',
      dataIndex: 'stampCode',
      key: 'stampCode',
    },
    {
      title: 'Mã vật tư',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Tên vật tư',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Ngày nhập kho',
      dataIndex: 'entryDate',
      key: 'entryDate',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Danh điểm',
      dataIndex: 'creatorCode',
      key: 'creatorCode',
    },
    {
      title: 'Thiết bị',
      dataIndex: 'device',
      key: 'device',
    },
    {
      title: 'Đơn vị',
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      title: 'Ảnh vật  tư',
      dataIndex: 'images',
      key: 'images',
    },
    {
      title: 'Hành động',
      dataIndex: '_',
      key: '_',
      render: () => (
        <Space>
          <Button type='primary'>QR</Button>
          <Button type='primary' danger>Xóa</Button>
        </Space>
      )
    }
  ];
  return (
    <div>
      <Flex justify='space-between' style={{marginBottom: 20}}>

        <Input.Search placeholder='tìm vật tư' style={{width: 250}}/>
        <Flex>
          <Button
            type='primary'
            style={{marginRight: 10}}
            onClick={() => setOpenAddMaterial(true)}
          >
            Thêm vật tư</Button>
        </Flex>
      </Flex>
      <Table
        columns={columns}
        dataSource={[]}
        scroll={{x: 'max-content', y: 600}}
        rowSelection={{
          onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          }
        }}
      />
      <Flex justify='end' style={{marginTop: 20}}>
        <Button type='primary' style={{marginRight: 10}}>Lưu thay đổi</Button>
      </Flex>
      <AddMaterialModal open={openAddMaterial} setOpen={setOpenAddMaterial}/>
    </div>
  )
}
export default Material;
