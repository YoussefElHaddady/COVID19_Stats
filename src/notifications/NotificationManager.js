import PushNotification from 'react-native-push-notification';

class NotificationManager {
  configure = (onRegister, onNotification, onOpenNotification) => {
    PushNotification.configure({
      onRegister: function (token) {
        onRegister(token);
        console.log('[NotificationManager] onRegister token:', token);
      },

      // (required) Called when a remote or local notification is opened or received
      onNotification: function (notification) {
        console.log('[NotificationManager] onNotification:', notification);

        // process the notification
        notification.userInteraction = true;

        if (notification.userInteraction) {
          onOpenNotification(notification);
        } else {
          onNotification(notification);
        }

        notification.finish('backgroundFetchResultNoData');
      },

      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  };

  buildNotification = (title, message, data = {}, options = {}) => {
    return {
      autoCancel: true,
      largeIcon: options.largeIcon || 'ic_launcher',
      smallIcon: options.smallIcon || 'ic_launcher',
      bigText: message || '',
      subText: title || '',
      vibrate: options.vibrate || false,
      vibration: options.vibration || 300,
      priority: options.priority || 'high',
      importance: options.importance || 'high',
      data: data,
    };
  };

  showNotification = (title, message, data = {}, options = {}) => {
    PushNotification.localNotification({
      ...this.buildNotification(title, message, data, options),

      title: title || '',
      message: message || '',
      playSound: options.playSound || false,
      soundName: options.soundName || 'default',
      userInteraction: false,
    });
  };

  cancelAllLocalNotifications = () => {
    PushNotification.cancelAllLocalNotifications();
  };

  unregister = () => {
    PushNotification.unregister();
  };
}

export const notificationManager = new NotificationManager();
