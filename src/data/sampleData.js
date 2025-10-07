// 範例資料結構
export const sampleBoards = [
  {
    id: "board-1",
    title: "我的專案",
    lists: [
      {
        id: "list-1",
        title: "待辦事項",
        cards: [
          {
            id: "card-1",
            title: "設計使用者介面",
            description: "設計登入頁面和主頁面",
            priority: "high",
            dueDate: "2024-01-15",
            labels: ["設計", "前端"],
          },
          {
            id: "card-2",
            title: "建立資料庫",
            description: "設計使用者資料表結構",
            priority: "medium",
            dueDate: "2024-01-20",
            labels: ["後端", "資料庫"],
          },
        ],
      },
      {
        id: "list-2",
        title: "進行中",
        cards: [
          {
            id: "card-3",
            title: "實作 API",
            description: "建立 RESTful API 端點",
            priority: "high",
            dueDate: "2024-01-18",
            labels: ["後端", "API"],
          },
        ],
      },
      {
        id: "list-3",
        title: "已完成",
        cards: [
          {
            id: "card-4",
            title: "專案規劃",
            description: "完成專案需求分析和時程規劃",
            priority: "low",
            dueDate: "2024-01-10",
            labels: ["規劃"],
          },
        ],
      },
    ],
  },
];

// 優先級選項
export const priorityOptions = [
  { value: "low", label: "低", color: "#61bd4f" },
  { value: "medium", label: "中", color: "#f2d600" },
  { value: "high", label: "高", color: "#eb5a46" },
];

// 標籤顏色選項
export const labelColors = [
  { name: "設計", color: "#61bd4f" },
  { name: "前端", color: "#0079bf" },
  { name: "後端", color: "#ff9f1a" },
  { name: "資料庫", color: "#c377e0" },
  { name: "API", color: "#ff78cb" },
  { name: "規劃", color: "#344563" },
];
