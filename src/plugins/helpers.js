import * as moment from 'moment'
export function wait(ms) {
  return x => {
    return new Promise(resolve => setTimeout(() => resolve(x), ms))
  }
}
export function NewGuid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return (
    s4() +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    s4() +
    s4()
  );
}
export function ConvertToAscii(str) {
  if (!str) return '';
  return (str = str
    .toLowerCase()
    .replace('[', '')
    .replace(']', '')
    .replace(/[áàãạảâầấậẫẩăằắẵặẳ]/g, 'a')
    .replace(/[èéẹẽẻêếềễểệ]/g, 'e')
    .replace(/[ìíịỉĩ]/g, 'e')
    .replace(/[òóõọỏôỗộồốổơỡờớợỡở]/g, 'o')
    .replace(/[ùúụũủưừứựữử]/g, 'u')
    .replace(/[ýỳỹỷỵ]/g, 'y')
    .replace(/[đ]/g, 'd')
    .replace(/[~\`!@#$%^&*()-_+={}\\|;:\'\"<,>.?/”“‘’„‰‾–—]/g, ''));
}
export function RemoveChars(str) {
  if (!str) return '';
  return (str = str
    .toLowerCase()
    .replace(/[~`!@#$%^&*()\[{}\]\\|;:\'\",<>./?]/g, ''));
}
export function NewDate(format = 'DD/MM/YYYY hh:mm:ss') {
  if (format === 'full') return moment().format()
  if (format === 'datetime') return moment().format('DD/MM/YYYY hh:mm:ss')
  if (format === 'date') return moment().format('DD/MM/YYYY')
  if (format === 'time') return moment().format('hh:mm:ss')
  else return moment().format(format)
}
export function FormatDate(val, format = 'DD/MM/YYYY hh:mm') {
  if (!val) return ''
  if (typeof val === 'object' && val.constructor.name === 'Timestamp')
    return moment(val.toDate()).format(format)
  else
    return moment(val).format(format)
}
export function FixEditor($this) {
  $this.$refs.modalCRUD.$el.children[0].children[0].children[0].children[0].removeAttribute('tabindex')
}
export function FilesToString(files, chars = ',') {
  var rs = ''
  if (!files) return rs
  if (files.length < 1) return rs
  rs = chars
  files.forEach(x => {
    rs += x.url + chars
  })
  return rs
}
export function StringToFiles(str, chars = ',') {
  var rs = []
  if (!str) return rs
  this.trim(str, chars)
    .split(',')
    .forEach(x => {
      rs.push({
        url: x,
        name: this.StringToName(x),
        extension: this.getExtension(x)
      })
    })
  return rs
}
export function StringToName(str) {
  var x = str.split('/')
  x = x[x.length - 1].split('.')[0]
  return x
}
export function FilesToHtml(files, str = '') {
  files.forEach(x => {
    if (this.isImage(x.url)) str += `<p><img src='${x.url}' class='img-fluid' title='${x.name}'></p>`
    else str += `<p><a href='${x.url}'>${x.name}</a></p>`
  })
  return str
}
export function trimLeft(str, chars = ' ') {
  if (!str) return ''
  return str.replace(new RegExp('^[' + chars + ']+'), '')
}
export function trimRight(str, chars = ' ') {
  if (!str) return ''
  return str.replace(new RegExp('[' + chars + ']+$'), '')
}
export function trim(str, chars = ' ') {
  if (!str) return ''
  return this.trimRight(this.trimLeft(str, chars), chars)
}
export function isImage(str) {
  if (!str) return false
  return /\.(gif|jpg|jpeg|tiff|png)$/i.test(str.toLowerCase())
}
export function isAudio(str) {
  if (!str) return false
  return /\.(mp3|wav|wave|ogg|m4a|3ga|4mp|aa3)$/i.test(str.toLowerCase())
}
export function isVideo(str) {
  if (!str) return false
  return /\.(3g2|3gp|3gp2|3gpp|3gpp2|amv|flv|gom|mp4|mov|mpe|mpeg|mpg||kmv|mkv|wvm|wmv)$/i.test(str.toLowerCase())
}
export function isPdf(str) {
  if (!str) return false;
  return /\.(pdf)$/i.test(str.toLowerCase());
}
export function getExtension(str, dot = true) {
  if (!str) return ''
  var re = /(?:\.([^.]+))?$/;
  var rs = re.exec(str)
  return rs ? (dot ? rs[0] : rs[1]) : '';
}
export function GetImage(file) {
  return new Promise((resolve, reject) => {
    const fReader = new FileReader();
    const img = document.createElement('img');
    fReader.onload = () => {
      img.src = fReader.result;
      resolve(GetBase64Image(img));
    };
    fReader.readAsDataURL(file);
  });
}
export function GetBase64Image(img) {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  const dataURL = img.src;
  return dataURL;
}
export function ObjectToQuery(obj) {
  var rs = '?'
  if (!obj) return rs
  Object.keys(obj).forEach(function(key, index) {
    if (typeof obj[key] === 'object') {
      if (obj[key].name) rs += `${obj[key].name}=${obj[key].value}&`
    } else {
      if (obj[key].toString().length > 0) rs += `${key}=${obj[key]}&`
    }
  })
  return rs.substr(0, rs.length - 1)
}
export function ConvertObject(data, ignore = 'id', removeNull = true) {
  var obj = {}
  if (!data) return obj
  if (ignore) {
    Object.keys(data).forEach(function(key, index) {
      if (key !== ignore) {
        if (data[key]) {
          obj[key] = data[key]
        } else {
          if (!removeNull) obj[key] = null
        }
      }
    })
  } else {
    Object.keys(data).forEach(function(key, index) {
      if (data[key]) {
        obj[key] = data[key]
      } else {
        if (!removeNull) obj[key] = null
      }
    })
  }
  return obj
}
export function ObjectToFormData(obj, formData) {
  if (!formData) formData = new FormData()
  if (!obj) return formData
  Object.keys(obj).forEach(function(key, index) {
    formData.append(key, obj[key])
  })
  return formData
}
export function ObjectToLowerKey(obj) {
  if (!obj) return obj
  if (Array.isArray(obj)) {
    var _arr = new Array()
    obj.forEach(e => {
      var _obj = new Object()
      Object.keys(e).forEach(function(key, index) {
        var _key = key.toLowerCase()
        _obj[_key] = e[key]
      })
      _arr.push(_obj)
    });
    return _arr
  } else {
    var _obj = new Object()
    Object.keys(obj).forEach(function(key, index) {
      var _key = key.toLowerCase()
      _obj[_key] = obj[key]
    })
    return _obj
  }
}
export function ObjectToFillSource(source, destination) {
  if (!source || !destination) return source
  destination = ObjectToLowerKey(destination)
  Object.keys(source).forEach(function(key, index) {
    var _key = key.toLowerCase()
    if (typeof source[_key] === 'object') {
      // if (source[key].name) rs += `${obj[key].name}=${obj[key].value}&`
    } else {
      source[_key] = destination[_key]
      // if (source[key].toString().length > 0) rs += `${key}=${obj[key]}&`
    }
  })
  return source
}
