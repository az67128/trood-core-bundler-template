import layout from './layout.js';
import clients from './clients.js';
import client from './client.js';
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
        components: [
            {
                name: 'Context',
                props: {
                    context: {
                        $type: '$data',
                        path: '$store.apis.custodian.client.getByPk[{"$type":"$data", "path":"$route.params.id"}]',
                    },
                    components: client,
                },
            },
        ],
    },
    {
        name: 'Route',
        props: { path: '/matters', title: 'Matters' },
        components: [{ name: 'div', props: { children: 'matters' } }],
    },
    {
        name: 'Route',
        props:{path: '/modal'},
        components: [
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
        ],
    },
]);
