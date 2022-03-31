const bosses = require('./all-bosses.json')
const data = bosses.data

let maxChars = 0
data.forEach(element => {
    // if (element.name.length > maxChars) {
    //     maxChars = element.name.length
    // }
    // console.log(element.name.length);

    if (element.name.length == 30) {
        console.log(element.name);
    }

});

console.log(maxChars);
