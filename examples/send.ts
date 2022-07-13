import Email from '../mod.ts';

const [ path ] = Deno.args;
const key = Deno.readTextFileSync(path);
if (!key) throw new Error('key required');

const email = new Email();

email.key(key);
email.client('sendgrid');

const result = await email.send({
    name: 'Plants',
    subject: 'It is so BIG... 🍆',
    from: 'noreply@',
    to: [ '@gmail.com' ],

    title: 'Foo Bar', // required
    provider: 'Super Man', // required
    link: 'https://foobar.com/', // required

    content: {
        firstName: 'foo',
        lastName: 'bar',
    }
});

console.log(result);
console.log(await result?.text());
