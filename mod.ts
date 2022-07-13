import TextLine from './text-line.ts';
import HtmlLine from './html-line.ts';
import Html from './html.ts';
import Text from './text.ts';

type Client = 'sendgrid';

type Options = {
    key: string;
    data: Record<string, string>;

    text?: string;
    html?: string;
    csv?: string;

    from: string;
    to: Array<string>;

    subject?: string;
    cc?: Array<string>;
    bcc?: Array<string>;
    reply?: Array<string>;

};

const SPLIT = /\s*,+\s*|\s+/;

export default class Email {

    #key: string;
    #client: Client = 'sendgrid';

    constructor (options: any = {}) {
        this.#key = options.key;
        this.#client = options.client;
    }

    #sendGrid (data: any) {

        const body = {
            subject: data.subject,
            from: { email: data.from },
            personalizations: [ { to: data.to.map((email: string) => ({ email })) } ],
            content: [ { type: 'text/plain', value: data.text }, { type: 'text/html', value: data.html } ]
        };

        return fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.key}`
            }
        });
    }

    client (client: Client) {
        this.#client = client;
        return this;
    }

    key (key: string) {
        this.#key = key;
        return this;
    }

    template (data: Record<string, string>) {
        data = data || {};

        if (!data.$name) throw new Error('Email.template - requires $name');
        if (!data.$byName) throw new Error('Email.template - requires $byName');
        if (!data.$domain) throw new Error('Email.template - requires $domain');
        if (!data.$byDomain) throw new Error('Email.template - requires $byDomain');

        const textLines = [];
        const htmlLines = [];

        const csvHead = [];
        const csvLine = [];

        for (const name in data) {
            if (name.charAt(0) !== '$') {
                const value = data[ name ];
                htmlLines.push(HtmlLine(name, value));
                textLines.push(TextLine(name, value));
                csvHead.push(name);
                csvLine.push(value);
            }
        }

        const text = Text(data, textLines);
        const html = Html(data, htmlLines);
        const csv = `${csvHead.join(',')}\n"${csvLine.join('","')}"`;

        return { text, html, csv };
    }

    send (options: Options) {
        if (!options) throw new Error('options required');
        if (!options.from) throw new Error('from required');
        if (!options.data) throw new Error('data required');

        options = { ...options };

        options.to =options.to;
        options.cc = options.cc;
        options.bcc = options.bcc;
        options.reply = options.reply;

        if (!options.html || !options.text || !options.csv) {
            const { text, html, csv } = this.template(options.data);
            options.html = options.html ?? html;
            options.text = options.text ?? text;
            options.csv = options.csv ?? csv;
        }

        options.key = this.#key;

        switch (this.#client) {
            case 'sendgrid': return this.#sendGrid(options);
        }

    }

}