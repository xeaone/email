import Email from './mod.ts';

const [ key ] = Deno.args;

if (!key) throw new Error('key required');


const email = new Email();

email.key(key);
email.client('sendgrid');

// const text = 'Hello World Text';
// const html = '<html><head></head><body><h1>Hello World HTML</h1></body></html>';

const result = await email.send({
    // text,
    // html,
    subject: 'Test Subject',
    // cc: [
    //     'alex.steven.elias@gmail.com',
    // ],
    to: [
        'alex.steven.elias@gmail.com',
        // 'jon@arcdev.io',
        // 'jonburns10@gmail.com',
    ],
    from: 'noreply@arcdev.io',
    // attachments: [ { name: 'customer.csv', data: csv } ],
    // data: {
    //     firstName: 'joe',
    //     lastName: 'shmoe',
    //     $name: 'Foo Bar', // required
    //     $byName: 'Arc IO', // required
    //     $domain: 'https://foobar.com/', // required
    //     $byDomain: 'https://arcdev.io/', // required
    // }
});

console.log(result);
