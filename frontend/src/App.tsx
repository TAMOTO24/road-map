import React, { useState, useEffect } from "react";
import { Card, Row, Col, Input, Empty } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
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
import CreateNewBoard from "./createNewBoard/createnewboard.tsx";
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
  const [visible, setVisible] = useState(false);

  const [columns, setColumns] = useState<Board | undefined>(undefined);

  useEffect(() => {
    if (boards.length > 0) {
      dispatch(setCurrentBoardId(boards[0]._id));
    }
  }, [boards, dispatch]);

  useEffect(() => {
    dispatch(fetchBoards());
  }, [dispatch]);

  useEffect(() => {
    if (!columns?._id) {
      setColumns(boards.find((b) => String(b._id) === boards[0]?._id));
    }
  }, [boards]);

  const toggleCreateBoardModal = () => {
    setVisible(!visible);
  };

  const onSubmitCreateBoardModal = async (name: string) => {
    try {
      const res = await axios.post<Board>("http://localhost:5000/boards", {
        name,
        columns: { todo: [], inProgress: [], done: [] },
      });

      const newBoard = res.data;
      await dispatch(fetchBoards()).unwrap();
      dispatch(setCurrentBoardId(newBoard._id));
      setColumns(newBoard);
    } catch (error) {
      console.error("Error creating board:", error);
    }
  };

  const handleAddCard = async (
    columnId: ColumnId,
    newCardData: Partial<BoardCard>
  ) => {
    try {
      const res = await axios.post<BoardCard>(
        "http://localhost:5000/boards/newCard",
        {
          ...newCardData,
          boardId: columns?._id,
          columnId: columnId,
        }
      );

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

  const handleSearch = (id: string) => {
    const board = boards.find((b) => String(b._id) === id);
    if (board) {
      dispatch(setCurrentBoardId(board._id));
      setColumns(board);
    } else {
      toggleCreateBoardModal();
    }
  };

  const handleChangeCard = (columnId: ColumnId, updatedCard: BoardCard) => {
    if (!columns) return;
    const updatedCards = columns.columns[columnId].map((card) =>
      card._id === updatedCard._id ? updatedCard : card
    );

    axios.put(`http://localhost:5000/boards/card/${columns._id}`, {
      columnId,
      cardId: updatedCard._id,
      title: updatedCard.title,
      description: updatedCard.description,
    });

    setColumns({
      ...columns,
      columns: {
        ...columns.columns,
        [columnId]: updatedCards,
      },
    });
  };

  const handleDeleteCard = (columnId: ColumnId, cardId: string) => {
    if (!columns) return;

    axios.delete(`http://localhost:5000/boards/card/${columns._id}`, {
      data: { columnId, cardId },
    });

    setColumns({
      ...columns,
      columns: {
        ...columns.columns,
        [columnId]: columns.columns[columnId].filter(
          (card) => card._id !== cardId
        ),
      },
    });
  };

  const onDragEnd = (result: DropResult) => {
    if (!columns) return;
    const { source, destination } = result;
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
        onSearch={handleSearch}
      />

      <h1 style={{ textAlign: "center" }}>
        <div>{columns?.name}</div>
        <div style={{ fontSize: 13, color: "#888" }}>{columns?._id}</div>
      </h1>

      {columns ? (
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
                                    boardType={key as ColumnId}
                                    initialData={item}
                                    onSubmit={handleChangeCard}
                                  />,
                                  <DeleteOutlined
                                    key="delete"
                                    onClick={() =>
                                      handleDeleteCard(
                                        key as ColumnId,
                                        item._id
                                      )
                                    }
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
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Empty />
        </div>
      )}
      <CreateNewBoard
        visible={visible}
        onCancel={toggleCreateBoardModal}
        onSubmit={onSubmitCreateBoardModal}
      />
    </div>
  );
};

export default App;
