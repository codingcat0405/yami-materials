import {useEffect, useState} from "react";
import {ACCESS_TOKEN_KEY} from "../constants.ts";
import {useNavigate} from "react-router-dom";
import {Flex, Table, Input, Button, Space, Image, DatePicker, QRCode} from "antd";
import yamiMaterials from "../apis/yami-materials.ts";
import dayjs from "dayjs";
import EditMaterialModal from "../components/EditMaterialModal.tsx";
import toast from "react-hot-toast";
import QrModal from "../components/QrModal.tsx";

const Material = () => {
  const [loading, setLoading] = useState(false);
  const [listDelete, setListDelete] = useState<number[]>([]);
  const [openEditImageModal, setOpenEditImageModal] = useState(false);
  const [toEditMaterial, setToEditMaterial] = useState<any>(null);
  const [openQrModal, setOpenQrModal] = useState(false);
  const [qrValue, setQrValue] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const isLoggedIn = !!localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, []);
  const [total, setTotal] = useState(0);
  console.log('total', total);
  const [tableData, setTableData] = useState<any[]>([]);
  const [isLoadMaterials, setIsLoadMaterials] = useState(false);
  const fetchMaterials = async () => {
    try {
      setIsLoadMaterials(true);
      const resp = await yamiMaterials.listMaterials();
      console.log(resp);
      setTableData(resp.data.map((material: any) => {
        return {
          ...material,
          key: material.id,
        }
      }))
      setTotal(resp.total);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoadMaterials(false);
    }
  }

  useEffect(() => {
    fetchMaterials()
  }, []);

  const handleCellChange = (value: any, key: string, dataIndex: string) => {
    const newData = [...tableData];
    const index = newData.findIndex((item: any) => item.key === key);
    const item = newData[index];
    newData.splice(index, 1, {...item, [dataIndex]: value});
    setTableData(newData);
  }

  const handleSaveMaterials = async () => {
    try {
      setLoading(true);
      const listCreate = []
      const listUpdate = []
      for (const item of tableData) {
        console.log(item);
        if (item.key.toString().includes('new')) {
          listCreate.push(item);
        } else {
          listUpdate.push(item);
        }
      }
      //normalize data  //remove key field  and format date
      const listCreateNormalized = listCreate.map((item: any) => {
        const {key, ...rest} = item;
        console.log({key, rest});
        return {
          ...rest,
          entryDate: dayjs(rest.entryDate).format('YYYY-MM-DD'),
        }
      });
      const listUpdateNormalized = listUpdate.map((item: any) => {
        const {key, createdAt, updatedAt, deletedAt, ...rest} = item;
        console.log({key, createdAt, updatedAt, deletedAt, rest});
        return {
          ...rest,
          entryDate: dayjs(rest.entryDate).format('YYYY-MM-DD'),
        }
      });

      await yamiMaterials.bulkCUD({
        listCreate: listCreateNormalized,
        listUpdate: listUpdateNormalized,
        listDelete,
      })
      await fetchMaterials();
      toast.success('Lưu thành công');
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }
  const columns = [
    {
      title: 'QR',
      dataIndex: 'stampCode',
      width: 150,
      render: (stampCode: string) => {
        return (
          <div style={{cursor: 'pointer'}} onClick={() => {
            setQrValue(`https://yami-materials.pages.dev/material/${stampCode}`);
            setOpenQrModal(true);
          }}>
            <QRCode
              value={`https://yami-materials.pages.dev/material/${stampCode}`}
              size={80}
            />
          </div>
        )
      }
    },
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
      render: (images: string, record: any) => {
        const imagesArr = images.split(',').filter(x => !!x);
        return (
          <Space>
            {
              imagesArr.map((image: string, index: number) => {
                return (
                  <Image
                    key={index}
                    width={50}
                    height={50}
                    src={image}
                  />
                )
              })
            }
            <Button size='small' onClick={() => {
              setToEditMaterial(record)
              setOpenEditImageModal(true);
            }}>
              {imagesArr.length > 0 ? 'Sửa' : 'Thêm'}
            </Button>
          </Space>
        )
      }
    },
    {
      title: 'Hành động',
      dataIndex: '_',
      key: '_',
      render: (_: any, record: any) => (
        <Space>
          <Button type='primary' danger onClick={() => {
            if (!isNaN(Number(record.key))) {
              setListDelete([...listDelete, Number(record.key)]);
            }
            const newData = tableData.filter((item: any) => item.key !== record.key);
            setTableData(newData);
          }}>Xóa</Button>
        </Space>
      )
    }
  ];
  return (
    <div>
      <Flex justify='space-between' style={{marginBottom: 20}}>
        <Input.Search placeholder='tìm vật tư' style={{width: 250}}/>
      </Flex>
      <Table
        loading={isLoadMaterials || loading}
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
        <Button
          type='primary'
          style={{marginRight: 10}}
          onClick={() => {
            setTableData([...tableData, {
              key: `new-${tableData.length}`,
              stampCode: '',
              code: '',
              name: '',
              entryDate: new Date().toDateString(),
              status: '',
              creatorCode: '',
              device: '',
              unit: '',
              images: '',
            }])
          }}
        >
          Thêm dòng
        </Button>

        <Button
          type='primary'
          style={{marginRight: 10}}
          onClick={handleSaveMaterials}
          loading={loading}
        >
          Lưu thay đổi
        </Button>
      </Flex>

      <EditMaterialModal
        open={openEditImageModal}
        setOpen={setOpenEditImageModal}
        material={toEditMaterial}
        setTableData={setTableData}
        tableData={tableData}
      />
      <QrModal
        open={openQrModal}
        setOpen={setOpenQrModal}
        value={qrValue}
      />
    </div>
  )
}
export default Material;
