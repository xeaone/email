
export default (data: string) => {
    return data.replace(/[A-Z]/g, match => '-' + match.toLowerCase());
}
