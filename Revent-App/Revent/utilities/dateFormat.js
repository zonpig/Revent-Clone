const dateFormat = datex => {
  let t = new Date(datex * 1000);
  const date = ('0' + t.getDate()).slice(-2);
  const month = ('0' + (t.getMonth() + 1)).slice(-2);
  const year = t.getFullYear();
  const day = t.getDay();

  const monthNames = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
  ];

  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  // const hours = ('0' + t.getHours()).slice(-2);
  // const minutes = ('0' + t.getMinutes()).slice(-2);
  // const seconds = ('0' + t.getSeconds()).slice(-2);
  const newDate = `${dayNames[day]}, ${date} ${monthNames[month - 1]} ${year}`;

  return newDate;
};

export default dateFormat;
