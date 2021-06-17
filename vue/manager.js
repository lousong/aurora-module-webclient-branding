import settings from '../../BrandingWebclient/vue/settings'

export default {
  name: 'BrandingWebclient',
  init (appData) {
    settings.init(appData)
  },
  getAdminSystemTabs () {
    return [
      {
        name: 'branding',
        title: 'BRANDINGWEBCLIENT.ADMIN_SETTINGS_TAB_LABEL',
        component () {
          return import('src/../../../BrandingWebclient/vue/components/BrandingAdminSettings')
        },
      },
    ]
  },
}
