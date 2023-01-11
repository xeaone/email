import { encode } from './deps.ts';

import { Type, Client, Data, Options } from './types.ts';
import TextLine from './text-line.ts';
import HtmlLine from './html-line.ts';
import Html from './html.ts';
import Text from './text.ts';

export default class Email {

    #key?: string;
    #type: Type = 'json';
    #client?: Client = 'sendgrid';

    constructor (options?: Options) {
        this.#key = options?.key ?? this.#key;
        this.#client = options?.client ?? this.#client;
        this.#type = options?.type ?? this.#type;
    }

    #sendGrid (data: Data) {
        if (!this.#key) throw new Error('key required');

        const body: any = {
            content: [],
            subject: data.subject,
            from: { email: data.from },
            personalizations: [ { to: data.to.map((email: string) => ({ email })) } ],
            // mail_settings: { sandbox_mode: { enable: true } }
        };

        if (data.name) body.from.name = data.name;
        if (data.text) body.content.push({ type: 'text/plain', value: data.text });
        if (data.html) body.content.push({ type: 'text/html', value: data.html });

        if (data.csv) {
            const filename = typeof data.content === 'object' ?
                data.title.toLowerCase().replace(/\s+/g, '-').concat('.csv') :
                'data.csv';

            body.attachments = [
                {
                    filename,
                    content: encode(data.csv),
                    type: 'text/csv', disposition: 'attachment'
                }
            ];
        }

        return fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.#key}`
            }
        });
    }

    key (key: string) {
        this.#key = key;
        return this;
    }

    client (client: Client) {
        this.#client = client;
        return this;
    }

    type (type: Type) {
        this.#type = type;
        return this;
    }

    template (data: Data) {
        if (typeof data.content !== 'object') throw new Error('content not valid');

        const textLines = [];
        const htmlLines = [];
        const csvHead = [];
        const csvLine = [];

        for (const name in data.content) {
            const value = data.content[ name ];
            htmlLines.push(HtmlLine(name, value));
            textLines.push(TextLine(name, value));
            csvHead.push(name);
            csvLine.push(value);
        }

        const text = Text(data, textLines);
        const html = Html(data, htmlLines);
        const csv = `${csvHead.join(',')}\n"${csvLine.join('","')}"`;

        return { text, html, csv };
    }

    send (data: Data) {
        if (!data) throw new Error('data required');
        if (!data.to) throw new Error('to required');
        if (!data.from) throw new Error('from required');
        if (!data.link) throw new Error('link required');
        if (!data.title) throw new Error('title required');
        if (!data.content) throw new Error('content required');
        if (!data.provider) throw new Error('provider required');

        data = { ...data };

        if (this.#type === 'json' && typeof data.content === 'object') {
            const { text, html, csv } = this.template(data);
            data.html = data.html ?? html;
            data.text = data.text ?? text;
            data.csv = data.csv ?? csv;
        }

        switch (this.#client) {
            case 'sendgrid': return this.#sendGrid(data);
        }

    }

}