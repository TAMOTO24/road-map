import React, { useState } from "react";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal } from "antd";
import type { BoardCard } from "../features/board/boardSlice.ts";

type ColumnId = "todo" | "inProgress" | "done";

interface AddNewTextCardProps {
  boardType?: ColumnId;
  initialData?: BoardCard;
  onSubmit: (boardType: ColumnId, data: BoardCard) => void;
}

const ActionCard: React.FC<AddNewTextCardProps> = ({
  boardType,
  initialData,
  onSubmit,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    if (initialData) {
      form.setFieldsValue(initialData);
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleFinish = (values: BoardCard) => {
    if (!boardType) return;
    const data = initialData ? { ...initialData, ...values } : { ...values };

    console.log('Submitting data:', data);

    onSubmit(boardType, data);
    setIsModalOpen(false);
  };

  return (
    <>
      {!initialData ? (
        <Button
          type="primary"
          size="large"
          icon={initialData ? <EditOutlined /> : <PlusOutlined />}
          onClick={showModal}
          style={{
            alignSelf: "center",
            width: "100%",
            height: 175,
            fontSize: 50,
            marginTop: 8,
          }}
        />
      ) : (
        <EditOutlined key="edit" style={{ marginLeft: 8 }} />
      )}

      <Modal
        title={initialData ? "Edit Task" : "Create New Task"}
        open={isModalOpen}
        footer={null}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={initialData}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please input your title!" }]}
          >
            <Input placeholder="Give it a name..." />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please input your description!" },
            ]}
          >
            <Input.TextArea
              autoSize={{ minRows: 3, maxRows: 5 }}
              placeholder="Type your text here..."
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {initialData ? "Save Changes" : "Create Task"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ActionCard;
