import React, { useState, useMemo, useEffect } from 'react';
import Select from 'react-select';

const Active_sprint = () => {
  // Состояние для хранения задач в разных колонках канбан-доски
  const [columns, setColumns] = useState({
    todo: [
      { id: 1, title: 'Разработать форму добавления задачи', assignee: 'Иванов', priority: 'high' },
      { id: 2, title: 'Создать API для спринтов', assignee: 'Петров', priority: 'medium' },
    ],
    inProgress: [
      { id: 3, title: 'Тестирование главной страницы', assignee: 'Сидоров', priority: 'high' },
    ],
    done: [
      { id: 4, title: 'Настройка окружения', assignee: 'Иванов', priority: 'low' },
    ],
  });

  // Загрузка задач из localStorage при монтировании компонента
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    
    // Если есть сохраненные задачи, добавляем их в колонку "К выполнению"
    if (savedTasks.length > 0) {
      setColumns(prevColumns => ({
        ...prevColumns,
        todo: [...prevColumns.todo, ...savedTasks],
      }));

      // Очищаем localStorage после загрузки (чтобы задачи не дублировались при повторном заходе)
      // Если хотите сохранять задачи между сеансами, закомментируйте следующую строку
      localStorage.removeItem('tasks');
    }
  }, []);

  // Состояние для перетаскиваемой задачи
  const [draggedTask, setDraggedTask] = useState(null);
  const [draggedFrom, setDraggedFrom] = useState(null);

  // Состояние для выбранного пользователя (фильтр)
  const [selectedUser, setSelectedUser] = useState(null);

  // Список пользователей для выпадающего списка
  const userOptions = [
    { value: 'all', label: 'Все пользователи' },
    { value: 'Иванов', label: 'Иванов' },
    { value: 'Петров', label: 'Петров' },
    { value: 'Сидоров', label: 'Сидоров' },
  ];

  // Функция фильтрации задач по выбранному исполнителю
  const filterTasks = useMemo(() => {
    return (tasks) => {
      // Если фильтр не установлен или выбран "Все пользователи", показываем все задачи
      if (!selectedUser || selectedUser.value === 'all') {
        return tasks;
      }
      // Иначе показываем только задачи выбранного исполнителя
      return tasks.filter(task => task.assignee === selectedUser.value);
    };
  }, [selectedUser]);

  // Применяем фильтр ко всем колонкам
  const filteredColumns = useMemo(() => ({
    todo: filterTasks(columns.todo),
    inProgress: filterTasks(columns.inProgress),
    done: filterTasks(columns.done),
  }), [columns, filterTasks]);

  // Обработчик начала перетаскивания
  const handleDragStart = (task, columnName) => {
    setDraggedTask(task);
    setDraggedFrom(columnName);
  };

  // Обработчик отпускания задачи в новую колонку
  const handleDrop = (targetColumn) => {
    if (!draggedTask || !draggedFrom) return;

    // Если задача осталась в той же колонке, ничего не делаем
    if (draggedFrom === targetColumn) {
      setDraggedTask(null);
      setDraggedFrom(null);
      return;
    }

    // Создаем новое состояние колонок
    const newColumns = { ...columns };

    // Удаляем задачу из исходной колонки
    newColumns[draggedFrom] = newColumns[draggedFrom].filter(
      task => task.id !== draggedTask.id
    );

    // Добавляем задачу в целевую колонку
    newColumns[targetColumn] = [...newColumns[targetColumn], draggedTask];

    // Обновляем состояние
    setColumns(newColumns);

    // Сбрасываем состояние перетаскивания
    setDraggedTask(null);
    setDraggedFrom(null);
  };

    // Обработчик для разрешения сброса
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Функция для получения цвета в зависимости от приоритета
  function getPriorityColor(priority) {
    switch (priority) {
      case 'high':
        return { bg: '#ffcdd2', text: '#c62828' };
      case 'medium':
        return { bg: '#fff9c4', text: '#f57f17' };
      case 'low':
        return { bg: '#c8e6c9', text: '#2e7d32' };
      default:
        return { bg: '#e0e0e0', text: '#424242' };
    }
  }

  // Функция для получения названия приоритета на русском
  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high': return 'Высокий';
      case 'medium': return 'Средний';
      case 'low': return 'Низкий';
      default: return 'Не указан';
    }
  };

  // Стили для колонок
  const columnStyle = {
    flex: 1,
    minWidth: '280px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    padding: '15px',
  };

  // Стили для заголовков колонок
  const columnHeaderStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '15px',
    padding: '10px',
    borderRadius: '5px',
    textAlign: 'center',
  };

  // Стили для карточек задач
  const taskCardStyle = {
    backgroundColor: '#fff',
    padding: '15px',
    marginBottom: '10px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    cursor: 'move',
    transition: 'transform 0.2s, box-shadow 0.2s',
  };

  // Компонент для отображения одной задачи
  const TaskCard = ({ task, columnName }) => {
    const priorityColors = getPriorityColor(task.priority);
    
    return (
      <div 
        style={taskCardStyle}
        draggable={true}
        onDragStart={() => handleDragStart(task, columnName)}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        }}
      >
        {/* Заголовок задачи */}
        <h4 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '15px' }}>
          {task.title}
        </h4>
        
        {/* Исполнитель */}
        <p style={{ margin: '5px 0', fontSize: '13px', color: '#666' }}>
          Исполнитель: {task.assignee}
        </p>
        
        {/* Приоритет */}
        <div style={{ marginTop: '10px' }}>
          <span style={{
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: 'bold',
            backgroundColor: priorityColors.bg,
            color: priorityColors.text,
          }}>
            {getPriorityLabel(task.priority)}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Заголовок страницы */}
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '10px' }}>
        Активный спринт
      </h1>

      {/* Информация о спринте */}
      <div style={{
        textAlign: 'center',
        marginBottom: '30px',
        padding: '15px',
        backgroundColor: '#e3f2fd',
        borderRadius: '8px',
      }}>
        <h3 style={{ margin: '0 0 5px 0', color: '#1976d2' }}>Спринт 1</h3>
        <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
          Срок: 01.03.2024 - 15.03.2024 | Осталось: 5 дней
        </p>
      </div>

       {/* Блок с фильтром по пользователям */}
      <div style={{ marginBottom: '30px', maxWidth: '300px' }}>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
          Фильтр по исполнителю:
        </label>
        <Select
          options={userOptions}
          value={selectedUser}
          onChange={setSelectedUser}
          placeholder="Выберите пользователя..."
          isClearable
        />
      </div>
      

           {/* Канбан-доска с тремя колонками */}
      <div style={{ 
        display: 'flex', 
        gap: '20px',
        overflowX: 'auto',
        paddingBottom: '20px',
      }}>
        {/* Колонка "К выполнению" */}
        <div 
          style={columnStyle}
          onDragOver={handleDragOver}
          onDrop={() => handleDrop('todo')}
        >
          <div style={{ 
            ...columnHeaderStyle, 
            backgroundColor: '#ffecb3',
            color: '#f57c00',
          }}>
            К выполнению ({filteredColumns.todo.length})
          </div>
          <div>
            {filteredColumns.todo.map(task => (
              <TaskCard key={task.id} task={task} columnName="todo" />
            ))}
            {filteredColumns.todo.length === 0 && (
              <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                Нет задач
              </p>
            )}
          </div>
        </div>

        {/* Колонка "В работе" */}
        <div 
          style={columnStyle}
          onDragOver={handleDragOver}
          onDrop={() => handleDrop('inProgress')}
        >
          <div style={{ 
            ...columnHeaderStyle, 
            backgroundColor: '#bbdefb',
            color: '#1976d2',
          }}>
            В работе ({filteredColumns.inProgress.length})
          </div>
          <div>
            {filteredColumns.inProgress.map(task => (
              <TaskCard key={task.id} task={task} columnName="inProgress" />
            ))}
            {filteredColumns.inProgress.length === 0 && (
              <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                Нет задач
              </p>
            )}
          </div>
        </div>

        {/* Колонка "Выполнено" */}
        <div 
          style={columnStyle}
          onDragOver={handleDragOver}
          onDrop={() => handleDrop('done')}
        >
          <div style={{ 
            ...columnHeaderStyle, 
            backgroundColor: '#c8e6c9',
            color: '#388e3c',
          }}>
            Выполнено ({filteredColumns.done.length})
          </div>
          <div>
            {filteredColumns.done.map(task => (
              <TaskCard key={task.id} task={task} columnName="done" />
            ))}
            {filteredColumns.done.length === 0 && (
              <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                Нет задач
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Примечание о drag-and-drop */}
      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#e8f5e9',
        borderRadius: '8px',
        border: '1px solid #66bb6a',
      }}>
        <p style={{ margin: 0, color: '#2e7d32', fontSize: '14px' }}>
          <strong>Подсказка:</strong> Вы можете перетаскивать задачи между колонками, удерживая карточку мышью
        </p>
      </div>
    </div>
  );
};

export default Active_sprint;