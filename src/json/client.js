export default [
  {
    name: 'Cell',
    components:[{
      name: 'Cell',
      props: { children: { $type: '$data', path: '$context.name' } },
            
    }],
  },
    
]
