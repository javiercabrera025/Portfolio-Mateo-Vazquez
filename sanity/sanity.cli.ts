import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '471979z9',
    dataset: 'production',
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    appId: 'cfrxpgek4n488fe4pxx6yqab',
    autoUpdates: true,
  },
})
