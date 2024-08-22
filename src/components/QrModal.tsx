import {Flex, Modal, QRCode} from "antd";

const QrModal = ({value, open, setOpen}: any) => {
  return (
    <Modal
      title="QR code"
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
    >
      <Flex justify='center'>
        <QRCode
          value={value}
          size={200}
        />
      </Flex>

    </Modal>
  )
}
export default QrModal;
