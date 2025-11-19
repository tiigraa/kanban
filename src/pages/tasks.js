import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

const Tasks = () => {
  // Хук для навигации между страницами
  const navigate = useNavigate();

  // Состояние для хранения данных новой задачи
  const [taskData, setTaskData] = useState({
    title: '',
    subtitle: '',
    author: '',
    assignee: null,
    executionTime: '',
    description: '',
    taskId: '',
    additionalComments: '',
    observers: [],
    sprintEndTime: '',
  });

  // Список пользователей для выпадающих списков
  const userOptions = [
    { value: 'ivanov', label: 'Иванов' },
    { value: 'petrov', label: 'Петров' },
    { value: 'sidorov', label: 'Сидоров' },
    { value: 'kuznetsov', label: 'Кузнецов' },
  ];

  // Обработчик изменения текстовых полей
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Обработчик изменения выбора исполнителя
  const handleAssigneeChange = (selectedOption) => {
    setTaskData(prev => ({
      ...prev,
      assignee: selectedOption
    }));
  };

  // Обработчик изменения наблюдателей
  const handleObserversChange = (selectedOptions) => {
    setTaskData(prev => ({
      ...prev,
      observers: selectedOptions || []
    }));
  };

  // Обработчик отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Валидация обязательных полей
    if (!taskData.title.trim()) {
      alert('Пожалуйста, заполните заголовок задачи');
      return;
    }
    
    if (!taskData.assignee) {
      alert('Пожалуйста, выберите исполнителя');
      return;
    }

    if (!taskData.author.trim()) {
      alert('Пожалуйста, укажите автора задачи');
      return;
    }

    if (!taskData.executionTime) {
      alert('Пожалуйста, укажите время выполнения');
      return;
    }

    if (!taskData.description.trim()) {
      alert('Пожалуйста, заполните описание задачи');
      return;
    }

    if (!taskData.taskId.trim()) {
      alert('Пожалуйста, укажите ID задачи');
      return;
    }

    // Валидация формата ID задачи
    const taskIdPattern = /^[A-Z]{2}-[1-9]{4}$/;
    if (!taskIdPattern.test(taskData.taskId)) {
      alert('ID задачи должен быть в формате XX-1234 (2 заглавные буквы, тире, 4 цифры от 1 до 9)');
      return;
    }

    // Получаем существующие задачи из localStorage
    const existingTasks = JSON.parse(localStorage.getItem('tasks') || '[]');

    // Создаем новую задачу с уникальным ID
    const newTask = {
      id: Date.now(), // Используем временную метку как уникальный ID
      title: taskData.title,
      subtitle: taskData.subtitle,
      author: taskData.author,
      assignee: taskData.assignee.label, // Сохраняем имя исполнителя
      executionTime: taskData.executionTime,
      description: taskData.description,
      taskId: taskData.taskId,
      additionalComments: taskData.additionalComments,
      observers: taskData.observers.map(obs => obs.label), // Массив имен наблюдателей
      sprintEndTime: taskData.sprintEndTime,
      priority: 'medium', // По умолчанию средний приоритет
      createdAt: new Date().toISOString(),
    };

    // Добавляем новую задачу к существующим
    const updatedTasks = [...existingTasks, newTask];

    // Сохраняем в localStorage
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));

    // Показываем сообщение об успехе
    alert('Задача успешно создана и добавлена в спринт!');
    
    // Очистка формы после отправки
    setTaskData({
      title: '',
      subtitle: '',
      author: '',
      assignee: null,
      executionTime: '',
      description: '',
      taskId: '',
      additionalComments: '',
      observers: [],
      sprintEndTime: '',
    });

    // Перенаправляем пользователя на страницу активного спринта
    navigate('/sprint');
  };

  // Стили для полей формы
  const inputStyle = {
    width: '100%',
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#333',
    fontSize: '14px',
  };

  const formGroupStyle = {
    marginBottom: '20px',
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Заголовок страницы */}
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>
        Панель администратора
      </h1>

      {/* Подзаголовок */}
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
        Создание новой задачи
      </p>

      {/* Форма создания задачи */}
      <form onSubmit={handleSubmit}>
        {/* Обязательные поля - выделены цветом */}
        <div style={{
          padding: '20px',
          backgroundColor: '#fff3e0',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '2px solid #ffb74d',
        }}>
          <h3 style={{ marginTop: 0, color: '#e65100' }}>Обязательные поля</h3>

          {/* Заголовок задачи */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>
              Заголовок задачи <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="text"
              name="title"
              value={taskData.title}
              onChange={handleInputChange}
              placeholder="Введите название задачи"
              style={inputStyle}
              required
            />
          </div>

          {/* Подзаголовок */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>Подзаголовок</label>
            <input
              type="text"
              name="subtitle"
              value={taskData.subtitle}
              onChange={handleInputChange}
              placeholder="Краткое описание"
              style={inputStyle}
            />
          </div>

          {/* Автор */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>
              Автор <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="text"
              name="author"
              value={taskData.author}
              onChange={handleInputChange}
              placeholder="ФИО автора задачи"
              style={inputStyle}
              required
            />
          </div>

          {/* Исполнитель */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>
              Исполнитель <span style={{ color: 'red' }}>*</span>
            </label>
            <Select
              options={userOptions}
              value={taskData.assignee}
              onChange={handleAssigneeChange}
              placeholder="Выберите исполнителя..."
              isClearable
            />
          </div>

          {/* Время выполнения */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>
              Время выполнения (часы) <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="number"
              name="executionTime"
              value={taskData.executionTime}
              onChange={handleInputChange}
              placeholder="Количество часов (или дней, если больше 8)"
              style={inputStyle}
              min="1"
              max="14"
              required
            />
            <small style={{ color: '#666', fontSize: '12px' }}>
              Максимум 8 часов или 14 дней
            </small>
          </div>

          {/* Описание задачи */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>
              Описание задачи <span style={{ color: 'red' }}>*</span>
            </label>
            <textarea
              name="description"
              value={taskData.description}
              onChange={handleInputChange}
              placeholder="Подробное описание задачи (не более 40 символов)"
              style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
              maxLength="40"
              required
            />
            <small style={{ color: '#666', fontSize: '12px' }}>
              Осталось символов: {40 - taskData.description.length}
            </small>
          </div>

          {/* ID задачи */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>
              ID задачи <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="text"
              name="taskId"
              value={taskData.taskId}
              onChange={handleInputChange}
              placeholder="Например: XX-1234, где XX - буквы, 1234 - числа от 1 до 9"
              style={inputStyle}
              pattern="[A-Z]{2}-[1-9]{4}"
              required
            />
            <small style={{ color: '#666', fontSize: '12px' }}>
              Формат: XX-1234 (2 заглавные буквы, тире, 4 цифры от 1 до 9)
            </small>
          </div>
        </div>

        {/* Необязательные поля */}
        <div style={{
          padding: '20px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          marginBottom: '20px',
        }}>
          <h3 style={{ marginTop: 0, color: '#333' }}>Необязательные поля</h3>

          {/* Дополнительные комментарии */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>Дополнительные комментарии</label>
            <textarea
              name="additionalComments"
              value={taskData.additionalComments}
              onChange={handleInputChange}
              placeholder="Дополнительная информация (не более 40 символов)"
              style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
              maxLength="40"
            />
            <small style={{ color: '#666', fontSize: '12px' }}>
              Осталось символов: {40 - taskData.additionalComments.length}
            </small>
          </div>

          {/* Наблюдатели */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>Наблюдатели</label>
            <Select
              options={userOptions}
              value={taskData.observers}
              onChange={handleObserversChange}
              placeholder="Выберите наблюдателей..."
              isMulti
              isClearable
            />
          </div>

          {/* Время окончания спринта */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>Время окончания спринта</label>
            <input
              type="datetime-local"
              name="sprintEndTime"
              value={taskData.sprintEndTime}
              onChange={handleInputChange}
              style={inputStyle}
            />
            <small style={{ color: '#666', fontSize: '12px' }}>
              Валидация: автоматический расчет при установке даты с длительностью
            </small>
          </div>
        </div>

        {/* Важное примечание */}
        <div style={{
          padding: '15px',
          backgroundColor: '#ffebee',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #ef5350',
        }}>
          <p style={{ margin: 0, color: '#c62828', fontSize: '14px' }}>
            <strong>⚠️ ВАЖНО:</strong> Поля ввода должны переиспользоваться. 
            После заполнения формы и создания задачи все поля очищаются.
          </p>
        </div>

        {/* Кнопки управления */}
        <div style={{ 
          display: 'flex', 
          gap: '15px', 
          justifyContent: 'center',
          marginTop: '30px',
        }}>
          {/* Кнопка создания задачи */}
          <button
            type="submit"
            style={{
              padding: '12px 30px',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#fff',
              backgroundColor: '#1976d2',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#1565c0'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#1976d2'}
          >
            Создать задачу
          </button>

          {/* Кнопка отмены */}
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Вы уверены? Все несохраненные данные будут потеряны.')) {
                setTaskData({
                  title: '',
                  subtitle: '',
                  author: '',
                  assignee: null,
                  executionTime: '',
                  description: '',
                  taskId: '',
                  additionalComments: '',
                  observers: [],
                  sprintEndTime: '',
                });
              }
            }}
            style={{
              padding: '12px 30px',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#666',
              backgroundColor: '#e0e0e0',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#d5d5d5'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#e0e0e0'}
          >
            Отменить
          </button>
        </div>
      </form>
    </div>
  );
};

export default Tasks;