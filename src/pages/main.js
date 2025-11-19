import React, { useState } from 'react';
import Select from 'react-select';  

const Main = () => {
  // Состояние для хранения списка задач
  // eslint-disable-next-line no-unused-vars
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Создать макет главной страницы', assignee: 'Иванов', status: 'done', priority: 'high' },
    { id: 2, title: 'Разработать API для бэклога', assignee: 'Петров', status: 'done', priority: 'medium' },
    { id: 3, title: 'Настроить базу данных', assignee: 'Сидоров', status: 'done', priority: 'high' },
  ]);

  // Состояние для выбранного пользователя (фильтр)
  const [selectedUser, setSelectedUser] = useState(null);

  // Список пользователей для выпадающего списка
  const userOptions = [
    { value: 'all', label: 'Все пользователи' },
    { value: 'Иванов', label: 'Иванов' },
    { value: 'Петров', label: 'Петров' },
    { value: 'Сидоров', label: 'Сидоров' },
  ];

  // Фильтрация задач по выбранному пользователю
  const filteredTasks = selectedUser && selectedUser.value !== 'all'
    ? tasks.filter(task => task.assignee === selectedUser.value)
    : tasks;

  // Подсчет статистики
  const totalTasks = filteredTasks.length;
  const highPriorityTasks = filteredTasks.filter(task => task.priority === 'high').length;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Заголовок страницы */}
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>
        Рабочий стол
      </h1>

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

      {/* Блок со статистикой */}
      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        marginBottom: '30px',
        flexWrap: 'wrap'
      }}>
        {/* Карточка: Всего выполненных задач */}
        <div style={{
          flex: '1',
          minWidth: '200px',
          padding: '20px',
          backgroundColor: '#e3f2fd',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>Всего задач</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0, color: '#333' }}>
            {totalTasks}
          </p>
        </div>

        {/* Карточка: Задачи с высоким приоритетом */}
        <div style={{
          flex: '1',
          minWidth: '200px',
          padding: '20px',
          backgroundColor: '#ffebee',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#d32f2f' }}>Высокий приоритет</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0, color: '#333' }}>
            {highPriorityTasks}
          </p>
        </div>

        {/* Карточка: Информация о текущем спринте */}
        <div style={{
          flex: '1',
          minWidth: '200px',
          padding: '20px',
          backgroundColor: '#e8f5e9',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#388e3c' }}>Текущий спринт</h3>
          <p style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, color: '#333' }}>
            Спринт 1
          </p>
          <p style={{ fontSize: '14px', margin: '5px 0 0 0', color: '#666' }}>
            Активен
          </p>
        </div>
      </div>

      {/* Заголовок списка задач */}
      <h2 style={{ marginBottom: '20px', color: '#333' }}>
        Выполненные задачи
      </h2>

      {/* Список выполненных задач */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <div 
              key={task.id}
              style={{
                padding: '20px',
                backgroundColor: '#fff',
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
              }}
            >
              {/* Верхняя часть карточки задачи */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  {/* Название задачи */}
                  <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
                    {task.title}
                  </h3>
                  {/* Исполнитель */}
                  <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
                    <strong>Исполнитель:</strong> {task.assignee}
                  </p>
                </div>

                {/* Приоритет задачи */}
                <span style={{
                  padding: '5px 15px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  backgroundColor: task.priority === 'high' ? '#ffcdd2' : '#fff9c4',
                  color: task.priority === 'high' ? '#c62828' : '#f57f17',
                }}>
                  {task.priority === 'high' ? 'Высокий' : 'Средний'}
                </span>
              </div>

              {/* Статус выполнения */}
              <div style={{ marginTop: '15px' }}>
                <span style={{
                  padding: '5px 15px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  backgroundColor: '#c8e6c9',
                  color: '#2e7d32',
                }}>
                  ✓ Выполнено
                </span>
              </div>
            </div>
          ))
        ) : (
          // Сообщение, если задач нет
          <p style={{ textAlign: 'center', color: '#999', padding: '40px' }}>
            Нет выполненных задач для выбранного фильтра
          </p>
        )}
      </div>
    </div>
  );
};

export default Main;