
export default (name: string, value: string | number | boolean) =>
    `${name.replace(/([A-Z])/g, ' $1').toLowerCase()}: ${value}`;
