export default {
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
