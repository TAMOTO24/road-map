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
import ActionCard from "./addNewTextCard/newtextcard.tsx";
import axios from "axios";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DroppableProvided,
  DraggableProvided,
  DropResult,
} from "@hello-pangea/dnd";

const { Search } = Input;
type ColumnId = "todo" | "inProgress" | "done";

const App = () => {
  const boards: Board[] = useSelector((state: RootState) => state.board.boards);
  const dispatch = useAppDispatch();
  // const activeBoardId = useSelector(
  //   (state: RootState) => state.board.activeBoardId
  // );

  const [columns, setColumns] = useState<Board | undefined>(undefined);

  // const actions: React.ReactNode<>[] = [
  //   <DeleteOutlined key="delete" style={{ marginLeft: 8 }} />,
  //   <ActionCard initialData={undefined} onSubmit={() => {}} />,
  //   // <EditOutlined key="edit" style={{ marginLeft: 8 }} />,
  // ];

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

  // const handleAddCard = (data: BoardCard, columnId?: ColumnId) => {
  //   if (!columns || !columnId || !columns) return;

  //   console.log("Adding card to column:", columnId, data);

  //   const res = axios.post("http://localhost:5000/api/cards", {
  //     ...data,
  //     boardId: columns._id,
  //     columnId: columnId,
  //   });

  //   setColumns((prev) => {
  //     if (!prev) return prev; // если prev undefined, возвращаем тоже undefined

  //     return {
  //       ...prev,
  //       columns: {
  //         ...prev.columns,
  //         [columnId]: [...prev.columns[columnId], res.data as BoardCard],
  //       },
  //       _id: prev._id, // здесь точно string, TypeScript доволен
  //     };
  //   });
  // };
  const handleAddCard = async (
    columnId: ColumnId,
    newCardData: Partial<BoardCard>
  ) => {
    try {
      const res = await axios.post<BoardCard>("/api/cards", newCardData);

      const newCard = res.data;

      setColumns((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          columns: {
            ...prev.columns,
            [columnId]: [...prev.columns[columnId], newCard],
          },
          _id: prev._id,
        };
      });
    } catch (error) {
      console.error(error);
    }
  };

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
                              actions={[
                                <ActionCard
                                  key="edit"
                                  initialData={item}
                                  onSubmit={() => {}}
                                />,
                                <DeleteOutlined
                                  key="delete"
                                  // onClick={() => handleDelete(item.id)}
                                  style={{ color: "red" }}
                                />,
                              ]}
                            >
                              {item.description}
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}

                    {key === "todo" && (
                      <ActionCard boardType={key} onSubmit={handleAddCard} />
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
