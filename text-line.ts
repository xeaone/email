
export default function (name:string, value:string) {
    name = name.replace(/([A-Z])/g, ' $1').toLowerCase();
    return `${name}: ${value}`;
}
