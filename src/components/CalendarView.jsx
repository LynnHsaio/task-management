import React, { useState, useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
} from "date-fns";
import { zhTW } from "date-fns/locale";
import {
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import { useBoard } from "../context/BoardContext.jsx";
import { priorityOptions } from "../data/sampleData";

const CalendarView = () => {
  const { state, actions } = useBoard();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskData, setNewTaskData] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    labels: [],
  });

  // 獲取當前看板的所有任務
  const currentBoard = state.boards.find(
    (board) => board.id === state.currentBoardId
  );
  const allTasks = useMemo(() => {
    if (!currentBoard) return [];
    return currentBoard.lists.flatMap((list) =>
      list.cards.map((card) => ({
        ...card,
        listId: list.id,
        listTitle: list.title,
      }))
    );
  }, [currentBoard]);

  // 獲取指定日期的任務
  const getTasksForDate = (date) => {
    return allTasks.filter((task) => {
      if (!task.dueDate) return false;
      return isSameDay(new Date(task.dueDate), date);
    });
  };

  // 生成日曆網格
  const generateCalendarGrid = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // 週一開始
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const calendarGrid = [];
    let currentDay = startDate;

    while (currentDay <= endDate) {
      calendarGrid.push(currentDay);
      currentDay = addDays(currentDay, 1);
    }

    return calendarGrid;
  };

  const calendarGrid = generateCalendarGrid();

  // 處理月份導航
  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  // 處理日期選擇
  const handleDateClick = (date) => {
    setSelectedDate(date);
    setNewTaskData((prev) => ({
      ...prev,
      dueDate: format(date, "yyyy-MM-dd"),
    }));
  };

  // 處理新增任務
  const handleAddTask = () => {
    if (newTaskData.title.trim() && selectedDate) {
      // 找到第一個列表來新增任務
      const firstList = currentBoard?.lists[0];
      if (firstList) {
        actions.addCard(state.currentBoardId, firstList.id, {
          ...newTaskData,
          dueDate: format(selectedDate, "yyyy-MM-dd"),
        });
        setNewTaskData({
          title: "",
          description: "",
          priority: "medium",
          dueDate: "",
          labels: [],
        });
        setIsAddingTask(false);
      }
    }
  };

  // 處理任務編輯
  const handleEditTask = (task) => {
    const newTitle = prompt("請輸入新任務標題:", task.title);
    if (newTitle && newTitle.trim()) {
      actions.updateCard(state.currentBoardId, task.listId, task.id, {
        title: newTitle.trim(),
      });
    }
  };

  // 處理任務刪除
  const handleDeleteTask = (task) => {
    if (window.confirm("確定要刪除這個任務嗎？")) {
      actions.deleteCard(state.currentBoardId, task.listId, task.id);
    }
  };

  const getPriorityColor = (priority) => {
    const option = priorityOptions.find((opt) => opt.value === priority);
    return option ? option.color : "#61bd4f";
  };

  return (
    <div className="calendar-view">
      {/* 日曆標題和導航 */}
      <div className="calendar-header">
        <div className="calendar-title">
          <h2>{format(currentDate, "yyyy年MM月", { locale: zhTW })}</h2>
          <div className="calendar-navigation">
            <button onClick={handlePrevMonth} className="nav-btn">
              <FiChevronLeft size={20} />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="today-btn"
            >
              今天
            </button>
            <button onClick={handleNextMonth} className="nav-btn">
              <FiChevronRight size={20} />
            </button>
          </div>
        </div>

        {selectedDate && (
          <div className="selected-date-info">
            <span>
              選中日期:{" "}
              {format(selectedDate, "yyyy年MM月dd日", { locale: zhTW })}
            </span>
            <button
              onClick={() => setIsAddingTask(true)}
              className="add-task-btn"
            >
              <FiPlus size={16} />
              新增任務
            </button>
          </div>
        )}
      </div>

      {/* 新增任務表單 */}
      {isAddingTask && selectedDate && (
        <div className="add-task-form">
          <h3>
            在 {format(selectedDate, "yyyy年MM月dd日", { locale: zhTW })}{" "}
            新增任務
          </h3>
          <div className="form-group">
            <input
              type="text"
              value={newTaskData.title}
              onChange={(e) =>
                setNewTaskData({ ...newTaskData, title: e.target.value })
              }
              placeholder="任務標題"
              className="task-title-input"
              autoFocus
            />
          </div>
          <div className="form-group">
            <textarea
              value={newTaskData.description}
              onChange={(e) =>
                setNewTaskData({ ...newTaskData, description: e.target.value })
              }
              placeholder="任務描述"
              className="task-description-input"
              rows="3"
            />
          </div>
          <div className="form-group">
            <select
              value={newTaskData.priority}
              onChange={(e) =>
                setNewTaskData({ ...newTaskData, priority: e.target.value })
              }
              className="priority-select"
            >
              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-actions">
            <button onClick={handleAddTask} className="save-btn">
              新增任務
            </button>
            <button
              onClick={() => {
                setIsAddingTask(false);
                setNewTaskData({
                  title: "",
                  description: "",
                  priority: "medium",
                  dueDate: "",
                  labels: [],
                });
              }}
              className="cancel-btn"
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* 日曆網格 */}
      <div className="calendar-grid">
        {/* 星期標題 */}
        <div className="calendar-weekdays">
          {["一", "二", "三", "四", "五", "六", "日"].map((day) => (
            <div key={day} className="weekday-header">
              {day}
            </div>
          ))}
        </div>

        {/* 日期格子 */}
        <div className="calendar-days">
          {calendarGrid.map((date, index) => {
            const tasksForDate = getTasksForDate(date);
            const isCurrentMonth = isSameMonth(date, currentDate);
            const isSelected = selectedDate && isSameDay(date, selectedDate);
            const isTodayDate = isToday(date);

            return (
              <div
                key={index}
                className={`calendar-day ${
                  !isCurrentMonth ? "other-month" : ""
                } ${isSelected ? "selected" : ""} ${
                  isTodayDate ? "today" : ""
                }`}
                onClick={() => handleDateClick(date)}
              >
                <div className="day-number">{format(date, "d")}</div>
                <div className="day-tasks">
                  {tasksForDate.slice(0, 3).map((task, taskIndex) => (
                    <div
                      key={taskIndex}
                      className="task-item"
                      style={{
                        backgroundColor: getPriorityColor(task.priority),
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDate(date);
                      }}
                    >
                      <span className="task-title">{task.title}</span>
                      <div className="task-actions">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditTask(task);
                          }}
                          className="edit-task-btn"
                        >
                          <FiEdit2 size={10} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTask(task);
                          }}
                          className="delete-task-btn"
                        >
                          <FiTrash2 size={10} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {tasksForDate.length > 3 && (
                    <div className="more-tasks">
                      +{tasksForDate.length - 3} 更多
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 選中日期的詳細任務列表 */}
      {selectedDate && (
        <div className="selected-date-tasks">
          <h3>
            {format(selectedDate, "yyyy年MM月dd日", { locale: zhTW })} 的任務
          </h3>
          <div className="task-list">
            {getTasksForDate(selectedDate).map((task) => (
              <div key={task.id} className="detailed-task-item">
                <div className="task-info">
                  <h4 className="task-title">{task.title}</h4>
                  {task.description && (
                    <p className="task-description">{task.description}</p>
                  )}
                  <div className="task-meta">
                    <span className="task-list-name">
                      列表: {task.listTitle}
                    </span>
                    <span
                      className="task-priority"
                      style={{
                        backgroundColor: getPriorityColor(task.priority),
                      }}
                    >
                      {
                        priorityOptions.find(
                          (opt) => opt.value === task.priority
                        )?.label
                      }
                    </span>
                  </div>
                </div>
                <div className="task-actions">
                  <button
                    onClick={() => handleEditTask(task)}
                    className="edit-task-btn"
                  >
                    <FiEdit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task)}
                    className="delete-task-btn"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            {getTasksForDate(selectedDate).length === 0 && (
              <div className="no-tasks">這一天沒有任務</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
