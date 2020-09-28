function importImages() {
    let obj = {}
    const r = require.context('../assets', false, /\.(png|jpe?g|svg)$/);
    //const r = require.context(path, false, /^\.(png|jpe?g|svg)$/); errors out we cant use a variable
    for (let item of r.keys()) {
        obj[item] = r(item);
    };
    // r.keys().map(item => {
    //     obj[item] = r(item);
    // }); 
    return obj
}

export default importImages