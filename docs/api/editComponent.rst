===============
Edit component
===============
.. _`redux-restify forms docs`: https://github.com/DeyLak/redux-restify/blob/master/docs/forms.md
.. _`redux-restify api docs`: https://github.com/DeyLak/redux-restify/blob/master/docs/api.md
.. _`manual-configuration-bo`: http://docs.dev.trood.ru/troodsdk/front/tutorial/config.html#manual-configuration-bo
.. _`TInput`: http://docs.dev.trood.ru/troodsdk/front/styleguidist/components/TInput.html#!/TInput
.. _`TCheckbox`: http://docs.dev.trood.ru/troodsdk/front/styleguidist/components/TCheckbox.html#!/TCheckbox
.. _`DateTimePicker`: http://docs.dev.trood.ru/troodsdk/front/styleguidist/components/DateTimePicker.html#!/DateTimePicker
.. _`TSelect`: http://docs.dev.trood.ru/troodsdk/front/styleguidist/components/TSelect.html#!/TSelect
.. _`Components`: http://docs.dev.trood.ru/troodsdk/front/styleguidist/index.html

Edit component is React component for entity editing.
``editComponent.js`` is located in ``/businessObjects/<BOLibName>/<BOName>/editComponent.js``

Styles for the component can be described in the file: ``/src/businessObjects/<BOLibName>/<BOName>/editComponent.css``

``editComponent.js`` should be included in export from ``/businessObjects/<BOLibName>/<BOName>/index.js``

For example:

.. code-block:: javascript

    import editComponent from './editComponent'

    export default {editComponent}


Simple example of ``editComponent.js``

.. code-block:: javascript

    import React from 'react'
    import style from './editComponent.css'
    import modalsStyle from '$trood/styles/modals.css'
    import classNames from 'classnames'

    const EditComponent = ({ ModalComponents: { ModalInput } }) => {
    return (
            <div className={classNames(style.root, modalsStyle.root)}>
                <ModalInput fieldName="name" />
            </div>
        )
    }

    export default EditComponent


*********************
Edit component props
*********************

* isEditing - true - editing mode, false - create mode
* entityId - id of editing entity
* parents - info about parent forms
* model - redux store values for current form
* modelErrors - errors for current form by fields
* modelValid - valid form or not
* serverModel - redux store values for current entity (before changes)
* authData - account information
* getMask - list of fields not available for viewing for current user by ABAC rules
* editMask - list of fields not available for editing for current user by ABAC rules

**BO dependent props:**

* child<BOName> - child BO entities
* <BOName>Entities - BO entity
* <BOName>EditorActions - BO Editor actions
* <BOName>ApiActions - BO Api actions

more details can be found here `manual-configuration-bo`_

**ModalComponents:**

``editComponent.js`` also gets prop ``ModalComponents`` which contains ``ModalInput``, ``ModalCheckbox``, ``ModalDateTimePicker`` and ``ModalSelect`` components.
These are pre-configured wrappers on `TInput`_, `TCheckbox`_, `DateTimePicker`_ and `TSelect`_

To use them in ``editComponent.js`` you need to pass ``fieldName`` props with name of the edited field. String and array of strings are supported.

For example:

.. code-block:: html

  <ModalInput fieldName="position" />

For ``ModalSelect`` you should also specify following props: ``items``, ``onSearch``, ``onScrollToEnd``, ``isLoading``, ``missingValueResolver``

You can also use any other props for ``ModalComponents`` based on `Components`_ configuration.

***********************
Edit component actions
***********************

* modelActions - custom actions for current BO
* modelApiActions - `redux-restify api docs`_
* modelFormActions - `redux-restify forms docs`_