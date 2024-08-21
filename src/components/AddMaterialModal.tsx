import {Button, Col, DatePicker, Form, Input, Modal, Row, Upload} from "antd";
import {imageToBase64} from "../utils.ts";
import toast from "react-hot-toast";
import {useState} from "react";

const AddMaterialModal = ({open, setOpen, onFinish}) => {
  const [loading, setLoading] = useState(false);

  const handleCreateMaterial = async (values) => {
    console.log(values);
    try  {
      if(values.files)  {
        throw new Error('Chưa chọn ảnh vật tư');
      }
      setLoading(true);
    }catch (err: any) {
      console.log(err);
      toast.error(err.message);
    }
  };

  return (
    <Modal
      title='Thêm vật tư'
      open={open}
      width={800}
      onCancel={() => setOpen(false)}
      onOk={() => setOpen(false)}
    >
      <Form
        name="createMaterial"
        layout='vertical'
        onFinish={handleCreateMaterial}
        onFinishFailed={() => {
          toast.error('Thêm vật tư thất bại');
        }}
        autoComplete="off"
      >

        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              label="Tên vật tư"
              name="name"
              rules={[{required: true, message: 'Nhập tên vật tư!'}]}
            >
              <Input/>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Mã vật tư"
              name="code"
              rules={[{required: true, message: 'Nhập mã vật  tư!'}]}
            >
              <Input/>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Mã tem"
              name="stampCode"
              rules={[{required: true, message: 'Nhập mã vật  tư!'}]}
            >
              <Input/>
            </Form.Item>
          </Col>


          <Col span={8}>
            <Form.Item
              label="Ngày nhập kho"
              name="entryDate"
              rules={[{required: true, message: 'Chọn ngày nhập kho!'}]}
            >
              <DatePicker style={{width: '100%'}}/>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Trạng thái"
              name="status"
              rules={[{required: true, message: 'Nhập trạng thái!'}]}
            >
              <Input/>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Danh điểm(số chế tạo)"
              name="creatorCode"
              rules={[{required: true, message: 'Nhập danh điểm!'}]}
            >
              <Input/>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Đơn vị"
              name="unit"
              rules={[{required: true, message: 'Nhập đơn vị'}]}
            >
              <Input/>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Thiết bị"
              name="device"
              rules={[{required: true, message: 'Nhập thiết bị!'}]}
            >
              <Input/>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          label="Ảnh vật tư"
          name="images"
          rules={[{required: true, message: 'Chọn ảnh vật tư!'}]}
        >
          <Upload
            listType={'picture'}
            name='images'
            customRequest={async ({file, onSuccess, onError}: any) => {
              // Your custom request logic
              const base64 = await imageToBase64(file);
              if (!base64) {
                onError('Error');
                return;
              }
              onSuccess(base64);

            }}
          >
            <Button>Click to Upload</Button>
          </Upload>
        </Form.Item>
        <div>
          <Button type='primary' htmlType='submit'>Thêm</Button>
        </div>
      </Form>


    </Modal>
  )
}
export default AddMaterialModal;
