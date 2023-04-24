import { TemplateData } from './types.ts';

export const line = (name: string, value: string | number | boolean) => `${name.replace(/([A-Z])/g, ' $1').toLowerCase()}: ${value}`;

export const body = (data: TemplateData, lines: Array<string>) => `
    You have received a ${data.title} submission ${data.link}.

    ${lines.join('\n')}

    Provider ${data.provider}
`;
