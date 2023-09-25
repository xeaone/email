export type Client = 'sendgrid' | 'gmail';

export type Type = 'json' | 'html' | 'text';

export type Options = {
    key?: string;
    type?: Type;
    client?: Client;
    sandbox?: boolean;
};

export type SendData = {
    text?: string;
    html?: string;

    inlines?: Record<string, string | ArrayBuffer>;
    attachments?: Record<string, string | ArrayBuffer>;

    name: string; // email from name
    subject: string; // email subject

    from: string; // email from address
    // reply: string; // email reply to address

    to: string | Array<string>; // email to address

    cc?: Array<string>;
    bcc?: Array<string>;
};

// export type TemplateContent = {
//     [name: string]: string | number | boolean;
// };

// export type TemplateData = {
//     link: string; // link
//     title: string; // title
//     provider: string; // provider
//     content: TemplateContent;
// };
