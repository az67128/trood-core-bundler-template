Button base example:

```js
import Button from 'components/Button';
<Button {...{
  label: 'Button',
  onClick: (...args) => console.log('onClick', ...args),
}} />
```

Button red example:

```js
import Button, { BUTTON_COLORS } from 'components/Button';
<Button {...{
  label: 'Button',
  color: BUTTON_COLORS.red,
  onClick: (...args) => console.log('onClick', ...args),
}} />
```
