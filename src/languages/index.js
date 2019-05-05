import * as _store from '@/plugins/storage'
import vi_VN from './vi-VN.json'
import en_US from './en-US.json'

const data = {
    "vi-VN": vi_VN,
    "en-US": en_US
}
const current = function () {
    return _store.Get('language')
}
const getValue = function (data, items, i = 0) {
    if (i < items.length)
        return getValue(data[items[i]], items, i + 1)
    return data
}
export default {
    current: current(),
    getLang: (defaults) => {
        const data = _store.Get('language')
        if (data) return data
        else {
            _store.Set('language', defaults)
            return defaults
        }
    },
    setLang: (val) => {
        return new Promise((resolve, reject) => {
            _store.Set('language', val)
            resolve(true)
            reject(false)
        })
    },
    // all: data[current()],
    get: (val) => {
        const rs = data[current()]
        if (rs) return getValue(data[current()], val.trim().split('.'))
        else return val
    }
}
