import React, { useState } from "react";
import { FiGrid, FiCalendar } from "react-icons/fi";

const ViewSwitcher = ({ currentView, onViewChange }) => {
  const views = [
    { id: "board", name: "看板視圖", icon: FiGrid },
    { id: "calendar", name: "日曆視圖", icon: FiCalendar },
  ];

  return (
    <div className="view-switcher">
      {views.map((view) => {
        const IconComponent = view.icon;
        return (
          <button
            key={view.id}
            onClick={() => onViewChange(view.id)}
            className={`view-btn ${currentView === view.id ? "active" : ""}`}
            title={view.name}
          >
            <IconComponent size={16} />
            <span>{view.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ViewSwitcher;
