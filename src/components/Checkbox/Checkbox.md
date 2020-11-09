Checkbox checked example:

```js
import Checkbox from 'components/Checkbox';

<Checkbox {...{
  label: 'Checkbox checked',
  value: true,
  onChange: (...args) => console.log('onChange', ...args),
  onInvalid: (...args) => console.log('onInvalid', ...args),
  onValid: (...args) => console.log('onValid', ...args),
}} />
```
Checkbox unchecked example:

```js
import Checkbox from 'components/Checkbox';

<Checkbox {...{
  label: 'Checkbox unchecked',
  value: false,
  onChange: (...args) => console.log('onChange', ...args),
  onInvalid: (...args) => console.log('onInvalid', ...args),
  onValid: (...args) => console.log('onValid', ...args),
}} />
```
