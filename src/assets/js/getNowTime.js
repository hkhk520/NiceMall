// 小于10，补零
function fullZero(num) {
  return num < 10 ? "0" + num : num;
};

// 格式化时间
export function parseDate() {
  let time = new Date();
  let year = time.getFullYear();
  let month = fullZero(time.getMonth() + 1);
  let date = fullZero(time.getDate());
  let hour = fullZero(time.getHours());
  let minute = fullZero(time.getMinutes());
  let second = fullZero(time.getSeconds());
  return `${year}-${month}-${date} ${hour}:${minute}:${second}`;
};

