export default (name: string, value: string | number | boolean) =>  /*html*/`
<tr>
    <td style="font-family: sans-serif; font-size: 15px; vertical-align: top; font-weight: bold; text-transform: capitalize;">${name.replace(/([A-Z])/g, ' $1').toLowerCase()}: </td>
    <td style="font-family: sans-serif; font-size: 15px; vertical-align: top;">${value}</td>
</tr>
`;