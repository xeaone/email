# X-Email

A Deno email API that uses web providers without any dependencies. See the [examples](./examples/send.ts).

## Example

```ts
import Email from 'https://deno.land/x/xemail/mod.ts';

const email = new Email();

email.key(key);
email.client('sendgrid');

const { html, text, attachments } = email.template({
    title: 'Foo Bar',
    provider: 'Super Man',
    link: 'https://foobar.com/',
    content: {
        firstName: 'foo',
        lastName: 'bar',
    },
});

const result = await email.send({
    name: 'Plants',
    subject: 'Free Planting 🍑 🍆',
    from: 'noreply@',
    to: ['@gmail.com'],
    html,
    text,
    attachments,
});
```
