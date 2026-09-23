/**
 * notificationService.js
 * Admin Notifications & Real-Time Alert Center for NACOS FUTO
 * Alerts administrators when new businesses, courses, resources, clubs, or alumni register.
 */

const NOTIFICATIONS_STORAGE_KEY = 'nacos_admin_notifications_db';

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    type: 'yellow_pages',
    title: 'New Business Pending Approval',
    message: 'Peacemaker Tech submitted a new student business profile for directory listing.',
    entityId: 'yp-7',
    link: '/admin/yellow-pages',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString() // 25 mins ago
  },
  {
    id: 'notif-2',
    type: 'course',
    title: 'New Course Curriculum Added',
    message: 'A new track "Modern Web Engineering with React & Node.js" has been registered.',
    entityId: 'course-1',
    link: '/courses',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString() // 2 hrs ago
  },
  {
    id: 'notif-3',
    type: 'alumni',
    title: 'New Alumni Network Request',
    message: 'Godfirst Asogwa (Lead Software Engineer) requested to join the Alumni Directory.',
    entityId: 'alm-1',
    link: '/admin/alumni',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString() // 4 hrs ago
  },
  {
    id: 'notif-4',
    type: 'resource',
    title: 'New Academic Resource Uploaded',
    message: 'MTH 201 Past Questions & Handout was uploaded to Backblaze B2 storage.',
    entityId: 'res-mth201',
    link: '/resources',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 720).toISOString() // 12 hrs ago
  }
];

export function getAdminNotifications() {
  if (typeof window === 'undefined') return INITIAL_NOTIFICATIONS;
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Error reading admin notifications:', err);
    return INITIAL_NOTIFICATIONS;
  }
}

export function addAdminNotification({ type, title, message, entityId = null, link = '/admin' }) {
  const notifs = getAdminNotifications();
  const newNotif = {
    id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type,
    title,
    message,
    entityId,
    link,
    isRead: false,
    createdAt: new Date().toISOString()
  };

  const updated = [newNotif, ...notifs];
  if (typeof window !== 'undefined') {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('nacos_notification_added', { detail: newNotif }));
  }
  return newNotif;
}

export function markNotificationRead(id) {
  const notifs = getAdminNotifications();
  const updated = notifs.map(n => n.id === id ? { ...n, isRead: true } : n);
  if (typeof window !== 'undefined') {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('nacos_notifications_updated'));
  }
  return updated;
}

export function markAllNotificationsRead() {
  const notifs = getAdminNotifications();
  const updated = notifs.map(n => ({ ...n, isRead: true }));
  if (typeof window !== 'undefined') {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('nacos_notifications_updated'));
  }
  return updated;
}

export function getUnreadNotificationCount() {
  const notifs = getAdminNotifications();
  return notifs.filter(n => !n.isRead).length;
}
