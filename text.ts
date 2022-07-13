import { Data } from './types.ts';

export default (data: Data, lines: Array<string>) => `
    You have received a ${data.title} submission ${data.link}.

    ${lines.join('\n')}

    Provider ${data.provider}
`;
