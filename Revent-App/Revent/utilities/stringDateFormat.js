const stringDateFormat = dateTimeString => {
  const parts = dateTimeString.split(' ');
  return `${parts[0]} ${parts[1]} ${parts[2]}`;
};

export default stringDateFormat
