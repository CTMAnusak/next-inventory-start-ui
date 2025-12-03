/**
 * Thai Date Utilities - UI Only Version
 * จัดรูปแบบวันที่และเวลาสำหรับแสดงผล
 */

/**
 * Format date for Equipment Tracking display
 */
export function formatEquipmentTrackingDate(date: Date | string | number) {
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      return { dateString: '-', timeString: '-' };
    }

    // Format date: DD/MM/YYYY
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    const dateString = `${day}/${month}/${year}`;

    // Format time: HH:MM
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;

    return { dateString, timeString };
  } catch (error) {
    console.error('Error formatting date:', error);
    return { dateString: '-', timeString: '-' };
  }
}

/**
 * Format date to Thai format with time
 */
export function formatThaiDateTime(date: Date | string | number) {
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      return '-';
    }

    return dateObj.toLocaleString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '-';
  }
}

/**
 * Format date to Thai format (date only)
 */
export function formatThaiDate(date: Date | string | number) {
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      return '-';
    }

    return dateObj.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '-';
  }
}

/**
 * Format time (HH:MM)
 */
export function formatTime(date: Date | string | number) {
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      return '-';
    }

    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    
    return `${hours}:${minutes}`;
  } catch (error) {
    console.error('Error formatting time:', error);
    return '-';
  }
}

