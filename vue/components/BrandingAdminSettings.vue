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
               :label="$t('COREWEBCLIENT.ACTION_SAVE')" />
      </div>
    </div>
  </q-scroll-area>
</template>

<script>
export default {
  name: 'BrandingAdminSettings',

  data() {
    return {
      sLoginLogoUrl: '',
      sTabsBarLogoUrl: '',
    }
  },
}
</script>

<style scoped>

</style>
