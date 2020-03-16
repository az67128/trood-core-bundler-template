====================================
Initialization and base configuring
====================================

For example, we specify the NPM commands, but you can also use Yarn

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

.. _`build or start`: `6. Build project`_

*********************************************
3. Create business objects (BO) in Custodian
*********************************************

About creation business objects, you can read in `custodian documentation`_

.. _`Custodian documentation`: http://docs.dev.trood.ru/troodcore/custodian/index.html

**************************************************
4. Automatic configuration BO from Custodian meta
**************************************************

***************************
5. Manual configuration BO
***************************

*****************
6. Build project
*****************

Localy run

``npm start``

Build bundle

``npm run build``

If you want to skip package installation for trood core (package already installed)

``npm start ignore-npm``

``npm run build ignore-npm``
