import { forms } from 'redux-restify'


export const uploadFile = (file) => (dispatch) => {
  return dispatch(forms.actions.sendQuickForm({
    model: 'files',
    defaults: {
      file,
      name: file.name,
    },
  }))
}
