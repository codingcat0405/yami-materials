import {useEffect, useState} from "react";
import {ACCESS_TOKEN_KEY} from "../constants.ts";
import {useNavigate} from "react-router-dom";
import {Flex, Table, Input, Button, Space, Image, DatePicker} from "antd";
import AddMaterialModal from "../components/AddMaterialModal.tsx";
import {useQuery} from "@tanstack/react-query";
import yamiMaterials from "../apis/yami-materials.ts";
import dayjs from "dayjs";

const Material = () => {
  const [openAddMaterial, setOpenAddMaterial] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const isLoggedIn = !!localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, []);

  const {
    data: {data: materials = [], total = 0} = {},
    isLoading: isLoadMaterials,
  } = useQuery({
    queryKey: ['materials'],
    queryFn: async () => await yamiMaterials.listMaterials(),
  })
  console.log(materials, total);
  const [tableData, setTableData] = useState<any[]>([]);
  useEffect(() => {
    setTableData(materials.map((material: any) => {
      return {
        ...material,
        key: material.id,
      }
    }));
  }, [materials]);

  const handleCellChange = (value: any, key: string, dataIndex: string) => {
    const newData = [...tableData];
    const index = newData.findIndex((item: any) => item.key === key);
    const item = newData[index];
    newData.splice(index, 1, {...item, [dataIndex]: value});
    setTableData(newData);
  }

  const columns = [
    {
      title: 'Mã tem',
      dataIndex: 'stampCode',
      key: 'stampCode',
      width: 150,
      render: (stampCode: string, record: any) => {
        return <Input
          value={stampCode}
          className='no-border-input'
          onChange={(e) => {
            handleCellChange(e.target.value, record.key, 'stampCode')
          }}
        />
      }
    },
    {
      title: 'Mã vật tư',
      dataIndex: 'code',
      key: 'code',
      width: 150,
      render: (code: string, record: any) => {
        return <Input
          value={code}
          className='no-border-input'
          onChange={(e) => {
            handleCellChange(e.target.value, record.key, 'code')
          }}
        />
      }
    },
    {
      title: 'Tên vật tư',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: (name: string, record: any) => {
        return <Input
          value={name}
          className='no-border-input'
          onChange={(e) => {
            handleCellChange(e.target.value, record.key, 'name')
          }}
        />
      }
    },
    {
      title: 'Ngày nhập kho',
      dataIndex: 'entryDate',
      key: 'entryDate',
      width: 150,
      render: (entryDate: string, record: any) => {
        // const date = new Dayjs(entryDate);
        return <DatePicker
          value={dayjs(entryDate)}
          className='no-border-input'
          onChange={(e) => {
            handleCellChange(e.format('YYYY-MM-DD'), record.key, 'entryDate')
          }}
        />
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string, record: any) => {
        return <Input
          value={status}
          className='no-border-input'
          onChange={(e) => {
            handleCellChange(e.target.value, record.key, 'status')
          }}
        />
      }
    },
    {
      title: 'Danh điểm',
      dataIndex: 'creatorCode',
      key: 'creatorCode',
      width: 100,
      render: (creatorCode: string, record: any) => {
        return <Input
          value={creatorCode}
          className='no-border-input'
          onChange={(e) => {
            handleCellChange(e.target.value, record.key, 'creatorCode')
          }}
        />
      }
    },
    {
      title: 'Thiết bị',
      dataIndex: 'device',
      key: 'device',
      width: 100,
      render: (device: string, record: any) => {
        return <Input
          value={device}
          className='no-border-input'
          onChange={(e) => {
            handleCellChange(e.target.value, record.key, 'device')
          }}
        />
      }
    },
    {
      title: 'Đơn vị',
      dataIndex: 'unit',
      key: 'unit',
      width: 100,
      render: (unit: string, record: any) => {
        return <Input
          value={unit}
          className='no-border-input'
          onChange={(e) => {
            handleCellChange(e.target.value, record.key, 'unit')
          }}
        />
      }
    },
    {
      title: 'Ảnh vật  tư',
      dataIndex: 'images',
      key: 'images',
      render: (images: string) => {
        const imagesArr = images.split(',');
        return imagesArr.map((image, index) => {
          return <Image key={index} src={image} alt='ảnh vật tư' style={{width: 50, height: 50}}/>
        })
      }
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
        loading={isLoadMaterials}
        columns={columns}
        dataSource={tableData}
        scroll={{x: 'max-content', y: 600}}
        rowSelection={{
          onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          }
        }}
        pagination={false}
      />
      <Flex justify='end' style={{marginTop: 20}}>
        <Button type='primary' style={{marginRight: 10}}>Thêm dòng</Button>
      </Flex>
      <AddMaterialModal open={openAddMaterial} setOpen={setOpenAddMaterial} onFinish={() => {
      }}/>
    </div>
  )
}
export default Material;
