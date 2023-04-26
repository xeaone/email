import dash from './dash.ts';
import { htmlEntity, attributeEntity } from './encode.ts';
// deno-fmt-ignore-file

const style = (item: { style?: Record<string, string> }) => {
    const result = [];

    for (const name in item.style) {
        const value = item.style[name];
        result.push(`${dash(name)}: ${value};`);
    }

    return result.length ? `style="${attributeEntity(result.join(' '))}"` : '';
}

const attributes = (item: { attributes?: Record<string, string> }) => {
    const result = [];

    for (const name in item.attributes) {
        const value = item.attributes[name];
        result.push(`${dash(name)}="${attributeEntity(value)}"`);
    }

    return result.join(' ');
}

const tag = (data: string) => {
    return htmlEntity(data);
}

type Element = {
    style?: Record<string, string>,
    attributes?: Record<string, string>,

    tag: string,
    text: string,
}

type ColumnInner = {
    align?: string,
    valign?: string,
    style?: Record<string, string>,

    elements: Array<Element>,
}

type RowInner = {
    style?: Record<string, string>,
    columns: Array<ColumnInner>,
}

type ColumnOuter = {
    align?: string,
    valign?: string,
    style?: Record<string, string>,

    rows: Array<RowInner>,
}

type RowOuter = {
    style?: Record<string, string>,
    columns: Array<ColumnOuter>,
}

type Root = {
    color?: string,
    padding?: string,
    fontSize?: string,
    fontFamily?: string,
    backgroundColor?: string,

    title?: string,

    rows?: Array<RowOuter>,
}

export default ({
    color = '#000',
    padding = '9px',
    fontSize = '18px',
    fontFamily = 'sans-serif',
    backgroundColor = '#fff',
    title = '',
    rows = [],
}: Root = {}) => `
<!DOCTYPE html>
<html lang="en" style="margin: 0; padding: 0; width: 100%; height: 100%">
<head>
    <meta charset="utf-8" />
    <meta name="x-apple-disable-message-reformatting">
    <meta http-equiv="x-ua-compatible" content="ie=edge" />
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, shrink-to-fit=no" />
    <title>${title}</title>
</head>
<body style="
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    color: ${color};
    font-size: ${fontSize};
    font-family: ${fontFamily};
    background-color: ${backgroundColor};
">

    <table width="100%" cellspacing="0" cellpadding="0" border="0" style="
        margin: 0;
        width: 100%;
        color: ${color};
        padding: ${padding};
        font-size: ${fontSize};
        font-family: ${fontFamily};
        background-color: ${backgroundColor};
    ">

        ${(rows || []).map(row => `
        <tr ${style(row)}>

            ${(row.columns || []).map(column => `
            <td align="${column.align || 'center'}" valign="${column.align || 'middle'}">

                <table cellspacing="0" cellpadding="0" border="0" ${style(column)}>

                    ${(column.rows || []).map(row => `
                    <tr ${style(row)}>

                        ${(row.columns || []).map(column => `
                        <td align="${column.align || 'left'}" valign="${column.valign || 'middle'}">

                            ${column.elements?.map(element => `

                            <${tag(element.tag)} ${style(element)} ${attributes(element)}>${htmlEntity(element.text)}</${tag(element.tag)}>

                            `).join('\n')}

                        </td>
                        `).join('\n')}

                    </tr>
                    `).join('\n')}

                </table>

            </td>
            `).join('\n')}

        </tr>
        `).join('\n')}

      </table>

</body>
</html>
`