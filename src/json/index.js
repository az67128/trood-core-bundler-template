import layout from './layout.js'
import clients from './clients.js'
import client from './client.js'
import modal from './modal.js'
import remote from './remote.js'

export default layout([
  {
    name: 'Route',
    props: { path: '/', title: 'Root', exact: true },

    components: [
      {
        name: 'div',
        props: {
          children: 'Main',
        },
      },
    ],
  },
  {
    name: 'Route',
    props: { path: '/clients', title: 'Clients', exact: true },
    components: clients,
  },
  {
    name: 'Route',
    props: {
      path: '/client/:id',
      title: 'Client',
    },
    components: client,
  },
  {
    name: 'Route',
    props: { path: '/matters', title: 'Matters' },
    components: [{ name: 'div', props: { children: 'matters' } }],
  },
  {
    name: 'Route',
    props:{path: '/modal'},
    components: modal,
  },
  {
    name: 'Route',
    props:{path: '/remote'},
    components: remote,
  },
])
