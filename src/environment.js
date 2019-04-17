const env = {
  production: false,
  api: ['http://localhost:5000', 'api'],
  upload: 'filemanager',
  baseUrl: [window.location.origin, '/'],
  publicPath: '/',
  outputDir: '/dist'
} //environment
if (process.env.NODE_ENV === 'production') {
  env.production = true
  env.api = ['http://10.17.20.99/vnpt', 'api']
  env.upload = 'filemanager'
  env.baseUrl = [window.location.origin, '/portal/']
  env.publicPath = '/portal/'
  env.outputDir = 'D:/Application/portal-vue'
}
export { env }
