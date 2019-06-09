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
export function NewDate(format = 'DD/MM/YYYY hh:mm:ss') {
  if (format === 'full') return moment().format()
  if (format === 'datetime') return moment().format('DD/MM/YYYY hh:mm:ss')
  if (format === 'date') return moment().format('DD/MM/YYYY')
  if (format === 'time') return moment().format('hh:mm:ss')
  else return moment().format(format)
}
export function FixEditor($this) {
  $this.$refs.modalCRUD.$el.children[0].children[0].children[0].children[0].removeAttribute('tabindex')
}
String.prototype.convertToAscii = function() {
  // let $this = String(this)
  if (!this) return this;
  return this.toLowerCase()
    .replace(/[ ]/g, '_')
    // .replace('[', '')
    // .replace(']', '')
    .replace(/[áàãạảâầấậẫẩăằắẵặẳ]/g, 'a')
    .replace(/[èéẹẽẻêếềễểệ]/g, 'e')
    .replace(/[ìíịỉĩ]/g, 'e')
    .replace(/[òóõọỏôỗộồốổơỡờớợỡở]/g, 'o')
    .replace(/[ùúụũủưừứựữử]/g, 'u')
    .replace(/[ýỳỹỷỵ]/g, 'y')
    .replace(/[đ]/g, 'd')
    .replace(/[~\`!@#$%^&*()--+={}\\|;:\'\"<,>.?/”“‘’„‰‾–—]/g, '')
}
String.prototype.removeChars = function() {
  let $this = String(this)
  if (!$this) return $this;
  return $this.replace(/[~`!@#$%^&*()\[{}\]\\|;:\'\",<>./?]/g, '');
}
String.prototype.formatDate = function(format = 'DD/MM/YYYY hh:mm') {
  if (!this) return this
  if (typeof val === 'object' && this.constructor.name === 'Timestamp')
    return moment(this.toDate()).format(format)
  else
    return moment(this).format(format)
}
export function FilesToString(files, chars = ',') {
  let rs = ''
  if (!files) return rs
  if (files.length < 1) return rs
  rs = chars
  files.forEach(x => {
    rs += x.url + chars
  })
  return rs
}
export function StringToFiles(str, chars = ',') {
  let rs = []
  if (!str) return rs
  this.trim(str, chars)
    .split(',')
    .forEach(x => {
      rs.push({
        url: x,
        name: this.StringToName(x),
        extension: this.getExt(x)
      })
    })
  return rs
}
// String prototype
String.prototype.stringToName = function() {
  let $this = String(this)
  $this = $this.split('/')
  return $this[$this.length - 1].split('.')[0]
}
String.prototype.filesToHtml = function(str = '') {
  let $this = String(this)
  $this.forEach(x => {
    if (this.isImage(x.url)) str += `<p><img src='${x.url}' class='img-fluid' title='${x.name}'></p>`
    else str += `<p><a href='${x.url}'>${x.name}</a></p>`
  })
  return str
}
String.prototype.trimLeft = function(chars = ' ') {
  let $this = String(this)
  if (Array.isArray(chars)) {
    chars.forEach(e => { $this = $this.replace(new RegExp(`^[${e}]+`), '') })
  } else
    return $this.replace(new RegExp(`^[${chars}]+`), '')
}
String.prototype.trimRight = function(chars = ' ') {
  let $this = String(this)
  if (Array.isArray(chars)) {
    chars.forEach(e => { $this = $this.replace(new RegExp(`[${chars}]+$`), '') })
  } else
    return $this.replace(new RegExp(`[${chars}]+$`), '')
}
String.prototype.trim = function(chars = ' ') {
  let $this = String(this)
  return $this.trimLeft(chars).trimRight(chars)
}
String.prototype.toUpperCaseFirst = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}
String.prototype.toLowerCaseFirst = function() {
  return this.charAt(0).toLowerCase() + this.slice(1);
}
Number.prototype.format = function(n, x) {
  var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
  return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
};
String.prototype.format = function() {
  if (arguments.length > 0 && typeof arguments[0] === 'object') {
    let $this = this
    arguments[0].forEach(e => {
      $this = $this.replace(/%s/, e)
    });
    return $this
  }
  return [...arguments].reduce((p, c) => p.replace(/%s/, c), this);
};
String.prototype.formatKey = function() {
  var formatted = this;
  for (var prop in arguments[0]) {
    var regexp = new RegExp('\\{' + prop + '\\}', 'gi');
    formatted = formatted.replace(regexp, arguments[0][prop])
  }
  return formatted
}
if (!String.prototype.formatNumber) {
  String.prototype.formatNumber = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined' ? args[number] : match
    })
  }
}
String.prototype.getExt = function(dot = true) {
  let $this = this
  if (!$this) return ''
  let regx = /(?:\.([^.]+))?$/;
  $this = regx.exec($this)
  return $this ? (dot ? $this[0] : $this[1]) : '';
}
String.prototype.isImage = function() {
  let $this = this
  if (!$this) return false
  return /\.(gif|jpg|jpeg|tiff|png)$/i.test($this.toLowerCase())
}
String.prototype.isAudio = function() {
  let $this = this
  if (!$this) return false
  return /\.(mp3|wav|wave|ogg|m4a|3ga|4mp|aa3)$/i.test($this.toLowerCase())
}
String.prototype.isVideo = function() {
  let $this = this
  if (!$this) return false
  return /\.(3g2|3gp|3gp2|3gpp|3gpp2|amv|flv|gom|mp4|mov|mpe|mpeg|mpg||kmv|mkv|wvm|wmv)$/i.test($this.toLowerCase())
}
String.prototype.isPdf = function() {
  let $this = this
  if (!$this) return false
  return /\.(pdf)$/i.test($this.toLowerCase());
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

function sprintf() {
  var args = arguments,
    string = args[0],
    i = 1;
  return string.replace(/%((%)|s|d)/g, function(m) {
    // m is the matched format, e.g. %s, %d
    var val = null;
    if (m[2]) {
      val = m[2];
    } else {
      val = args[i];
      // A switch statement so that the formatter can be extended. Default is %s
      switch (m) {
        case '%d':
          val = parseFloat(val);
          if (isNaN(val)) {
            val = 0;
          }
          break;
      }
      i++;
    }
    return val;
  });
}
// Array prototype
Array.prototype.last = function() {
  if (this.length > 0)
    return this[this.length - 1]
  return this
};
Array.prototype.indexOfArray = function(element) {
  let $this = this
  for (let i = 0; i < element.length; i++) {
    let index = $this.indexOf(element[i])
    if (index > -1) return index
  }
  return -1
};
Array.prototype.update = function(element, key = null) {
  let $this = this
  if (key) {
    if (Array.isArray(element)) {
      return $this.forEach(source => {
        var destination = element.find(x => x[key] = source[key])
        if (destination) {
          Object.keys(source).forEach(function(keyobj, index) {
            // if (typeof source[keyobj] !== 'object')
            if (destination[keyobj] !== undefined) {
              source[keyobj] = destination[keyobj]
            }
          })
        }
      })
    } else {
      return $this.forEach(source => {
        if (source[key] === element[key]) {
          Object.keys(source).forEach(function(keyobj, index) {
            // if (typeof source[keyobj] !== 'object')
            if (element[keyobj] !== undefined) source[keyobj] = element[keyobj]
          })
        }
      })
    }
  } else {
    if (Array.isArray(element)) {
      element.forEach(e => {
        const index = $this.indexOf(e)
        if (index > -1) $this.splice(index, 1, element)
      })
    } else {
      const index = $this.indexOf(element)
      if (index > -1) $this.splice(index, 1, element)
    }
  }
  return $this
};
Array.prototype.updateKey = function(element, ) {
  if (Array.isArray(element)) {
    element.forEach(e => {
      const index = this.indexOf(e)
      if (index > -1) this.splice(index, 1, element)
    })
  } else {
    this.array.forEach(e => {
      Object.keys(e).forEach(function(key, index) {
        if (typeof e[key] === 'object') {
          e[key] = element[key]
        }
      });
    })
  }
  return this
}
Array.prototype.remove = function(element, key = null) {
  if (key) {
    if (Array.isArray(element)) {
      element.forEach(e => {
        const index = this.findIndex((x) => { return x[key] === e[key] })
        if (index > -1) this.splice(index, 1)
      })
    } else {
      const index = this.findIndex((x) => { return x[key] === element[key] })
      if (index > -1) this.splice(index, 1)
    }
  } else {
    if (Array.isArray(element)) {
      element.forEach(e => {
        const index = this.indexOf(e)
        if (index > -1) this.splice(index, 1)
      })
    } else {
      const index = this.indexOf(element)
      if (index > -1) this.splice(index, 1)
    }
  }
  return this
};
Array.prototype.pushIfNotExist = function(element, comparer = null) {
  if (comparer) {
    if (this.indexOf(comparer) < 0) this.push(element);
  } else {
    if (Array.isArray(element)) {
      element.forEach(e => {
        if (this.indexOf(e) < 0) this.push(e);
      });
    } else {
      if (this.indexOf(element) < 0) this.push(element);
    }
  }
  return this
};
Array.prototype.filterValue = function(obj) {
  let $this = this
  if ($this.length < 1 || !obj) return $this
  Object.keys(obj).forEach(function(key, index) {
    let _key = key.toLowerCase()
    $this = $this.filter(row => { return row[_key] === obj[_key] })
  })
  return $this
}
Array.prototype.searchValue = function(search) {
  let $this = this
  if ($this.length < 1 || !search) return $this
  $this.filter(function(row) {
    return Object.keys(row).some(function(key) {
      return (String(row[key]).toLowerCase().indexOf(search) > -1)
    })
  })
  return $this
}
Array.prototype.sortByKey = function(sortBy, direction = 'asc') {
  if (this.length < 1 || !sortBy) return this
  direction = direction === 'asc' ? 1 : -1
  return this.slice().sort(function(a, b) {
    a = a[sortBy]
    b = b[sortBy]
    return (a === b ? 0 : a > b ? 1 : -1) * direction
  })
}
// const object1 = new Object();
// console.log(object1.hasOwnProperty('getRule'));
Array.prototype.getRule = function(element, prefix = 'error') {
  if (!element) return null
  const rs = this.filter(e => e.field === element)
  return rs.length > 0 ? (prefix ? `${prefix}.${rs[0].rule}` : rs[0].rule) : null
};
// Object.prototype.isEmpty = function() {
//   for (let key in this) {
//     if (this.hasOwnProperty(key))
//       return false;
//   }
//   return true;
// }

// onlyUnique Array
export function onlyUnique(value, index, self) {
  // console.log(value)
  return self.indexOf(value) === index;
}
export function distinctArry(arr) {
  return [...new Set(arr)]
}
export function distinctArrayObject(arr, key) {
  return [...new Set(arr.map(x => x[key]))]
}
export function ConvertObject(data, ignore = 'id', removeNull = true) {
  let obj = {}
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
// FormData.prototype.push = function(obj) {
//   let $this = this
//   if (!obj) return $this
//   Object.keys(obj).forEach(function(key, index) {
//     $this.append(key, obj[key])
//   })
//   return $this
// }
export function ObjectToLowerKey(obj) {
  if (!obj) return obj
  if (Array.isArray(obj)) {
    let _arr = new Array()
    obj.forEach(e => {
      let _obj = new Object()
      Object.keys(e).forEach(function(key, index) {
        let _key = key.toLowerCase()
        _obj[_key] = e[key]
      })
      _arr.push(_obj)
    });
    return _arr
  } else {
    let _obj = new Object()
    Object.keys(obj).forEach(function(key, index) {
      let _key = key.toLowerCase()
      _obj[_key] = obj[key]
    })
    return _obj
  }
}
export function ObjectToFillSource(source, destination) {
  if (!source || !destination) return source
  destination = ObjectToLowerKey(destination)
  Object.keys(source).forEach(function(key, index) {
    let _key = key.toLowerCase()
    if (typeof source[_key] === 'object') {
      // if (source[key].name) rs += `${obj[key].name}=${obj[key].value}&`
    } else {
      source[_key] = destination[_key]
      // if (source[key].toString().length > 0) rs += `${key}=${obj[key]}&`
    }
  })
  return source
}
