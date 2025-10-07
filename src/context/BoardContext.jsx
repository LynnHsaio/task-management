import React, { createContext, useContext, useReducer, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { sampleBoards } from "../data/sampleData";

// 初始狀態
const initialState = {
  boards: sampleBoards,
  currentBoardId: "board-1",
};

// Action types
const ActionTypes = {
  SET_BOARDS: "SET_BOARDS",
  ADD_BOARD: "ADD_BOARD",
  UPDATE_BOARD: "UPDATE_BOARD",
  DELETE_BOARD: "DELETE_BOARD",
  ADD_LIST: "ADD_LIST",
  UPDATE_LIST: "UPDATE_LIST",
  DELETE_LIST: "DELETE_LIST",
  ADD_CARD: "ADD_CARD",
  UPDATE_CARD: "UPDATE_CARD",
  DELETE_CARD: "DELETE_CARD",
  MOVE_CARD: "MOVE_CARD",
  SET_CURRENT_BOARD: "SET_CURRENT_BOARD",
};

// Reducer
const boardReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_BOARDS:
      return { ...state, boards: action.payload };

    case ActionTypes.ADD_BOARD:
      return {
        ...state,
        boards: [...state.boards, action.payload],
      };

    case ActionTypes.UPDATE_BOARD:
      return {
        ...state,
        boards: state.boards.map((board) =>
          board.id === action.payload.id ? action.payload : board
        ),
      };

    case ActionTypes.DELETE_BOARD:
      return {
        ...state,
        boards: state.boards.filter((board) => board.id !== action.payload),
      };

    case ActionTypes.ADD_LIST:
      return {
        ...state,
        boards: state.boards.map((board) =>
          board.id === action.payload.boardId
            ? { ...board, lists: [...board.lists, action.payload.list] }
            : board
        ),
      };

    case ActionTypes.UPDATE_LIST:
      return {
        ...state,
        boards: state.boards.map((board) =>
          board.id === action.payload.boardId
            ? {
                ...board,
                lists: board.lists.map((list) =>
                  list.id === action.payload.listId
                    ? { ...list, ...action.payload.updates }
                    : list
                ),
              }
            : board
        ),
      };

    case ActionTypes.DELETE_LIST:
      return {
        ...state,
        boards: state.boards.map((board) =>
          board.id === action.payload.boardId
            ? {
                ...board,
                lists: board.lists.filter(
                  (list) => list.id !== action.payload.listId
                ),
              }
            : board
        ),
      };

    case ActionTypes.ADD_CARD:
      return {
        ...state,
        boards: state.boards.map((board) =>
          board.id === action.payload.boardId
            ? {
                ...board,
                lists: board.lists.map((list) =>
                  list.id === action.payload.listId
                    ? { ...list, cards: [...list.cards, action.payload.card] }
                    : list
                ),
              }
            : board
        ),
      };

    case ActionTypes.UPDATE_CARD:
      return {
        ...state,
        boards: state.boards.map((board) =>
          board.id === action.payload.boardId
            ? {
                ...board,
                lists: board.lists.map((list) =>
                  list.id === action.payload.listId
                    ? {
                        ...list,
                        cards: list.cards.map((card) =>
                          card.id === action.payload.cardId
                            ? { ...card, ...action.payload.updates }
                            : card
                        ),
                      }
                    : list
                ),
              }
            : board
        ),
      };

    case ActionTypes.DELETE_CARD:
      return {
        ...state,
        boards: state.boards.map((board) =>
          board.id === action.payload.boardId
            ? {
                ...board,
                lists: board.lists.map((list) =>
                  list.id === action.payload.listId
                    ? {
                        ...list,
                        cards: list.cards.filter(
                          (card) => card.id !== action.payload.cardId
                        ),
                      }
                    : list
                ),
              }
            : board
        ),
      };

    case ActionTypes.MOVE_CARD:
      const {
        boardId,
        sourceListId,
        destinationListId,
        sourceIndex,
        destinationIndex,
        card,
      } = action.payload;

      return {
        ...state,
        boards: state.boards.map((board) =>
          board.id === boardId
            ? {
                ...board,
                lists: board.lists.map((list) => {
                  if (list.id === sourceListId) {
                    // 從來源列表移除卡片
                    const newCards = [...list.cards];
                    newCards.splice(sourceIndex, 1);
                    return { ...list, cards: newCards };
                  } else if (list.id === destinationListId) {
                    // 在目標列表插入卡片
                    const newCards = [...list.cards];
                    newCards.splice(destinationIndex, 0, card);
                    return { ...list, cards: newCards };
                  }
                  return list;
                }),
              }
            : board
        ),
      };

    case ActionTypes.SET_CURRENT_BOARD:
      return { ...state, currentBoardId: action.payload };

    default:
      return state;
  }
};

