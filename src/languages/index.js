import * as _store from '@/plugins/storage'
import vi_VN from './vi-VN.json'
import en_US from './en-US.json'
// Data languages
const data = [
    {
        code: 'vi-VN',
        title: 'Tiếng Việt',
        icon: '<i class="material-icons">outlined_flag</i>',
        orders: 1,
        dictionary: vi_VN
    },
    {
        code: 'en-US',
        title: 'English - United States',
        icon: '<i class="material-icons">outlined_flag</i>',
        orders: 1,
        dictionary: en_US
    },
]
// Default
const config = {
    default: process.env.LANGUAGES_DEFAULT || 'vi-VN'
}
let current = {}
function initialize() {
    return new Promise((resolve, reject) => {
        let lang = _store.Get('language')
        if (!lang) {
            _store.Set('language', config.default)
            lang = _store.Get('language')
        }
        current = data.find((x) => { return x.code === lang })
        resolve()
        reject()
    })
}
async function startup() {
    try {
        await initialize()
    } catch (err) {
        console.log(err)
    }
}
startup()
// const current = function() {
//     return _store.Get('language')
// }
const getValue = function(data, items, i = 0) {
    if (i < items.length) {
        if (!data[items[i]]) return items.join('.')
        return getValue(data[items[i]], items, i + 1)
    }
    return data ? data : items.join('.')
}
export default {
    data: data,
    current: current,
    code: current.code,
    getLang: () => {
        const data = _store.Get('language')
        if (data) return data
        else {
            _store.Set('language', config.default)
            return config.default
        }
    },
    setLang: (val) => {
        return new Promise((resolve, reject) => {
            _store.Set('language', val)
            startup()
            resolve(true)
            reject(false)
        })
    },
    // all: data[current()],
    get: (val) => {
        if (!val) return val
        const rs = current.dictionary
        if (!rs) return val
        if (Array.isArray(val)) {
            let rs = ''
            val.forEach(e => {
                if (!e) rs += e
                else rs += getValue(current.dictionary, e.split('.'))
            })
            return rs
        } else return getValue(current.dictionary, val.split('.'))
    }
}
