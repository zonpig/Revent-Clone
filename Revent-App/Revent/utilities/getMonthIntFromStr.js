const getMonthIntFromStr = month => {
  var monthInt;
  month = month.trim();
  month = month.toLowerCase();

  if (month === 'january') {
    monthInt = 1;
  } else if (month === 'february') {
    monthInt = 2;
  } else if (month === 'march') {
    monthInt = 3;
  } else if (month === 'april') {
    monthInt = 4;
  } else if (month === 'may') {
    monthInt = 5;
  } else if (month === 'june') {
    monthInt = 6;
  } else if (month === 'july') {
    monthInt = 7;
  } else if (month === 'august') {
    monthInt = 8;
  } else if (month === 'september') {
    monthInt = 9;
  } else if (month === 'october') {
    monthInt = 10;
  } else if (month === 'november') {
    monthInt = 11;
  } else if (month === 'december') {
    monthInt = 12;
  } else {
    throw new Error('invalid month: ' + month);
  }

  return monthInt;
};

export default getMonthIntFromStr;
