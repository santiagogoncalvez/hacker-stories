export const TABLE_FIELDS = {
  story: [
    { key: 'TITLE', label: 'Title', value: 'TITLE', width: '15%' },
    { key: 'AUTHOR', label: 'Author', value: 'AUTHOR', width: '5%' },
    { key: 'COMMENTS', label: 'Comments', value: 'COMMENTS', width: '5%' },
    { key: 'POINTS', label: 'Points', value: 'POINTS', width: '5%' },
    { key: 'ACTION', label: 'Action', value: '', width: '5%' },
  ],
  comment: [
    {
      key: 'COMMENT_TEXT',
      label: 'Comment',
      value: 'COMMENT_TEXT',
      width: '15%',
    },
    { key: 'AUTHOR', label: 'Author', value: 'AUTHOR', width: '7%' },
    { key: 'CREATED_AT', label: 'Date', value: 'CREATED_AT', width: '7%' },
    /* UNIFICADO: key 'TITLE' para que el CSS móvil lo reconozca siempre */
    { key: 'TITLE', label: 'Title', value: 'TITLE', width: '10%' },
    { key: 'ACTION', label: 'Action', value: '', width: '5%' },
  ],
};
