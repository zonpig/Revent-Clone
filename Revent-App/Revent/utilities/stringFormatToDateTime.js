const stringFormatToDateTime = stringDateTime => {
  var obj = Date.parse(stringDateTime);
  console.log(obj);
  return obj;
};

export default stringFormatToDateTime;
