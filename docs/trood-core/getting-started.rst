================================
Getting Started
================================

For example, we specify the NPM commands, but you can also use Yarn

************************
Initialize a new project
************************

For initialize a new project, create a folder and in it the package.json file with the initial contents

.. code-block:: default

    {
      "name": "trood-init",
      "version": "1.0.0",
      "dependencies": {
    
      }
    }

For build a new project, we use ``trood-core-react-scripts`` based on ``create-react-app``

Next step, run the command: ``npm i trood-core-react-scripts --save``

After we have added the dependency ``trood-core-react-scripts``, we add the initialization script ``"init": "react-scripts init-app"``

.. code-block:: default

    {
      "name": "trood-init",
      "version": "1.0.0",
      "dependencies": {
        "trood-core-react-scripts": "^0.2.6"
      },
      "scripts": {
        "init": "react-scripts init-app"
      }
    }

And run the ``npm run init`` command

After executing the command, we get a start-up project that is ready to set up

***********
Create .env
***********

After initializing the project, we need to create the ``.env`` file in the root directory of the project. The default file can be found on the path ``etc/.env.def``

In this file we need to leave only those services that we will use in the project, in the future they can be added.
And register the URL to the servers of these services and indicate the version of the core

**For example:**

.. code-block:: default

    REACT_APP_DEFAULT_API_HOST=http://demo.trood.com/custodian/data/
    REACT_APP_AUTH_API_HOST=http://demo.trood.com
    REACT_APP_FILE_API_HOST=http://demo.trood.com
    REACT_APP_MAIL_API_HOST=http://demo.trood.com
    REACT_APP_JOURNAL_API_HOST=http://demo.trood.com
    REACT_APP_TROOD_AGENTS_API_HOST=http://demo.trood.com
    REACT_APP_REPORTING_API_HOST=http://demo.trood.com/reporting/v1/
    REACT_APP_REPORTING_PREPARED_ENDPOINT=reports/
    REACT_APP_REPORTING_CONFIG_ENDPOINT=connections/\$connectionCode/report/

.. Warning::
   If due to outdated packages it is not possible to build a project, you should add ``SKIP_PREFLIGHT_CHECK=true``

The default version is ``TROOD_CORE_VERSION=master``. But you can change it by specifying it yourself. This can be a branch name, tag, or commit in the repository. **For example:** ``TROOD_CORE_VERSION=dev``

The default port is 3333. But you can change it by setting ``PORT=3005``

*************************
Default project structure
*************************

.. code-block:: default

    ect/
    	.env.def
    public/
    src/
    	businessObjects/
    	componentLibraries/
    	layouts/
    	config.js
    	customApiConfig.js
    translate/
    	po/
    .babelrc
    .eslintignore
    .eslintrc.js
    .gitignore
    package.json
    package-lock.json
    stylelint.config.js