import React, { useEffect, useState } from 'react';
import styles from './Notification.module.css';

function Notification({ message, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Плавное появление уведомления
    setVisible(true);

    // Начинаем скрывать через 3 секунды
    const hideTimer = setTimeout(() => {
      setVisible(false); // Начинаем плавное исчезновение
    }, 3000);

    // Убираем компонент через 0.5 секунд после начала исчезновения (длительность анимации)
    const closeTimer = setTimeout(onClose, 3500); // 3000ms (показ) + 500ms (анимация)

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(closeTimer);
    };
  }, [onClose]);

  return (
    <div className={`${styles.notification} ${visible ? styles.show : styles.hide}`}>
      {message}
    </div>
  );
}

export default Notification;
