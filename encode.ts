// https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html#output-encoding-rules-summary

const attributeEntityPattern = /[^a-zA-Z0-9]/ig;

export const attributeEntity = (data: string) =>
    data.replace(attributeEntityPattern, match =>
        `&#x${match.charCodeAt(0).toString(16)};`
    );

const htmlEntityMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
};

const htmlEntityPattern = /[&<>"'/]/ig;

export const htmlEntity = (data: string) =>
    data.replace(htmlEntityPattern, match =>
        htmlEntityMap[match]
    );
