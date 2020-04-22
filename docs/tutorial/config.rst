====================================
Initialization and base configuring
====================================

For example, we specify the NPM commands, but you can also use Yarn

.. _`redux-restify docs`: https://github.com/DeyLak/redux-restify/blob/master/docs/api.md

.. _`redux-restify api docs`: https://github.com/DeyLak/redux-restify/blob/master/docs/api.md

.. _`redux-restify forms docs`: https://github.com/DeyLak/redux-restify/blob/master/docs/forms.md

************************************
1. Install trood-core-react-scripts
************************************

For init a new project, we use `trood-core-react-scripts`_ based on `create-react-app`_

.. _`trood-core-react-scripts`: https://www.npmjs.com/package/trood-core-react-scripts

.. _`create-react-app`: https://create-react-app.dev/docs/getting-started/

Install trood-core-react-scripts global with command:

``npm i -g trood-core-react-scripts``

**************************
2. Project initialization
**************************

Create package.json in folder with your project

.. code-block:: json

    {
      "name": "<projectName>",
      "version": "1.0.0"
    }

And run the command:

``trood-core-react-scripts initApp``

After executing the command, we get a base project that is ready to configuring

Now you can `build or start`_ your empty project

.. _`build or start`: `8. Build project`_

*********************
3. Project structure
*********************

After initialization your have next project structure:

.. list-table::
   :widths: 40 60
   :header-rows: 1

   * - Path
     - Description
   * - /etc/.env.def
     - Example environment variables
   * - /public/*
     - Default static files (images, html & etc.)
   * - /src/businessObjects/
     - Folder for business objects libraries
   * - /src/componentLibraries/
     - Folder for page components libraries
   * - /src/layouts/
     - Folder for custom layout
   * - /src/config.js
     - Main system config file
   * - /src/customApiConfig.js
     - Config file for add custom API (more `redux-restify api docs`_)
   * - /translate/*
     - Folder for i18n

*********************************************
4. Create business objects (BO) in Custodian
*********************************************

About creation business objects, you can read in `custodian documentation`_

.. _`Custodian documentation`: /troodcore/custodian/index.html

*************************
5. Environment variables
*************************

Your can set them in the standard OS way or create /.env file (example in /etc/.env.def)

.. list-table::
    :widths: 40 60
    :header-rows: 1

    * - Env name
      - Description
    * - REACT_APP_DEFAULT_API_HOST
      - Absolute or relative path to

        data of CUSTODIAN service
    * - REACT_APP_AUTH_API_HOST
      - Absolute or relative path to

        AUTHORIZATION service
    * - REACT_APP_FILE_API_HOST
      - Absolute or relative path to

        FILE service
    * - REACT_APP_SEARCH_API_HOST
      - Absolute or relative path to

        SEARCH service
    * - REACT_APP_MAIL_API_HOST
      - Absolute or relative path to

        MAIL service
    * - REACT_APP_JOURNAL_API_HOST
      - Absolute or relative path to

        JOURNAL service
    * - REACT_APP_TROOD_AGENTS_API_HOST
      - Absolute or relative path to

        AGENTS service
    * - REACT_APP_REPORTING_API_HOST
      - Absolute or relative path to

        REPORTING service
    * - REACT_APP_REPORTING_PREPARED_ENDPOINT
      - REPORTING service endpoint to

        prepared reports
    * - REACT_APP_REPORTING_CONFIG_ENDPOINT
      - REPORTING service endpoint to

        configuring reports
    * - TROOD_CORE_VERSION
      - Viresion of frontendTroodCore

        (branch, tag or commit of

        trood-core-bundler-template)
    * - PORT
      - Localhost port for

        npm start command

**************************************************
6. Automatic configuration BO from Custodian meta
**************************************************

For automatic generation BO configuration - run:

``npm run initMeta``

If your set env.REACT_APP_DEFAULT_API_HOST - script use it, else enter CUSTODIAN host

Enter login/password for CUSTODIAN

Enter name for business objects libraries

After script work end:

.. list-table::
    :widths: 40 60
    :header-rows: 1

    * - Path name
      - Description
    * - /src/businessObjects/<BOLibName>/
      - business objects libraries folder
    * - /src/businessObjects/<BOLibName>/config.js
      - business objects libraries config file
    * - /src/businessObjects/<BOLibName>/<BOName>/
      - folder for business object <BOName>
    * - \*\*/<BOName>/editComponent.js
      - standard React component for

        edit <BOName>
    * - \*\*/<BOName>/editComponent.css
      - styles for

        \*\*/<BOName>/editComponent.js
    * - \*\*/<BOName>/form.js
      - form config for <BOName>

        (more `redux-restify forms docs`_)
    * - \*\*/<BOName>/model.js
      - model config for <BOName>

        (more `redux-restify api docs`_)
    * - \*\*/<BOName>/index.js
      - entry point for <BOName>
    * - /src/config.js
      - added library <BOLibName>

        config to businessObjects section

***************************
7. Manual configuration BO
***************************

In /src/config.js your can disabled pagination or/end change endpoint

.. code-block:: js

    export default {
      ...
      businessObjects: [
        {
          name: <BOLibName>,
          type: 'CUSTODIAN',
          models: {
            <BOName>: {
              endpoint: <BOEndpoint>,
              pagination: false,
            },
            ...
          },
        },
        ...
      ],
      ...
    }

--------

In /src/businessObjects/<BOLibName>/config.js your can change dependsOn

For example ``dependsOn: ['myBOName']`` will pass props to editComponent.js

.. _`editActions`: ./edit-components.html

* employeePositionEntities - more in `redux-restify api docs`_
* employeePositionApiActions - more in `redux-restify api docs`_
* employeePositionEditorActions - more in `editActions`_

--------

Your can change config in src/businessObjects/<BOLibName>/<BOName>/model.js

* field ``name``: will be display in edit or view modal window (string|react-intl message)
* field ``deletion``: configuring deletion confirmation
* field ``deletion.confirm``: if true - need confirm
* field ``deletion.message``: message for display in confirm modal (string|react-intl message)

about other fields your can read in `redux-restify api docs`_

--------

About change config in src/businessObjects/<BOLibName>/<BOName>/form.js your can read in `redux-restify forms docs`_

--------

If your don't want use edit functional for <BOName>, your can delete:

* src/businessObjects/<BOLibName>/<BOName>/editComponent.js
* src/businessObjects/<BOLibName>/<BOName>/editComponent.css
* src/businessObjects/<BOLibName>/<BOName>/form.js

and clear reference in src/businessObjects/<BOLibName>/<BOName>/index.js

*****************
8. Build project
*****************

Locally run

``npm start``

Build bundle

``npm run build``

If you want to skip package installation for trood core (package already installed)

``npm start ignore-npm``

``npm run build ignore-npm``
