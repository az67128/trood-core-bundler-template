export default [
  {
    name: 'Row',
    components: [
      {
        name: 'Cell',
        components: [
          {
            name: 'Modal',
            props: {
              children: 'modal',
              isOpen: { $type: '$data', path: '$page.isModalOpen["modal"]' },
              close: {
                $type: '$action',
                path: '$page.closeModal',
                args: ['modal'],
              },
            },
          },
        ],
      },
    ],
  },

  {
    name: 'TButton',
    props: {
      label: 'open modal',

      onClick: {
        $type: '$action',
        path: '$page.openModal',
        args: ['modal'],
      },
    },
  },
]