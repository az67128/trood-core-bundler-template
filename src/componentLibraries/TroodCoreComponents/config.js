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
      canUseOn: ['page'],
    },
    {
      title: 'InfoBlock',
      models: [
        {
          name: 'model',
          required: true,
        },
      ],
      canUseOn: ['entityPage', 'entityPage'],
    },
  ],
}
