//경고 알림창 설정
import { useEffect, useRef } from "react";
import warning from "../icons/lucide/warning.png";

const usePushNotification = () => {
  const notificationRef = useRef(null);

  useEffect(() => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    } else if (Notification.permission !== "granted") {
      Notification.requestPermission().catch((error) => {
        console.error("Notification permission error:", error);
      });
    }
  }, []);

  const setNotificationClickEvent = () => {
    notificationRef.current.onclick = (event) => {
      event.preventDefault();
      window.focus();
      notificationRef.current.close();
    };
  };

  const warningNotification = (title, options = {}) => {
    if (Notification.permission !== "granted") return;

    const newOption = {
      badge: "",
      icon: warning,
      ...options
    };

    notificationRef.current = new Notification(title, newOption);
    setNotificationClickEvent();
  };

  return { warningNotification };
};

export default usePushNotification;
