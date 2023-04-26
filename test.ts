import { assertEquals } from 'https://deno.land/std@0.184.0/testing/asserts.ts';
import Email from './mod.ts';

const key = await Deno.readTextFile('../.credentials-arc-host/sendgrid');
if (!key) throw new Error('key required');

const name = 'Plants';
const subject = 'Free Planting 🍑 🍆';
const from = 'noreply@arcdev.io';
const to = ['alex.steven.elias@gmail.com'];

const email = new Email();

email.key(key);
email.sandbox(true);
email.client('sendgrid');

// Deno.test('sendgrid with template', async () => {
//     const { html, text, attachments } = email.template({
//         title: 'Foo Bar',
//         provider: 'Super Man',
//         link: 'https://foobar.com/',
//         content: {
//             firstName: 'foo',
//             lastName: 'bar',
//         },
//     });

//     const result = await email.send({
//         name,
//         subject,
//         from,
//         to,
//         html,
//         text,
//         attachments,
//     });

//     console.log(await result.text());


//     // with sandbox
//     await assertEquals(result.status, 200);

//     // without sandbox
//     // await assertEquals(result.status, 202);
// });

Deno.test('sendgrid without template', async () => {
    const result = await email.send({
        name,
        subject,
        from,
        to,
        html: '<h1>Hello World</h1>',
        text: 'Hello World',
    });

    console.log(await result.text());

    // with sandbox
    await assertEquals(result.status, 200);

    // without sandbox
    // await assertEquals(result.status, 202);
});
