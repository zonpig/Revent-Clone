const stringTimeFormat = dateTimeString => {
  const parts = dateTimeString.split(' ');
  const timeParts = parts[3].split(':');
  var amPm = timeParts[2].slice(-2);
  if (Number(amPm) === 0) {
    return `${timeParts[0]}:${timeParts[1]}`;
  } else {
    return `${timeParts[0]}:${timeParts[1]} ${amPm}`;
  }
};

export default stringTimeFormat;
