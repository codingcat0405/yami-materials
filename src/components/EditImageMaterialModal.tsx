import {Button, Flex, Modal, Upload} from "antd";
import {imageToBase64, uuidv4} from "../utils.ts";
import {useEffect, useState} from "react";
import toast from "react-hot-toast";
import yamiMaterials from "../apis/yami-materials.ts";

const EditImageMaterialModal = ({open, setOpen, material, tableData, setTableData}: any) => {
  const [fileList, setFileList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!material) return
    const images = material.images.split(',').filter((x: any) => !!x);

    const fileList = images.map((image: string) => {
      return {
        name: 'image.png',
        status: 'done',
        thumbUrl: image,
        uid: uuidv4(),
      }
    });
    setFileList(fileList);
  }, [material, open]);
  const handleUpdateMaterialImage = async () => {
    try {
      setLoading(true)
      const uploadedUrls = [];
      for (const file of fileList) {
        if (file.thumbUrl.startsWith('https')) {
          //not base 64 =>  an  uploaded image  skip
          console.log('exist image', file.thumbUrl);
          uploadedUrls.push(file.thumbUrl);
          continue;
        }
        console.log('upload new  imagge');
        //base 64 => upload
        const originalFile = file.originFileObj;
        //rename file
        const fileExtension = originalFile.name.split('.').pop();
        const newFileName = `${material.code}-${Date.now()}.${fileExtension}`;
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
      const newImages = uploadedUrls.join(',');
      //update  images  in  tableData
      const newData = [...tableData];
      const index = newData.findIndex((item: any) => item.key === material.key);
      const item = newData[index];
      newData.splice(index, 1, {...item, images: newImages});
      setTableData(newData);
      toast.success('Cập nhật ảnh thành công')
      setOpen(false);
    } catch (err) {
      toast.error("Cập nhật ảnh thất bại")
    } finally {
      setLoading(false)
    }
  }
  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      footer={[]}
      title='Sửa ảnh vật tư'
    >
      <Upload
        disabled={loading}
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
        <Button loading={loading}>Click to Upload</Button>
      </Upload>
      <Flex justify='end' style={{marginTop: 20}}>
        <Button
          type='primary'
          style={{marginRight: 20}}
          onClick={handleUpdateMaterialImage}
          loading={loading}
        >
          Lưu
        </Button>
        <Button onClick={() => setOpen(false)}>Hủy</Button>
      </Flex>

    </Modal>
  )
}

export default EditImageMaterialModal;
