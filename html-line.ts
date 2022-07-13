
export default function (name: string, value: string) {
	name = name.replace(/([A-Z])/g, ' $1').toLowerCase();
	return /*html*/`
		<tr>
			<td style="font-family: sans-serif; font-size: 15px; vertical-align: top; font-weight: bold; text-transform: capitalize;">${name}: </td>
			<td style="font-family: sans-serif; font-size: 15px; vertical-align: top;">${value}</td>
		</tr>
	`;
}
