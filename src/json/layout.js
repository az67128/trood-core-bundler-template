export default (components) => ({
  components: [
    {
      name: 'Container',
      props: { fluid: true },
      components: [
        {
          name: 'Row',
          props: { style: { minHeight: '100vh', backgroundColor: '#f9fafc' } },
          components: [
            {
              name: 'Cell',
              props: { xsAuto: true },
              components: [
                {
                  name: 'div',
                  props: {
                    style: {
                      height: '100%',
                      boxShadow: '0 0 15px 0 rgba(134,141,170,.2',
                      backgroundColor: '#f9fafc',
                    },
                  },
                  components: [
                    {
                      name: 'Cell',
                      props: { style: { padding: '8px' } },
                      components: [
                        {
                          name: 'Link',
                          props: {
                            to: '/',
                          },
                          components: [{ name: 'img', props: { src: '/images/logo.svg' } }],
                        },
                      ],
                    },
                    {
                      name: 'Cell',
                      components: [
                        {
                          name: 'Link',
                          props: {
                            to: '/clients',
                            children: {
                              $type: '$expression',
                              rule: [
                                {
                                  $type: '$data',
                                  path: '$route.location.pathname',
                                },
                                '/clients',
                                'Clients*',
                                'Clients',
                              ],
                            },
                          },
                        },
                      ],
                    },
                    {
                      name: 'Cell',
                      components: [
                        {
                          name: 'Link',
                          props: {
                            to: '/matters',
                            children: {
                              $type: '$expression',
                              rule: [
                                {
                                  $type: '$data',
                                  path: '$route.location.pathname',
                                },
                                '/matters',
                                'Matters*',
                                'Matters',
                              ],
                            },
                          },
                        },
                      ],
                    },
                    {
                      name: 'Cell',
                      components: [
                        {
                          name: 'Link',
                          props: {
                            to: '/modal',
                            children: {
                              $type: '$expression',
                              rule: [
                                {
                                  $type: '$data',
                                  path: '$route.location.pathname',
                                },
                                '/modal',
                                'Modal*',
                                'Modal',
                              ],
                            },
                          },
                        },
                      ],
                    },
                    {
                      name: 'Cell',
                      components: [
                        {
                          name: 'Link',
                          props: {
                            to: '/remote',
                            children: {
                              $type: '$expression',
                              rule: [
                                {
                                  $type: '$data',
                                  path: '$route.location.pathname',
                                },
                                '/remote',
                                'Remote*',
                                'Remote',
                              ],
                            },
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: 'Cell',

              components: [
                {
                  name: 'Row',
                  props: { style: { backgroundColor: '#fff', marginBottom: 16 } },
                  components: [
                    { name: 'Cell', props: { xsAuto: true, children: 'back' } },
                    { name: 'Cell', props: { children: 'tabs' } },
                    { name: 'Cell', props: { xsAuto: true, children: 'avatar' } },
                  ],
                },
                {
                  name: 'Row',
                  components: [{ name: 'Cell', components: [{ name: 'Switch', components }] }],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
})