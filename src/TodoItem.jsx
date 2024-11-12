import React, { useState, useEffect } from 'react';
import styles from './Todoitem.module.css';
import pencil_icon from './assets/pencil_icon.png';
import save_icon from './assets/save_icon.png';
import trash_icon from './assets/close_icon.png';
import Notification from './Notification';

function TodoItem({ initialText = '', initialDate = '', color, id, onUpdate, onDeleteClick }) {
  const [text, setText] = useState(initialText);
  const [date, setDate] = useState(initialDate || new Date().toLocaleDateString());
  const [isEditing, setIsEditing] = useState(true);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const savedTodo = JSON.parse(localStorage.getItem(`todo-${id}`));
    if (savedTodo) {
      setText(savedTodo.text);
      setDate(savedTodo.date);
      setIsEditing(savedTodo.isEditing ?? true);
    }
  }, [id]);

  const handleTextChange = (e) => {
    const newText = e.target.value; // Определяем newText из события

    // Логика показа уведомления
    if (newText.length >= 80) {
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false); // Убираем уведомление через 3 секунды
      }, 3000);
    } else {
      setShowNotification(false); // Убираем уведомление, если текст снова становится меньше лимита
    }

    setText(newText); // Обновляем текст в состоянии
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    const currentDate = new Date().toLocaleDateString();
    setDate(currentDate);

    const updatedTodo = { text, date, isEditing: false };
    localStorage.setItem(`todo-${id}`, JSON.stringify(updatedTodo));
    onUpdate(id, updatedTodo);
  };

  const handleDeleteClick = () => {
    onDeleteClick(id); // Вызываем функцию удаления из родителя
  };

  return (
    <div className={styles.item} style={{ backgroundColor: color }}>
      {isEditing ? (
        <textarea
          value={text}
          onChange={handleTextChange}
          maxLength={80} // Устанавливаем максимальную длину
        />
      ) : (
        <p>{text}</p>
      )}

      <div className={styles.bottom}>
        {date}
        <div className={styles.editButton_2} onClick={handleDeleteClick}>
          <img src={trash_icon} alt="Delete" />
        </div>
        <div className={styles.editButton} onClick={isEditing ? handleSave : handleEditClick}>
          <img src={isEditing ? save_icon : pencil_icon} alt="Edit/Save" />
        </div>
      </div>
      {showNotification && (
        <Notification 
          message="Too many characters"
          onClose={() => setShowNotification(false)} 
        />
      )}
    </div>
  );
}

export default TodoItem;
