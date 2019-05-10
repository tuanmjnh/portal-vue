
export default {
    get(params) {
        // console.log(params)
        let rs = '?'
        if (!params) return ''
        Object.keys(params).forEach(function(key, index) {
            // console.log(key, typeof params[key])
            if (Array.isArray(params[key])) {
                params[key].forEach(e => {
                    // console.log(params[key], key, e)
                    if (e) rs += `${key}=${e}&`
                })
            }
            else if (params[key] && typeof params[key] === 'object' && params[key].constructor === Object) {
                Object.keys(params[key]).forEach(function(obj_key, index) {
                    if (params[key][obj_key]) rs += `${obj_key}=${params[key][obj_key]}&`
                })
            }
            else
                if (params[key] && params[key].toString().length > 0)
                    if (params[key]) rs += `${key}=${params[key]}&`
        })
        return rs.substr(0, rs.length - 1)
    }
}