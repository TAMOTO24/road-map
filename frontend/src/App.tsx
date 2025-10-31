import React, { useState, useEffect } from "react";
import { Card, Row, Col, Input, Button } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import {
  Board,
  BoardCard,
  setCurrentBoardId,
  updateBoardColumns,
} from "./features/board/boardSlice.ts";
import { RootState } from "./config/store";
import { fetchBoards, saveBoardColumns } from "./features/board/boardThunk.ts";
import { useAppDispatch } from "./config/hooks.ts";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DroppableProvided,
  DraggableProvided,
  DropResult,
} from "@hello-pangea/dnd";

const { Search } = Input;

const App = () => {
  const boards: Board[] = useSelector((state: RootState) => state.board.boards);
  const dispatch = useAppDispatch();
  // const activeBoardId = useSelector(
  //   (state: RootState) => state.board.activeBoardId
  // );

  const [columns, setColumns] = useState<Board | undefined>(undefined);

  const actions: React.ReactNode[] = [
    <DeleteOutlined key="delete" style={{ marginLeft: 8 }} />,
    <EditOutlined key="edit" style={{ marginLeft: 8 }} />,
  ];

  useEffect(() => {
    if (boards.length > 0) {
      dispatch(setCurrentBoardId(boards[0]._id));
    }
  }, [boards, dispatch]);

  useEffect(() => {
    dispatch(fetchBoards());
  }, [dispatch]);

  useEffect(() => {
    setColumns(boards.find((b) => String(b._id) === boards[0]?._id));
  }, [boards]);

  const onDragEnd = (result: DropResult) => {
    if (!columns) return;
    const { source, destination } = result;
    console.log(source, destination);
    if (!destination || source.droppableId == destination.droppableId) return;

    const sourceCol = source.droppableId as keyof typeof columns.columns;
    const destCol = destination.droppableId as keyof typeof columns.columns;

    const sourceItems = Array.from(columns.columns[sourceCol]);
    const destItems = Array.from(columns.columns[destCol]);

    const [movedItem] = sourceItems.splice(source.index, 1); // delete from source
    destItems.splice(destination.index, 0, movedItem); // add to destination

    const newColumns = {
      columns: {
        ...columns.columns,
        [sourceCol]: sourceItems,
        [destCol]: destItems,
      },
    };

    setColumns({
      ...columns,
      columns: newColumns.columns,
    });
    dispatch(
      updateBoardColumns({ boardId: columns._id, columns: newColumns.columns })
    );
    dispatch(
      saveBoardColumns({ boardId: columns._id, columns: newColumns.columns })
    );
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

      <h1 style={{ textAlign: "center" }}>{columns?.name}</h1>

      <DragDropContext onDragEnd={onDragEnd}>
        <Row gutter={14}>
          {Object.entries(columns?.columns || {}).map(([key, items]) => (
            <Col span={8} key={key}>
              <h2 style={{ textTransform: "capitalize" }}>{key}</h2>
              <Droppable droppableId={key}>
                {(provided: DroppableProvided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      background: "#F4F6F8",
                      height: "100%",
                      padding: 8,
                      borderRadius: 8,
                      border: "1px solid #f0f0f0",
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    {items.map((item: BoardCard, index: number) => (
                      <Draggable
                        key={item._id}
                        draggableId={item._id}
                        index={index}
                      >
                        {(provided: DraggableProvided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
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

                    {key === "todo" && (
                      <Button
                        type="primary"
                        size="large"
                        color="default"
                        variant="outlined"
                        icon={<PlusOutlined />}
                        style={{
                          alignSelf: "center",
                          width: "100%",
                          height: 175,
                          fontSize: 50,
                          marginTop: 8,
                        }}
                      />
                    )}
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
