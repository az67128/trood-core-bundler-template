=====================
Create custom layout
=====================

.. _`react-router match`: https://reacttraining.com/react-router/web/api/match
.. _qhistory: https://www.npmjs.com/package/qhistory
.. _`redux-restify forms docs`: https://github.com/DeyLak/redux-restify/blob/master/docs/forms.md
.. _`redux-restify api docs`: https://github.com/DeyLak/redux-restify/blob/master/docs/api.md

You can create a custom layout for render main menu, nested page menu and content block in ``scr/layouts/<LayoutName>``

**************
Layout config
**************

You must create Layout config file ``scr/layouts/<LayoutName>/config.js``

Which should export basePageComponent and nestedPageMenuComponent

.. code-block:: js

    export default {
      basePageComponent: <BasePageReactComponent>,
      nestedPageMenuComponent: <NestedPageMenuReactComponent>,
    }

********************
Base page component
********************

Base page component used for render main menu and content block.

For render main menu you can use HeaderMenu ``import { HeaderMenu } from '$trood/pageManager'``

For render content block you can use RouteSchema ``import { RouteSchema } from '$trood/pageManager'``

Or you can rewrite their functionality

**Base page component props**

.. attribute:: renderers

    Routes config for pageManager.RouteSchema

.. attribute::  menuRenderers

    Contains object for menu items

    .. code-block:: js

        {
            <pagePath>: {
                label: <String label>,
                localeMessageId: react-intl messageId for i18n label>,
                iconType: OneOf(TIcon.ICONS_TYPES),
            },
            ...
        }

.. attribute:: registeredRoutesPaths

    Array of registered routes paths, after apply ABAC rules

.. attribute:: match

    `react-router match`_ object

.. attribute:: history

    object of qhistory_

.. attribute::  authActions

    Authorizations service actions: logout, changeLanguage, restoreAuthData etc

.. attribute::  layoutProps

    Object of props for layout.

    .. attribute:: layoutConfigForm

        Values of redux store for layout

    .. attribute:: layoutConfigFormActions

        Actions for change redux store for layout. More: `redux-restify forms docs`_

    *if in `src/config.js` layout config has depends models:*

    .. attribute:: BONameEntities

        redux-restify api.seletors. More: `redux-restify api docs`_

    .. attribute:: BONameApiActions

        redux-restify api.actions. More: `redux-restify api docs`_

    .. attribute:: BONameEditorActions

        Actions for edit business object

    .. attribute:: BONameActions

        Custom actions from business object (if has export default { actions } in <BOName>/index.js)

    .. attribute:: BONameComponents

        React components from business object (if has export * as components in <BOName>/index.js)

    .. attribute:: BONameConstants

        Constants from business object (if has export * as constants in <BOName>/index.js)

***************************
Nested page menu component
***************************

Nested page menu component used for render menu for subpages.

Its rendered by pageGridLayout in content block of `Base page component`_

For render menu you can use HeaderMenu ``import { HeaderMenu } from '$trood/pageManager'``

**Nested page menu component props**

*authActions, history, layoutProps* - same as `Base page component`_ props

.. attribute:: menuRenderers

    Same as menuRenderers `Base page component`_ props, but contains subpages

.. attribute:: basePageTitleArgs

    `Base page component`_ menuRenderers.<currentBasePath>

.. attribute:: basePath

    Current base page path

******************
Layout redux form
******************

For change some default values for redux layout form, you can create ``src/layouts/forms/layoutConfig.form.js``

More about `redux-restify forms docs`_
