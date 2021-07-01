<template>
  <q-scroll-area class="full-height full-width">
    <div class="q-pa-lg ">
      <div class="row q-mb-md">
        <div class="col text-h5" v-t="'BRANDINGWEBCLIENT.HEADING_SETTINGS_TAB'"></div>
      </div>
      <q-card flat bordered class="card-edit-settings">
        <q-card-section>
          <div class="row q-mb-md">
            <div class="col-2 q-mt-sm" v-t="'BRANDINGWEBCLIENT.LOGIN_LOGO_URL_LABEL'"></div>
            <div class="col-5">
              <q-input outlined dense class="bg-white" v-model="loginLogoUrl"/>
            </div>
          </div>
          <div class="row">
            <div class="col-2 q-mt-sm" v-t="'BRANDINGWEBCLIENT.TABSBAR_LOGO_URL_LABEL'"></div>
            <div class="col-5">
              <q-input outlined dense class="bg-white" v-model="tabsBarLogoUrl"/>
            </div>
          </div>
        </q-card-section>
      </q-card>
      <div class="q-pa-md text-right">
        <q-btn unelevated no-caps dense class="q-px-sm" :ripple="false" color="primary"
               :label="saving ? $t('COREWEBCLIENT.ACTION_SAVE_IN_PROGRESS') : $t('COREWEBCLIENT.ACTION_SAVE')"
               @click="saveBrandingSettings"/>
      </div>
    </div>
    <q-inner-loading style="justify-content: flex-start;" :showing="loading || saving">
      <q-linear-progress query class="q-mt-sm" />
    </q-inner-loading>
    <UnsavedChangesDialog ref="unsavedChangesDialog"/>
  </q-scroll-area>
</template>

<script>
import _ from 'lodash'

import errors from 'src/utils/errors'
import notification from 'src/utils/notification'
import webApi from 'src/utils/web-api'

import cache from 'src/cache'

import UnsavedChangesDialog from 'src/components/UnsavedChangesDialog'

export default {
  name: 'BrandingAdminSettingPerTenant',
  components: {
    UnsavedChangesDialog
  },
  data () {
    return {
      loginLogoUrl: '',
      tabsBarLogoUrl: '',
      saving: false,
      loading: false,
      tenant: null
    }
  },
  computed: {
    tenantId () {
      return Number(this.$route?.params?.id)
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
      const loginLogoUrl = _.isFunction(this.tenant?.getData) ? this.tenant?.getData('BrandingWebclient::LoginLogo') : ''
      const tabsBarLogoUrl = _.isFunction(this.tenant?.getData) ? this.tenant?.getData('BrandingWebclient::TabsbarLogo') : ''
      return this.loginLogoUrl !== loginLogoUrl ||
          this.tabsBarLogoUrl !== tabsBarLogoUrl
    },
    populate () {
      this.loading = true
      cache.getTenant(this.tenantId).then(({ tenant }) => {
        if (tenant.completeData['BrandingWebclient::LoginLogo'] !== undefined) {
          this.loading = false
          this.tenant = tenant
          this.loginLogoUrl = tenant.completeData['BrandingWebclient::LoginLogo']
          this.tabsBarLogoUrl = tenant.completeData['BrandingWebclient::TabsbarLogo']
        } else {
          this.getSettings()
        }
      })
    },
    saveBrandingSettings () {
      if (!this.saving) {
        this.saving = true
        const parameters = {
          LoginLogo: this.loginLogoUrl,
          TabsbarLogo: this.tabsBarLogoUrl,
          TenantId: this.tenantId
        }
        webApi.sendRequest({
          moduleName: 'BrandingWebclient',
          methodName: 'UpdateSettings',
          parameters,
        }).then(result => {
          this.saving = false
          if (result === true) {
            cache.getTenant(parameters.TenantId, true).then(({ tenant }) => {
              const brandingData = {
                loginLogo: parameters.LoginLogo,
                tabsbarLogo: parameters.TabsbarLogo
              }
              tenant.setCompleteData({
                'BrandingWebclient::LoginLogo': brandingData.loginLogo,
                'BrandingWebclient::TabsbarLogo': brandingData.tabsbarLogo,
              })
              this.populate()
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
    },
    getSettings () {
      const parameters = {
        TenantId: this.tenantId
      }
      webApi.sendRequest({
        moduleName: 'BrandingWebclient',
        methodName: 'GetSettings',
        parameters,
      }).then(result => {
        if (result) {
          cache.getTenant(parameters.TenantId).then(({ tenant }) => {
            const brandingData = {
              loginLogo: result.LoginLogo,
              tabsbarLogo: result.TabsbarLogo
            }
            tenant.setCompleteData({
              'BrandingWebclient::LoginLogo': brandingData.loginLogo,
              'BrandingWebclient::TabsbarLogo': brandingData.tabsbarLogo,
            })
            this.populate()
          })
        }
      })
    },
  }
}
</script>

<style scoped>

</style>
