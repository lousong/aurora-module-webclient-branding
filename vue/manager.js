import settings from '../../BrandingWebclient/vue/settings'

export default {
  moduleName: 'BrandingWebclient',

  requiredModules: [],

  init (appData) {
    settings.init(appData)
  },

  getAdminSystemTabs () {
    return [
      {
        tabName: 'branding',
        title: 'BRANDINGWEBCLIENT.ADMIN_SETTINGS_TAB_LABEL',
        component () {
          return import('src/../../../BrandingWebclient/vue/components/BrandingAdminSettings')
        },
      },
    ]
  },
  getAdminTenantTabs () {
    return [
      {
        tabName: 'branding',
        paths: [
          'id/:id/branding',
          'search/:search/id/:id/branding',
          'page/:page/id/:id/branding',
          'search/:search/page/:page/id/:id/branding',
        ],
        title: 'BRANDINGWEBCLIENT.ADMIN_SETTINGS_TAB_LABEL',
        component () {
          return import('src/../../../BrandingWebclient/vue/components/BrandingAdminSettingsPerTenant')
        },
      }
    ]
  }
}
