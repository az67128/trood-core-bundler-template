Range base example:

```js
import Range from 'components/Range';

<Range {...{
    min: 1,
    max: 10,
    step: 1,
    defaultValue: 3,
    onChange: (...args) => console.log('onChange', ...args),
}} />
```
