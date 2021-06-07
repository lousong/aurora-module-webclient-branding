<template>
  <q-scroll-area class="full-height full-width">
    <div class="q-pa-lg ">
      <div class="row q-mb-md">
        <div class="col text-h5">{{ $t('BRANDINGWEBCLIENT.HEADING_SETTINGS_TAB') }}</div>
      </div>
      <q-card flat bordered class="card-edit-settings">
        <q-card-section>
          <div class="row q-mb-md">
            <div class="col-1">{{ $t('BRANDINGWEBCLIENT.LOGIN_LOGO_URL_LABEL') }}</div>
            <div class="col-5">
              <q-input outlined dense class="bg-white" v-model="sLoginLogoUrl" />
            </div>
          </div>
          <div class="row q-mb-md">
            <div class="col-1">{{ $t('BRANDINGWEBCLIENT.TABSBAR_LOGO_URL_LABEL') }}</div>
            <div class="col-5">
              <q-input outlined dense class="bg-white" v-model="sTabsBarLogoUrl" />
            </div>
          </div>
        </q-card-section>
      </q-card>
      <div class="q-pa-md text-right">
        <q-btn unelevated no-caps dense class="q-px-sm" :ripple="false" color="primary"
               :label="saving ? $t('COREWEBCLIENT.ACTION_SAVE_IN_PROGRESS') : $t('COREWEBCLIENT.ACTION_SAVE')" @click="saveBrandingsSettings"/>
      </div>
    </div>
    <UnsavedChangesDialog ref="unsavedChangesDialog" />
  </q-scroll-area>
</template>

<script>
import webApi from "../../../AdminPanelWebclient/vue/src/utils/web-api";
import settings from "../../../BrandingWebclient/vue/settings";
import notification from "../../../AdminPanelWebclient/vue/src/utils/notification";
import errors from "../../../AdminPanelWebclient/vue/src/utils/errors";
import UnsavedChangesDialog from 'src/components/UnsavedChangesDialog'
import _ from "lodash";
export default {
  name: 'BrandingAdminSettings',
  components: {
    UnsavedChangesDialog
  },
  data() {
    return {
      sLoginLogoUrl: '',
      sTabsBarLogoUrl: '',
      saving: false,
    }
  },
  mounted () {
    this.saving = false
    this.populate()
  },
  beforeRouteLeave (to, from, next) {
    if (this.hasChanges() && _.isFunction(this?.$refs?.unsavedChangesDialog?.openConfirmDiscardChangesDialog)) {
      this.$refs.unsavedChangesDialog.openConfirmDiscardChangesDialog(next)
    } else {
      next()
    }
  },
  
  methods: {
    hasChanges () {
      const data = settings.getBrandingsSettings()
      return this.sLoginLogoUrl !== data.loginLogo ||
          this.sTabsBarLogoUrl !== data.tabsbarLogo
    },
  
    populate () {
      const data = settings.getBrandingsSettings()
      this.sLoginLogoUrl = data.loginLogo
      this.sTabsBarLogoUrl = data.tabsbarLogo
    },
    saveBrandingsSettings() {
        if (!this.saving) {
          this.saving = true
          const parameters = {
            LoginLogo: this.sLoginLogoUrl,
            TabsbarLogo: this.sTabsBarLogoUrl,
          }
          webApi.sendRequest({
            moduleName: 'BrandingWebclient',
            methodName: 'UpdateSettings',
            parameters,
          }).then(result => {
            this.saving = false
            if (result === true) {
              settings.saveBrandingsSettings({
                loginLogo: parameters.LoginLogo,
                tabsbarLogo: parameters.TabsbarLogo,
              })
              notification.showReport(this.$t('COREWEBCLIENT.REPORT_SETTINGS_UPDATE_SUCCESS'))
            } else {
              notification.showError(this.$t('COREWEBCLIENT.ERROR_SAVING_SETTINGS_FAILED'))
            }
          }, response => {
            this.saving = false
            notification.showError(errors.getTextFromResponse(response, this.$t('COREWEBCLIENT.ERROR_SAVING_SETTINGS_FAILED')))
          })
        }
    }
  }
}
</script>

<style scoped>

</style>
