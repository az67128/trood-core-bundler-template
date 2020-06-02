export default {
  title: 'TroodCoreComponents',
  components: [
    {
      title: 'TableView',
      models: [
        {
          name: 'table',
          required: true,
        },
      ],
      canUseOn: ['page', 'entityPage'],
    },
    {
      title: 'InfoBlock',
      models: [
        {
          name: 'model',
          required: true,
        },
      ],
      canUseOn: ['entityPage'],
    },
  ],
}
