import { Client, Options, SendData, TemplateData, Type } from './types.ts';
import { encode, typeByExtension } from './deps.ts';
import * as Html from './html.ts';
import * as Text from './text.ts';

// import jwt from './jwt.ts';

// type Key = {
//     type?: string;
//     project_id?: string;
//     private_key_id?: string;
//     private_key: string;
//     client_email: string;
//     client_id?: string;
//     auth_uri?: string;
//     token_uri?: string;
//     auth_provider_x509_cert_url?: string;
//     client_x509_cert_url?: string;
// };

export default class Email {
    #key?: any;
    #type: Type = 'json';
    #client?: Client;
    #sandbox: boolean = false;

    constructor(options?: Options) {
        this.#key = options?.key ?? this.#key;
        this.#client = options?.client ?? this.#client;
        this.#type = options?.type ?? this.#type;
        this.#sandbox = options?.sandbox ?? this.#sandbox;
    }

    #sendGrid(data: SendData) {
        if (!this.#key) throw new Error('key required');

        const body: any = {
            content: [],
            subject: data.subject,
            from: { email: data.from },
            personalizations: [],
        };

        if (this.#sandbox === true) {
            body.mail_settings = { sandbox_mode: { enable: true } };
        }

        if (data.to?.constructor === String) {
            body.personalizations.push({ to: data.to });
        }
        if (data.to?.constructor === Array) {
            body.personalizations.push({
                to: data.to.map((email) => ({ email })),
            });
        }

        if (data.name) body.from.name = data.name;
        if (data.reply) body.replay_to = { email: data.reply };

        if (data.text) {
            body.content.push({ type: 'text/plain', value: data.text });
        }
        if (data.html) {
            body.content.push({ type: 'text/html', value: data.html });
        }

        if (data.attachments) {
            body.attachments = [];

            if (data.attachments?.constructor !== Object) {
                throw new Error('attachments object type not valid');
            }

            for (const name in data.attachments) {
                const value = data.attachments[name];
                body.attachments.push({
                    filename: name,
                    content: encode(value),
                    disposition: 'attachment',
                    type: typeByExtension(name),
                });
            }
        }

        return fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.#key}`,
            },
        });
    }

    // #token?: string;
    // #expires?: number;
    // async #auth () {
    //     if (this.#expires && this.#expires >= Date.now()) return;

    //     let response;

    //     if (this.#key) {
    //         const iss = this.#key.client_email;
    //         const iat = Math.round(Date.now() / 1000);
    //         const exp = iat + (30 * 60);
    //         const aud = 'https://oauth2.googleapis.com/token';
    //         const scope = 'https://www.googleapis.com/auth/datastore';
    //         const assertion = await jwt({ typ: 'JWT', alg: 'RS256', }, { exp, iat, iss, aud, scope }, this.#key.private_key);
    //         response = await fetch('https://oauth2.googleapis.com/token', {
    //             method: 'POST',
    //             body: [
    //                 `assertion=${encodeURIComponent(assertion)}`,
    //                 `grant_type=${encodeURIComponent('urn:ietf:params:oauth:grant-type:jwt-bearer')}`
    //             ].join('&'),
    //             headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    //         });
    //     } else {
    //         response = await fetch('http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token', {
    //             method: 'GET',
    //             headers: { 'Metadata-Flavor':'Google' }
    //         });
    //     }

    //     const result = await response.json();

    //     if (result.error) {
    //         throw new Error(JSON.stringify(result.error, null, '\t'));
    //     }

    //     this.#token = result.access_token;
    //     this.#expires = Date.now() + (result.expires_in * 1000);
    // }

    // #gmail (data: Data) {
    //     if (!this.#key) throw new Error('key required');

    //     this.#auth();

    //     const raw = btoa(
    //         "From: alex.steven.elias@gmail.com\r\n" +
    //         "To: alex@arcdev.io\r\n" +
    //         "Subject: Subject Text\r\n\r\n" +
    //         "The message text goes here"
    //       ).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    //     return fetch('https://gmail.googleapis.com/gmail/v1/users/alex.steven.elias%40gmail.com/messages/send', {
    //         method: 'POST',
    //         body: JSON.stringify({
    //             raw
    //         }),
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${this.#token}`
    //         }
    //     });
    // }

    key(key: string) {
        this.#key = key;
        return this;
    }

    client(client: Client) {
        this.#client = client;
        return this;
    }

    type(type: Type) {
        this.#type = type;
        return this;
    }

    sandbox(sandbox: boolean) {
        this.#sandbox = sandbox;
        return sandbox;
    }

    template(data: TemplateData) {
        if (typeof data.content !== 'object') {
            throw new Error('content not valid');
        }

        const textLines = [];
        const htmlLines = [];
        const csvHead = [];
        const csvLine = [];

        for (const name in data.content) {
            const value = data.content[name];
            htmlLines.push(Html.line(name, value));
            textLines.push(Text.line(name, value));
            csvHead.push(name);
            csvLine.push(value);
        }

        const text = Text.body(data, textLines);
        const html = Html.body(data, htmlLines);

        const attachments = {
            'data.csv': `${csvHead.join(',')}\n"${csvLine.join('","')}"`,
        };

        return { text, html, attachments };
    }

    send(data: SendData) {
        if (!data) throw new Error('data required');
        if (!data.to) throw new Error('to required');
        if (!data.from) throw new Error('from required');

        data = { ...data };

        switch (this.#client) {
            // case 'gmail': return this.#gmail(data);
            case 'sendgrid':
                return this.#sendGrid(data);
            default:
                throw new Error('client required');
        }
    }
}
