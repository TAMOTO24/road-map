import React, { useState } from "react";
import { Card, Row, Col, Input } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DroppableProvided,
  DraggableProvided,
} from "@hello-pangea/dnd";

const { Search } = Input;

// interface Item {
//   id: string;
//   title: string;
//   description: string;
// }

const initialColumns = {
  name: "Task Board",
  columns: {
    todo: [
      { id: "1", title: "Task 1", description: "Do something important" },
      { id: "2", title: "Task 2", description: "Another important task" },
    ],
    inProgress: [
      { id: "3", title: "Task 3", description: "Currently working on it" },
    ],
    done: [{ id: "4", title: "Task 4", description: "Already finished" }],
  },
};

const App = () => {
  const [columns, setColumns] = useState(initialColumns);

  const actions: React.ReactNode[] = [
    <DeleteOutlined key="delete" style={{ marginLeft: 8 }} />,
    <EditOutlined key="edit" style={{ marginLeft: 8 }} />,
  ];

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    console.log( source, destination );
    if (!destination || source.droppableId == destination.droppableId) return;

    const sourceCol = source.droppableId as keyof typeof columns.columns;
    const destCol = destination.droppableId as keyof typeof columns.columns;

    const sourceItems = Array.from(columns.columns[sourceCol]);
    const destItems = Array.from(columns.columns[destCol]);

    const [movedItem] = sourceItems.splice(source.index, 1); // delete from source
    destItems.splice(destination.index, 0, movedItem); // add to destination

    setColumns({
      ...columns,
      columns: {
        ...columns.columns,
        [sourceCol]: sourceItems,
        [destCol]: destItems,
      },
    });
  };

  return (
    <div style={{ padding: 24 }}>
      <Search
        placeholder="Enter a board ID here..."
        allowClear
        enterButton="Load"
        size="large"
        // onSearch={onSearch}
      />

      <h1 style={{ textAlign: "center" }}>{columns.name}</h1>

      <DragDropContext onDragEnd={onDragEnd}>
        <Row gutter={14}>
          {Object.entries(columns.columns).map(([key, items]) => (
            <Col span={8} key={key}>
              <h2 style={{ textTransform: "capitalize" }}>{key}</h2>
              <Droppable droppableId={key}>
                {(provided: DroppableProvided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      background: "#fafafa",
                      minHeight: 300,
                      padding: 8,
                      borderRadius: 8,
                      border: "1px solid #f0f0f0",
                    }}
                  >
                    {items.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(
                          provided: DraggableProvided
                          // snapshot: DraggableStateSnapshot
                        ) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              marginBottom: 8,
                              ...provided.draggableProps.style,
                            }}
                          >
                            <Card
                              hoverable
                              title={item.title}
                              actions={actions}
                            >
                              {item.description}
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </Col>
          ))}
        </Row>
      </DragDropContext>
    </div>
  );
};

export default App;
