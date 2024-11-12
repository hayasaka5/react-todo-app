import React, { useState, useEffect } from 'react';
import add_icon from './assets/add_icon.png';
import styles from './App.module.css';
import search_icon from './assets/search_icon.png';
import TodoItem from './TodoItem';
import delete_all_icon from './assets/delete_all_icon.png';
import trash_icon_white from './assets/trash_icon_white.png';

function App() {
  const [showColors, setShowColors] = useState(false);
  const [todos, setTodos] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isNoTasksModalOpen, setIsNoTasksModalOpen] = useState(false); 
  const [taskToDelete, setTaskToDelete] = useState(null); // Задача для удаления (id или null)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  // Загружаем сохранённые задачи из localStorage при монтировании компонента
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Обрабатываем изменение размера экрана
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Убираем обработчик при размонтировании компонента
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleMouseEnter = () => {
    if (!isMobile) {
      setShowColors(true);
    }
  };
  
  const handleMouseLeave = () => {
    if (!isMobile) {
      setShowColors(false);
    }
  };
  

  const handleDeleteAllClick = () => {
    if (todos.length === 0) {
      setIsNoTasksModalOpen(true);
    } else {
      setTaskToDelete('all'); // Устанавливаем 'all' для удаления всех задач
      setIsModalOpen(true);
    }
  };

  const handleDeleteClick = (id) => {
    setTaskToDelete(id); // Устанавливаем id задачи для удаления
    setIsModalOpen(true); // Открываем модальное окно
  };

  const confirmDeleteAll = () => {
    if (taskToDelete === 'all') {
      localStorage.clear();
      setTodos([]);
    } else {
      const updatedTodos = todos.filter(todo => todo.id !== taskToDelete);
      setTodos(updatedTodos);
      localStorage.setItem('todos', JSON.stringify(updatedTodos));
    }
    setIsModalOpen(false);
    setTaskToDelete(null); // Сбрасываем состояние задачи для удаления
  };

  const cancelDeleteAll = () => {
    setIsModalOpen(false); 
    setTaskToDelete(null); // Сбрасываем задачу для удаления
  };

  const addTodoWithColor = (color) => {
    const newTodo = {
      id: Date.now(),
      text: '',
      date: new Date().toLocaleDateString(),
      color: color,
    };
    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
  };

  const updateTodo = (id, updatedTodo) => {
    const updatedTodos = todos.map(todo => todo.id === id ? { ...todo, ...updatedTodo } : todo);
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const filteredTodos = todos.filter(todo =>
    todo.text.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className={styles.app}>
      <div className={styles.left}>
        <div className={styles.logo}>Todo list</div>
        <div className={styles.add}>

          <img src={add_icon} alt="add_icon" />
        </div>
        <div className={isMobile ? styles.colors_mobile : styles.colors}>

  <div className={styles.color1} onClick={() => addTodoWithColor('#98C1D9')}></div>
  <div className={styles.color2} onClick={() => addTodoWithColor('#3D5A80')}></div>
  <div className={styles.color3} onClick={() => addTodoWithColor('#293241')}></div>
  <div className={styles.color4} onClick={() => addTodoWithColor('#EE6C4D')}></div>
</div>

        <div className={styles.deleteAll} onClick={handleDeleteAllClick}>
          <img src={trash_icon_white} alt="delete_all_icon" />
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.search}>
          <div className={isMobile ? styles.logo_mobile : styles.none}>Todo List</div>
          <div className={styles.search1}><img src={search_icon} alt="search_icon" /> 
          <input 
            type="text" 
            placeholder='Search' 
            value={searchText}
            onChange={handleSearchChange}
          /></div>
          
        </div>

        {todos.length === 0 ? (
          <div className={styles.noTaskMessage}>
            {isMobile ? ( <div className={styles.noTaskMessage}>Use menu below to add a new task :)</div>  ) : (<div className={styles.noTaskMessage}>Use the left menu to add a new task :)</div> )}
           
          </div>  
        ) : (
          <div className={styles.items}>
            {filteredTodos.map((todo) => (
              <TodoItem 
                key={todo.id}
                id={todo.id}
                initialText={todo.text}
                initialDate={todo.date}
                color={todo.color}
                onUpdate={updateTodo}
                onDeleteClick={handleDeleteClick} // Передаем функцию для удаления задачи
              />
            ))}
          </div>
        )}

        {isModalOpen && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <p>
                {taskToDelete === 'all'
                  ? 'You are about to delete all tasks, are you sure?'
                  : 'You are about to delete this task, are you sure?'}
              </p>
              <div className={styles.buttons}>
                <button onClick={confirmDeleteAll} className={styles.delete}>Yes</button>
                <button onClick={cancelDeleteAll} className={styles.cancel}>No</button>
              </div>
            </div>
          </div>
        )}

        {isNoTasksModalOpen && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <p>There are no tasks yet.</p>
              <div className={styles.button}>
                <button onClick={() => setIsNoTasksModalOpen(false)}>Ok</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
