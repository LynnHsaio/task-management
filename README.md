# 任務管理系統 (Task Management System)

## 專案概述

這是一個基於 React + Vite 開發的現代化任務管理系統，提供類似 Trello 的看板功能和日曆視圖，讓使用者能夠有效地管理專案和任務。

## 🚀 LIVE DEMO

部署於 vercel 上

https://task-management-xi-seven.vercel.app/

## 主要功能

### 🎯 核心功能

- **多看板管理**: 支援建立多個專案看板
- **拖拽排序**: 使用 @dnd-kit 實現卡片拖拽功能
- **雙視圖模式**: 看板視圖和日曆視圖
- **任務管理**: 建立、編輯、刪除任務卡片
- **即時編輯**: 支援標題和內容的即時編輯

### 📋 看板視圖功能

- 建立和管理多個列表
- 在列表間拖拽移動卡片
- 即時編輯卡片內容

### 📅 日曆視圖功能

- 月曆格式顯示任務
- 按日期篩選任務
- 在日曆中直接新增任務
- 支援月份切換

## 技術架構

### 🛠 技術棧

- **前端框架**: React 19.1.1
- **建構工具**: Vite 7.1.7
- **拖拽功能**: @dnd-kit (core, sortable, utilities)
- **日期處理**: date-fns 4.1.0
- **圖標庫**: react-icons 5.5.0
- **ID 生成**: uuid 13.0.0
- **程式碼規範**: ESLint

### 📁 專案結構

```
src/
├── components/          # 可重用組件
│   ├── Board.jsx       # 看板主組件
│   ├── BoardSelector.jsx # 看板選擇器
│   ├── CalendarView.jsx # 日曆視圖組件
│   ├── Card.jsx        # 任務卡片組件
│   ├── EditableTitle.jsx # 可編輯標題組件
│   ├── List.jsx        # 列表組件
│   └── ViewSwitcher.jsx # 視圖切換器
├── context/            # React Context
│   └── BoardContext.jsx # 全域狀態管理
├── data/               # 資料和配置
│   └── sampleData.js   # 範例資料
└── App.jsx            # 主應用組件
```

### 🔄 狀態管理

使用 React Context + useReducer 模式進行狀態管理：

- **BoardContext**: 管理所有看板、列表和卡片的狀態
- **Actions**: 提供統一的狀態更新方法
- **Reducer**: 處理複雜的狀態邏輯

### 🎨 設計特色

- **現代化 UI**: 簡潔美觀的使用者介面
- **響應式設計**: 適配桌面和行動裝置
- **直觀操作**: 拖拽、點擊等直觀的互動方式
- **視覺回饋**: 懸停效果和動畫過渡
- **無障礙設計**: 支援鍵盤操作和螢幕閱讀器
