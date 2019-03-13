import systemConfig from '$trood/config'
import layoutsManifest from '$trood/layouts/manifest'


export const currentLayout = layoutsManifest[systemConfig.layouts.defaultLayout].module
