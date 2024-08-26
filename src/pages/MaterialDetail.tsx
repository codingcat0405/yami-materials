import {Button, Col, Flex, Image, Row, Table} from "antd";
import EditMaterialModal from "../components/EditMaterialModal.tsx";
import {useEffect, useMemo, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import yamiMaterials from "../apis/yami-materials.ts";
import {useNavigate, useParams} from "react-router-dom";
import {ACCESS_TOKEN_KEY} from "../constants.ts";

const MaterialDetail = () => {
  const [openEditModal, setOpenEditModal] = useState(false);
  const {stampCode} = useParams();
  const navigate = useNavigate();

  const {
    data: material,
    refetch: refetchMaterial,
  } = useQuery({
    queryKey: ['material', stampCode],
    queryFn: ({queryKey}) => yamiMaterials.getMaterialByStampCode(queryKey[1]),
    enabled: !!stampCode,
  })
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    const isLoggedIn = !!localStorage.getItem(ACCESS_TOKEN_KEY);
    setIsLogin(isLoggedIn);
  }, []);
  const columns = [
    {
      key: 'key',
      dataIndex: 'key',
      title: '',
    },
    {
      key: 'value',
      dataIndex: 'value',
      title: '',
    },
  ];

  const data = useMemo(() => {
    return [
      {
        key: 'Mã tem',
        value: material?.stampCode,
      },
      {
        key: 'Mã vật tư',
        value: material?.code,
      },
      {
        key: 'Tên vật tư',
        value: material?.name,
      },
      {
        key: 'Ngày nhập kho',
        value: new Date(material?.entryDate).toLocaleDateString(),
      },
      {
        key: 'Trạng thái',
        value: material?.status,
      },
      {
        key: 'Danh điểm',
        value: material?.creatorCode,
      },
      {
        key: 'Thiết bị',
        value: material?.device,
      },
      {
        key: 'Đơn vị',
        value: material?.unit,
      }
    ]
  }, [material]);
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}>
      <div style={{
        border: '1px solid #111',
        padding: 10,
        width: "80%",
      }}>
        <h3 style={{textAlign: 'center'}}>Chi tiết vật tư</h3>
        <Row gutter={24}>
          <Col span={12}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 300,
            }}>
              {
                material?.images?.split(',').filter((x: any) => !!x).length > 0 ? (
                  <Image
                    height={300}
                    src={material?.images?.split(',').filter((x: any) => !!x)[0]} preview={false}/>
                ) : (
                  <div>
                    Không có ảnh
                  </div>
                )
              }
            </div>
          </Col>
          <Col span={12}>
            <Table
              columns={columns}
              dataSource={data}
              pagination={false}
              size='small'
            />
            <Flex justify='end' style={{marginTop: 20}}>
              {
                isLogin ? (
                  <>
                    <Button onClick={() => navigate('/')}>Danh sách</Button>
                    <Button style={{margin: '0 10px'}} onClick={() => setOpenEditModal(true)}>Sửa</Button>
                  </>
                ) : (
                  <Button onClick={() => navigate('/login')}>Đăng nhập</Button>
                )
              }
            </Flex>
          </Col>
        </Row>
      </div>

      <EditMaterialModal
        open={openEditModal}
        setOpen={setOpenEditModal}
        onFinish={refetchMaterial}
        toEdit={material}
      />
    </div>
  )
}
export default MaterialDetail;
