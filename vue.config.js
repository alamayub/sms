module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  pages: {
    index: {
      entry: 'src/main.js',
      title: 'SMS'
    }
  },
  pwa: {
    name: 'SMS',
    themeColor: '#502989',
    msTileColor: '#502989',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'default',
    manifestPath: 'manifest.json',
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'service-worker.js',
      exclude: ['_redirects'],
    }
  }
}
