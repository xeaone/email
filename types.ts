
export type Client = 'sendgrid';

export type Type = 'json' | 'html' | 'text';

export type Options = {
    key?: string;
    type?: Type;
    client?: Client;
};

export type Content = {
    [ name: string ]: string | number | boolean;
};

export type Data = {
    text?: string;
    html?: string;
    csv?: string;

    from: string; // email from address
    to: Array<string>; // email to address
    content: string | Content; // email content

    name?: string; // email from name
    subject?: string; // email subject

    link: string; // content link
    title: string; // content title
    provider: string; // content provider

    cc?: Array<string>;
    bcc?: Array<string>;
    reply?: Array<string>; // email reply to address
};
