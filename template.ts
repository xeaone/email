// deno-fmt-ignore-file

const Dash = (data: string) => {
    return data.replace(/[A-Z]/g, c => '-' + c.toLowerCase());
}

const Style = (item: Item | Container, style?: Record<string, string>) => {
    let result = '';

    for (const name in item.style) {
        const value = item.style[name];
        result += ` ${Dash(name)}: ${value};`;
    }

    for (const name in style) {
        const value = style[name];
        result += ` ${Dash(name)}: ${value};`;
    }

    return `style="${result}"`;
}

const Attributes = (item: Item) => {
    let result = '';

    for (const name in item.attributes) {
        const value = item.attributes[name];
        result += `${Dash(name)}="${value}"`;
    }

    return result;
}

type Item = {

    style?: Record<string, string>,
    attributes?: Record<string, string>,

    align?: string,
    valign?: string,

    tag: string,
    text: string,
}

type Container = {
    style?: Record<string, string>,
    items?: Array<Item>,
}

type Root = {
    color?: string,
    margin?: string,
    padding?: string,
    fontSize?: string,
    fontFamily?: string,
    backgroundColor?: string,

    title?: string,

    containers?: Array<Container>,
}

export default ({
    color = '#000',
    margin = '4px',
    padding = '9px',
    fontSize = '18px',
    fontFamily = 'sans-serif',
    backgroundColor = '#fff',
    title = '',
    containers = [],
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
        width: 100%;
        color: ${color};
        margin: 0;
        padding: ${padding};
        font-size: ${fontSize};
        font-family: ${fontFamily};
        background-color: ${backgroundColor};
    ">

        ${(containers || []).map(container => `
        <tr>
        <td align="center" valign="middle">
        <table width="100%" cellspacing="0" cellpadding="0" border="0"
            ${Style(container, { width: '100%', minWidth: '300px', maxWidth: '600px' })}
        >

            ${(container.items || []).map(item => `
            <tr>
            <td align="${item.align || 'left'}" valign="${item.valign || 'middle'}">
                <${item.tag}
                    ${Attributes(item)}
                    ${Style(item, { display: 'inline-block', textDecoration: 'none', boxSizing: 'border-box' })}
                >${item.text}</${item.tag}>
            </td>
            </tr>
            `).join('\n')}

        </table>
        </td>
        </tr>
        `).join('\n')}

      </table>

</body>
</html>
`

/*
style="

            color: ${container.color || color};
            margin: ${container.margin || margin};
            padding: ${container.padding || padding};
            font-size: ${container.fontSize || fontSize};
            font-family: ${container.fontFamily || fontFamily};
            border-radius: ${container.borderRadius || borderRadius};
            background-color: ${container.backgroundColor || backgroundColor};

        "
*/