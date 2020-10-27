Input base example:

```js
import Input from 'components/Input';

<Input {...{
    label: 'Input',
    placeholder: 'put the text',
    onEnter: (...args) => console.log('onEnter', ...args),
    onSearch: (...args) => console.log('onSearch', ...args),
    onInvalid: (...args) => console.log('onInvalid', ...args),
    onValid: (...args) => console.log('onValid', ...args),
    onFocus: (...args) => console.log('onFocus', ...args),
    onBlur: (...args) => console.log('onBlur', ...args),
    onChange: (...args) => console.log('onChange', ...args),
}} />
```
