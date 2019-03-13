import systemConfig from '$trood/config'
import layoutsManifest from '$trood/layouts/manifest'

console.log(layoutsManifest, systemConfig.layouts.defaultLayout)
export const currentLayout = layoutsManifest[systemConfig.layouts.defaultLayout].module
