function log(isOK, ...args) {
  if (!isOK) {
    return;
  }
  console.log(...args);
}

function isObject(obj) {
  return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
}

function setObjectProperty(obj, key, value) {
  const keys = key.split('.');
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
          current[keys[i]] = {};
      }
      current = current[keys[i]];
  }

  current[keys[keys.length - 1]] = value;
  return obj;
}

function downloadFileByData(data, filename, type) {
  var file = new Blob([data], { type: type });

  if (window.navigator.msSaveOrOpenBlob) { // IE10+
      window.navigator.msSaveOrOpenBlob(file, filename);
  } else { // Others
      var a = document.createElement("a"),
              url = URL.createObjectURL(file);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
      }, 0);
  }
  
}

function downloadFileByUrl(url, filename) {
  var a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
  }, 0);
}

export {
  log,
  isObject,
  setObjectProperty,
  downloadFileByData,
  downloadFileByUrl,
}