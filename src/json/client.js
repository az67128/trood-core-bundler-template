export default [
  {
    name: 'Context',
    props: {
      context: {
        $type: '$data',
        path: '$store.apis.custodian.client.getByPk[{"$type":"$data", "path":"$route.params.id"}]',
      },
      components: 
      [
        {
          name: 'Cell',
          components:[{
            name: 'Cell',
            props: { children: { $type: '$data', path: '$route.params.id', tamplate: 'Client ${value}' } },
                  
          },{
            name: 'Cell',
            props: { children: { $type: '$data', path: '$context.name' } },
                  
          }],
        },
          
      ],
    },
  },
]
