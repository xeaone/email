
export default function (data: Record<string, string>, lines: Array<string>) {
	return `
		Hello,

		You have received a ${data.$name} submission from ${data.$domain}.

		${lines.join('\n')}

		Powered By ${data.$byName}
	`;
}
