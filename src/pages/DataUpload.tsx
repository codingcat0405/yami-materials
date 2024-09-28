import {Button,  InputNumber, Select, Upload} from "antd";
import {useState} from "react";
import toast from "react-hot-toast";
import yamiMaterials from "../apis/yami-materials.ts";

const ALLOWED_TYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel'

];
const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const dataMapping = [
  {
    label: 'Mã vật tư',
    key: 'codeCol',
  },
  {
    label: 'Tên vật tư',
    key: 'nameCol',
  },
  {
    label: 'Ngày nhập kho',
    key: 'entryDateCol',
  },
  {
    label: 'Trạng thái',
    key: 'statusCol',
  },
  {
    label: 'Mã tem',
    key: 'stampCodeCol',
  },
  {
    label: 'Danh điểm',
    key: 'creatorCodeCol',
  },
  {
    label: 'Thiết bị',
    key: 'deviceCol',
  },
  {
    label: 'Đơn vị',
    key: 'unitCol',
  },
]
const DataUpload = () => {
  const [file, setFile] = useState<any>(null);
  const [dataMap, setDataMap] = useState<any>(null);
  const [startRow, setStartRow] = useState(1);
  const [loading, setLoading] = useState(false);
  const handleChooseFile = ({file}: any) => {
    setFile(file);
  }

  const handleUpload = async () => {
    try {
      setLoading(true);
      if (!file) {
        throw new Error('Please choose file');
      }
      if (!dataMap) {
        throw new Error('Please config data mapping');
      }
      //check if column list is duplicated
      const values = Object.values(dataMap);
      const uniqueValues = new Set(values);
      if (values.length !== uniqueValues.size) {
        throw new Error('Column list is duplicated');
      }
      if (!startRow) {
        throw new Error('Please input start row');
      }

      const fileExtension = file.name.split('.').pop();
      const newFileName = `${Date.now()}.${fileExtension}`;
      const presignedUrlResp = await yamiMaterials.getPresignedUrl(newFileName);

      const resp = await fetch(presignedUrlResp.uploadUrl, {
        method: 'PUT',
        body: file.originFileObj,
      })
      if (!resp.ok) {
        throw new Error('Upload file failed');
      }
      const data = {
        fileName: newFileName,
        config: {
          dataStartRow: startRow,
          ...dataMap,
        }
      }
      await yamiMaterials.syncExcelData(data);
      toast('Upload file success');

    } catch (err: any) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }


  return (
    <div>
      <h4>Upload excel data file</h4>
      <div>
        <Upload.Dragger
          multiple={false}
          onChange={handleChooseFile}
          showUploadList={false}
          accept={ALLOWED_TYPES.join(',')}
        >
          {
            file ? <p>{file.name}</p> : (
              <Button>Click or drag file to this area to upload</Button>
            )
          }
        </Upload.Dragger>
      </div>
      <div>
        <h4>Start Row</h4>
        <InputNumber
          value={startRow}
          onChange={(e: any) => {
            setStartRow(e)
          }}
        />
      </div>
      <div>
        <h4>Column Config</h4>
        {
          dataMapping.map((item) => {
            return (
              <div style={{margin: '10px 0'}} key={item.key}>
                <label>{item.label}: </label>
                <Select
                  style={{width: 200}}
                  options={cols.map((col) => ({label: col, value: col}))}
                  onChange={(value) => {
                    setDataMap({
                      ...dataMap,
                      [item.key]: value
                    })
                  }}
                />
              </div>
            )
          })
        }
      </div>
      <div style={{margin: '20px 0'}}>
        <Button style={{width: '100%'}} type='primary' onClick={handleUpload} loading={loading}>Upload</Button>
      </div>
    </div>
  );
}
export default DataUpload;