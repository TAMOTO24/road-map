import React from "react";
import { Modal, Form, Input, Button } from "antd";

interface CardModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (name: string) => void;
}

const CreateNewBoard: React.FC<CardModalProps> = ({
  visible,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  const handleFinish = (values: { name: string }) => {
    form.resetFields();
    onCancel();
    onSubmit(values.name);
  };

  return (
    <Modal
      title={"There no board with such ID. Create a new one?"}
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter a name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Create Board
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateNewBoard;
