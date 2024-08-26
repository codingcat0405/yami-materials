import {Button, Col, DatePicker, Flex, Form, Input, Modal, Row, Upload} from "antd";
import {imageToBase64, uuidv4} from "../utils.ts";
import toast from "react-hot-toast";
import {useEffect, useState} from "react";
import yamiMaterials from "../apis/yami-materials.ts";
import Dayjs from "dayjs";


const EditMaterialModal = ({open, setOpen, toEdit, onFinish}: any) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);

  useEffect(() => {
    if (!toEdit) return
    const images = toEdit.images.split(',').filter((x: any) => !!x);

    const fileList = images.map((image: string) => {
      return {
        name: 'image.png',
        status: 'done',
        thumbUrl: image,
        uid: uuidv4(),
      }
    });
    setFileList(fileList);
  }, [toEdit, open]);
  const handleCreateMaterial = async (values: any) => {
    try {
      setLoading(true);
      const uploadedUrls = [];
      let isFileUploaded = false;
      if (Array.isArray(values.images.fileList)) {
        isFileUploaded = true;
        for (const file of values.images.fileList) {
          if (file.thumbUrl.startsWith('https')) {
            //not base 64 =>  an  uploaded image  skip
            console.log('exist image', file.thumbUrl);
            uploadedUrls.push(file.thumbUrl);
            continue;
          }
          const originalFile = file.originFileObj;
          //rename file
          const fileExtension = originalFile.name.split('.').pop();
          const newFileName = `${values.code}-${Date.now()}.${fileExtension}`;
          const presignedUrlResp = await yamiMaterials.getPresignedUrl(newFileName);
          const resp = await fetch(presignedUrlResp.uploadUrl, {
            method: 'PUT',
            body: originalFile,
          });
          if (!resp.ok) {
            throw new Error('Upload ảnh thất bại');
          }
          uploadedUrls.push(presignedUrlResp.publicUrl);
        }
      }

      const data = {
        ...values,
        entryDate: values.entryDate.format('YYYY-MM-DD'),
        //when no images is uploaded, keep the old images
        images: isFileUploaded ? uploadedUrls.join(',') : values.images,
      };
      console.log(data);
      await yamiMaterials.updateMaterial(toEdit?.id, data);
      await onFinish()
      form.resetFields();
      toast.success('Sửa vật tư thành công');
      setOpen(false);
    } catch (err: any) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!toEdit) return;
    form.setFieldsValue({
      ...toEdit,
      entryDate: Dayjs(toEdit.entryDate),
    });
  }, [toEdit]);

  return (
    <Modal
      title='Sửa vật tư'
      open={open}
      width={800}
      onCancel={() => setOpen(false)}
      onOk={() => setOpen(false)}
      footer={[]}

    >
      <Form
        form={form}
        disabled={loading}
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
            onChange={(info: any) => {
              setFileList(info.fileList);
            }}
            fileList={fileList}
          >
            <Button>Click to Upload</Button>
          </Upload>
        </Form.Item>
        <Flex justify='end'>
          <Button type='primary' htmlType='submit' loading={loading}>Lưu</Button>
          <Button onClick={() => setOpen(false)} style={{marginLeft: 10}}>Hủy</Button>
        </Flex>
      </Form>
    </Modal>
  )
}
export default EditMaterialModal;