// Context
const BoardContext = createContext();

// Provider
export const BoardProvider = ({ children }) => {
  const [state, dispatch] = useReducer(boardReducer, initialState);

  // 載入本地儲存的資料
  useEffect(() => {
    const savedBoards = localStorage.getItem("trello-boards");
    if (savedBoards) {
      dispatch({
        type: ActionTypes.SET_BOARDS,
        payload: JSON.parse(savedBoards),
      });
    }
  }, []);

  // 儲存資料到本地儲存
  useEffect(() => {
    localStorage.setItem("trello-boards", JSON.stringify(state.boards));
  }, [state.boards]);

  // Actions
  const actions = {
    addBoard: (title) => {
      const newBoard = {
        id: uuidv4(),
        title,
        lists: [],
      };
      dispatch({ type: ActionTypes.ADD_BOARD, payload: newBoard });
      return newBoard.id;
    },

    updateBoard: (boardId, updates) => {
      dispatch({
        type: ActionTypes.UPDATE_BOARD,
        payload: { id: boardId, ...updates },
      });
    },

    deleteBoard: (boardId) => {
      dispatch({ type: ActionTypes.DELETE_BOARD, payload: boardId });
    },

    addList: (boardId, title) => {
      const newList = {
        id: uuidv4(),
        title,
        cards: [],
      };
      dispatch({
        type: ActionTypes.ADD_LIST,
        payload: { boardId, list: newList },
      });
      return newList.id;
    },

    updateList: (boardId, listId, updates) => {
      dispatch({
        type: ActionTypes.UPDATE_LIST,
        payload: { boardId, listId, updates },
      });
    },

    deleteList: (boardId, listId) => {
      dispatch({ type: ActionTypes.DELETE_LIST, payload: { boardId, listId } });
    },

    addCard: (boardId, listId, cardData) => {
      const newCard = {
        id: uuidv4(),
        title: cardData.title || "新卡片",
        description: cardData.description || "",
        priority: cardData.priority || "medium",
        dueDate: cardData.dueDate || "",
        labels: cardData.labels || [],
        ...cardData,
      };
      dispatch({
        type: ActionTypes.ADD_CARD,
        payload: { boardId, listId, card: newCard },
      });
      return newCard.id;
    },

    updateCard: (boardId, listId, cardId, updates) => {
      dispatch({
        type: ActionTypes.UPDATE_CARD,
        payload: { boardId, listId, cardId, updates },
      });
    },

    deleteCard: (boardId, listId, cardId) => {
      dispatch({
        type: ActionTypes.DELETE_CARD,
        payload: { boardId, listId, cardId },
      });
    },

    moveCard: (
      boardId,
      sourceListId,
      destinationListId,
      sourceIndex,
      destinationIndex,
      card
    ) => {
      dispatch({
        type: ActionTypes.MOVE_CARD,
        payload: {
          boardId,
          sourceListId,
          destinationListId,
          sourceIndex,
          destinationIndex,
          card,
        },
      });
    },

    setCurrentBoard: (boardId) => {
      dispatch({ type: ActionTypes.SET_CURRENT_BOARD, payload: boardId });
    },
  };

  return (
    <BoardContext.Provider value={{ state, actions }}>
      {children}
    </BoardContext.Provider>
  );
};

// Hook
export const useBoard = () => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error("useBoard must be used within a BoardProvider");
  }
  return context;
};
