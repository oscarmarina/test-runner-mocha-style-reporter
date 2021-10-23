# Test Runner Mocha-Style Reporter

## Install package
```js
npm install @blockquote/test-runner-mocha-style-reporter --save-dev
```

## Reporters: Overview
You can customize the test reporters using the reporters option

### web-test-runner.config.mjs

```js
import { defaultReporter } from '@web/test-runner';
import { mochaStyleReporter } from '@blockquote/test-runner-mocha-style-reporter';

...
  reporters: [
      defaultReporter(),
      mochaStyleReporter(),
  ],
...

```
<hr>

![reporter example](./test-runner-mocha-style-reporter.png)

<hr>

## Reporter for web test runner

See [moder-web website](https://modern-web.dev/docs/test-runner/reporters/write-your-own/) for full documentation.