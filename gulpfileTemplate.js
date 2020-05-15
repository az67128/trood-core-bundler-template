require('core-js/stable')
require('regenerator-runtime/runtime')
const gulp = require('gulp')
const template = require('gulp-template')
const rename = require('gulp-rename')
const { PAGE_TYPES_DEFAULT_TITLE, PAGE_TYPES_GET_PAGE_ID, getPageConfig } = require('./src/pageManager')
const {camelToUpperHuman} = require('./src/helpers/namingNotation')


const getPageId = (page, ...args) => PAGE_TYPES_GET_PAGE_ID[page.type](page, ...args)
const getPageTitle = (page) => page.title || PAGE_TYPES_DEFAULT_TITLE[page.type] || ''

const isTest = process.env.NODE_ENV === 'testing'

const getLoadableTemplate = (libraryName, componentName) => {
  const compName = `'${libraryName}/${componentName}'`
  const compPath = `'./${libraryName}/${componentName}'`
  if (!isTest) {
    return `${compName}: loadable(
      () => import(${compPath}),
      {
        fallback: (<LoadingIndicator />),
      },
    )`
  }
  return `${compName}: require(${compPath}).default`
}

const getServicesTemplate = (libraryName, componentName, services) => {
  return `'${libraryName}/${componentName}': ${JSON.stringify(services)}`
}

const getModelTemplate = (libraryName, modelName, modelConfig, currentComponents, currentConstants) => {
  const componentTemplates = currentComponents.map(comp => `
    '${comp}': loadable(
      () => import('./${libraryName}/${modelName}/components/${comp}'),
      {
        fallback: (<LoadingIndicator />),
      },
    )
  `).join(',\n')
  return `'${libraryName}/${modelName}': {
    module: require('./${libraryName}/${modelName}').default,
    config: ${JSON.stringify(modelConfig)},
    components: {${componentTemplates}},
    constants: ${JSON.stringify(currentConstants)},
  }`
}

const getLayoutTemplate = (layoutName) => {
  return `'${layoutName}': {
    module: require('./${layoutName}/config').default,
  }`
}

const getComponentFormTemplate = ({ id, config }) => {
  return `'${id}': require('${config}').default`
}

const getPageIntlMessage = (pageId, pageTitle) => {
  return `'${pageId}': {
    id: '${pageId}',
    defaultMessage: '${pageTitle}',
  }`
}

gulp.task('make-components', () => {
  const config = require('./src/config').default
  const configsContext = require.context('./src/componentLibraries/', true, /config\.js(on)?$/)
  const formsContext = require.context('./src/componentLibraries/', true, /form\.js$/)

  const configs = configsContext.keys().reduce((memo, key) => ({
    ...memo,
    [key.replace(/\.?\/|config\.js(on)?/g, '')]: configsContext(key).default || configsContext(key),
  }), {})

  const forms = formsContext.keys().reduce((memo, key) => ({
    ...memo,
    [key.replace(/\.\/|\/form\.js/g, '')]: key.replace('.js', ''),
  }), {})

  const pages = [
    ...config.pages.map(p => getPageConfig(p)),
    ...Object.keys(config.entityPages).map(key => getPageConfig(config.entityPages[key], key)),
  ]
  const componentsForms = []
  const forEachComponents = (comps = []) => {
    comps.forEach(c => {
      const compFormConfig = forms[c.type]
      if (compFormConfig) {
        componentsForms.push({
          id: c.id,
          type: c.type,
          config: compFormConfig,
        })
      }
      if (c.components) forEachComponents(c.components)
    })
  }
  const forEachPages = (pgs = []) => {
    pgs.forEach(p => {
      if (p.components) forEachComponents(p.components)
      if (p.pages) forEachPages(p.pages)
    })
  }
  forEachPages(pages)

  return gulp.src('./src/componentLibraries/manifest.js.template')
    .pipe(template({
      components: Object.keys(configs).map(library => {
        const currentLibraryName = configs[library].title
        const currentComponents = configs[library].components
        return currentComponents.map(component => {
          return getLoadableTemplate(currentLibraryName, component.title)
        }).join(',\n    ')
      }).join(',\n    '),
      forms: componentsForms.map(getComponentFormTemplate).join(',\n    '),
      services: Object.keys(configs).map(library => {
        const currentLibraryName = configs[library].title
        const currentComponents = configs[library].components
        return currentComponents.map(component => {
          return getServicesTemplate(currentLibraryName, component.title, component.services)
        }).join(',\n    ')
      }).join(',\n    '),
    }))
    .pipe(rename(path => {
      path.basename = 'manifest'
      path.extname = '.js'
    }))
    .pipe(gulp.dest('./src/componentLibraries'))
})

