import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// Исправлены импорты: имена файлов должны совпадать с регистром на диске
import Main from "./pages/main";
import Active_sprint from './pages/active_sprint';
import Tasks from './pages/tasks';

const App = () => {

  return (
    <Router>
      <div style={{ textAlign: "center" }}>
        <nav style={{ marginBottom: "20px" }}>
          <Link to="/" style={{ margin: "0 10px" }}>
            Рабочий стол
          </Link>
          <Link to="/sprint" style={{ margin: "0 10px" }}>
            Активный спринт
          </Link>
          <Link to="/tasks" style={{ margin: "0 10px" }}>
            Панель администратора
          </Link>
        </nav>
        {/* Маршруты приложения: используем компоненты с заглавной буквы */}
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/sprint" element={<Active_sprint />} />
          <Route path="/tasks" element={<Tasks />} />
        </Routes>
      </div>
    </Router>
  );
};
export default App;
