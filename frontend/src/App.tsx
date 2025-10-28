import React, { useState } from "react";
import { Card, Row, Col } from "antd";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DroppableProvided,
  DraggableProvided,
  DraggableStateSnapshot,
} from "@hello-pangea/dnd";

interface Item {
  id: string;
  title: string;
  description: string;
}

const initialColumns = {
  todo: [
    { id: "1", title: "Task 1", description: "Do something important" },
    { id: "2", title: "Task 2", description: "Another important task" },
  ],
  inProgress: [
    { id: "3", title: "Task 3", description: "Currently working on it" },
  ],
  done: [{ id: "4", title: "Task 4", description: "Already finished" }],
};

const App = () => {
  const [columns, setColumns] = useState(initialColumns);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceCol = source.droppableId as keyof typeof columns;
    const destCol = destination.droppableId as keyof typeof columns;

    const sourceItems = Array.from(columns[sourceCol]);
    const destItems = Array.from(columns[destCol]);

    const [movedItem] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, movedItem);

    setColumns({
      ...columns,
      [sourceCol]: sourceItems,
      [destCol]: destItems,
    });
  };

  return (
    <div style={{ padding: 24 }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Row gutter={14}>
          {Object.entries(columns).map(([key, items]) => (
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
                          provided: DraggableProvided,
                          snapshot: DraggableStateSnapshot
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
                              style={{
                                boxShadow: snapshot.isDragging
                                  ? "0 2px 12px rgba(0,0,0,0.2)"
                                  : "none",
                              }}
                              title={item.title}
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