gulp.task('make-business-objects', () => {
  const context = require.context('./src/businessObjects/', true, /config\.js(on)?$/)

  const configs = context.keys().reduce((memo, key) => ({
    ...memo,
    [key.replace(/\.?\/|config\.js(on)?/g, '')]: context(key).default || context(key),
  }), {})

  return gulp.src('./src/businessObjects/manifest.js.template')
    .pipe(template({
      models: Object.keys(configs).map(library => {
        const currentLibraryName = configs[library].title
        const currentModels = configs[library].models
        return currentModels.map(model => {
          const currentModule = require(`./src/businessObjects/${currentLibraryName}/${model.title}`)
          const currentComponents = Object.keys(currentModule.components || {})
          const currentConstants = currentModule.constants || {}
          return getModelTemplate(currentLibraryName, model.title, model, currentComponents, currentConstants)
        }).join(',\n')
      }).join(',\n'),
    }))
    .pipe(rename(path => {
      path.basename = 'manifest'
      path.extname = '.js'
    }))
    .pipe(gulp.dest('./src/businessObjects'))
})

gulp.task('make-layouts', () => {
  const context = require.context('./src/layouts/', true, /config\.js$/)

  const configs = context.keys().reduce((memo, key) => ({
    ...memo,
    [key.replace(/\.?\/|config\.js/g, '')]: context(key).default || context(key),
  }), {})

  return gulp.src('./src/layouts/manifest.js.template')
    .pipe(template({
      layouts: Object.keys(configs).map(layoutKey => {
        return getLayoutTemplate(layoutKey)
      }).join(',\n'),
    }))
    .pipe(rename(path => {
      path.basename = 'manifest'
      path.extname = '.js'
    }))
    .pipe(gulp.dest('./src/layouts'))
})

gulp.task('make-locale', () => {
  const config = require('./src/config').default

  const reducePages = (modelType, prevPageId) => (memo, page) => {
    const currentPageId = getPageId(page, modelType, undefined, prevPageId)
    let currentPageTitles = [
      {
        id: currentPageId,
        title: getPageTitle(page),
      },
    ]
    if (page.pages) {
      currentPageTitles = [
        ...currentPageTitles,
        ...page.pages.reduce(
          reducePages(page.modelType || modelType, currentPageId),
          [],
        ),
      ]
    }
    return memo.concat(currentPageTitles)
  }
  const flattenPages = config.pages.reduce(
    reducePages(),
    Object.keys(config.entityPages).reduce((memo, key) => {
      const currentPage = config.entityPages[key]
      const currentPageId = getPageId(currentPage, key)
      let currentPageTitles = [
        {
          id: currentPageId,
          title: getPageTitle(currentPage),
        },
      ]
      if (currentPage.pages) {
        currentPageTitles = [
          ...currentPageTitles,
          ...currentPage.pages.reduce(
            reducePages(key, currentPageId),
            [],
          ),
        ]
      }
      return memo.concat(currentPageTitles)
    }, []),
  )
  return gulp.src('./src/configMessages.js.template')
    .pipe(template({
      pages: flattenPages
        .filter(page => page.title)
        .map(page => getPageIntlMessage(page.id, page.title))
        .join(',\n'),
    }))
    .pipe(rename(path => {
      path.basename = 'configMessages'
      path.extname = '.js'
    }))
    .pipe(gulp.dest('./src'))
})

gulp.task('make-bo-intil', () => {
  const context = require.context('./src/businessObjects/', true, /model\.js(on)?$/)
  const models = context
    .keys()
    .reduce(
      (libraries, key) => [
        ...libraries,
        ...Object.keys(context(key).default.defaults).reduce((memo, fieldName) => {
          const id = `${key.split('/')[2]}.${fieldName}`
          return [
            ...memo,
            `  '${id}': {
    id: 'entityNameMessages.${id}',
    defaultMessage: '${camelToUpperHuman(fieldName)}',
  }`,
          ]
        }, []),
      ],
      [],
    )
    .join(',\n')

  return gulp
    .src('./src/businessObjects/entityNameMessages.js.template')
    .pipe(template({ models }))
    .pipe(
      rename((path) => {
        path.basename = 'entityNameMessages'
        path.extname = '.js'
      }),
    )
    .pipe(gulp.dest('./src/businessObjects'))
})

gulp.task(
  'default',
  gulp.parallel(
    'make-components',
    'make-business-objects',
    'make-layouts',
    'make-locale',
    'make-bo-intil',
  ),
)