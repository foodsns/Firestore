var admin = require("firebase-admin");
const firebase = require('@firebase/testing')

var serviceAccount = require("./service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mogutsou-default-rtdb.asia-southeast1.firebasedatabase.app"
});

function randomString(len, charSet) {
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
}
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //최댓값도 포함, 최솟값도 포함
}
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomColorName() {
    // https://gist.github.com/bobspace/2712980
    const colorList = [
        "AliceBlue",
        "AntiqueWhite",
        "Aqua",
        "Aquamarine",
        "Azure",
        "Beige",
        "Bisque",
        "Black",
        "BlanchedAlmond",
        "Blue",
        "BlueViolet",
        "Brown",
        "BurlyWood",
        "CadetBlue",
        "Chartreuse",
        "Chocolate",
        "Coral",
        "CornflowerBlue",
        "Cornsilk",
        "Crimson",
        "Cyan",
        "DarkBlue",
        "DarkCyan",
        "DarkGoldenRod",
        "DarkGray",
        "DarkGrey",
        "DarkGreen",
        "DarkKhaki",
        "DarkMagenta",
        "DarkOliveGreen",
        "DarkOrange",
        "DarkOrchid",
        "DarkRed",
        "DarkSalmon",
        "DarkSeaGreen",
        "DarkSlateBlue",
        "DarkSlateGray",
        "DarkSlateGrey",
        "DarkTurquoise",
        "DarkViolet",
        "DeepPink",
        "DeepSkyBlue",
        "DimGray",
        "DimGrey",
        "DodgerBlue",
        "FireBrick",
        "FloralWhite",
        "ForestGreen",
        "Fuchsia",
        "Gainsboro",
        "GhostWhite",
        "Gold",
        "GoldenRod",
        "Gray",
        "Grey",
        "Green",
        "GreenYellow",
        "HoneyDew",
        "HotPink",
        "IndianRed",
        "Indigo",
        "Ivory",
        "Khaki",
        "Lavender",
        "LavenderBlush",
        "LawnGreen",
        "LemonChiffon",
        "LightBlue",
        "LightCoral",
        "LightCyan",
        "LightGoldenRodYellow",
        "LightGray",
        "LightGrey",
        "LightGreen",
        "LightPink",
        "LightSalmon",
        "LightSeaGreen",
        "LightSkyBlue",
        "LightSlateGray",
        "LightSlateGrey",
        "LightSteelBlue",
        "LightYellow",
        "Lime",
        "LimeGreen",
        "Linen",
        "Magenta",
        "Maroon",
        "MediumAquaMarine",
        "MediumBlue",
        "MediumOrchid",
        "MediumPurple",
        "MediumSeaGreen",
        "MediumSlateBlue",
        "MediumSpringGreen",
        "MediumTurquoise",
        "MediumVioletRed",
        "MidnightBlue",
        "MintCream",
        "MistyRose",
        "Moccasin",
        "NavajoWhite",
        "Navy",
        "OldLace",
        "Olive",
        "OliveDrab",
        "Orange",
        "OrangeRed",
        "Orchid",
        "PaleGoldenRod",
        "PaleGreen",
        "PaleTurquoise",
        "PaleVioletRed",
        "PapayaWhip",
        "PeachPuff",
        "Peru",
        "Pink",
        "Plum",
        "PowderBlue",
        "Purple",
        "RebeccaPurple",
        "Red",
        "RosyBrown",
        "RoyalBlue",
        "SaddleBrown",
        "Salmon",
        "SandyBrown",
        "SeaGreen",
        "SeaShell",
        "Sienna",
        "Silver",
        "SkyBlue",
        "SlateBlue",
        "SlateGray",
        "SlateGrey",
        "Snow",
        "SpringGreen",
        "SteelBlue",
        "Tan",
        "Teal",
        "Thistle",
        "Tomato",
        "Turquoise",
        "Violet",
        "Wheat",
        "White",
        "WhiteSmoke",
        "Yellow",
        "YellowGreen",
      ] 
    return colorList[getRandomIntInclusive(1, colorList.length - 1) - 1]
}

function insertDummyPost () {
    const id = randomString(20)
    const lat = getRandomArbitrary(33, 43)
    const lot = getRandomArbitrary(124, 132)
    return admin.firestore().collection("posts").add(
        {
            id: `dummy_${id}`,
            title: 'dummy',
            descript: `${Number(lat).toFixed(3)}, ${Number(lot).toFixed(3)}`,
            date: admin.firestore.Timestamp.now(),
            profileImg: 'https://picsum.photos/64/64',
            writer: `${id}`,
            good: getRandomIntInclusive(0, 1000000),
            img: 'https://picsum.photos/200/300',
            lat: getRandomArbitrary(33, 43),
            lot: getRandomArbitrary(124, 132),
            visibility: getRandomArbitrary(0, 1) >= 0.5 ? "public" : "private",
            authorId: id,
            country: 'Korea', 
            city: '서울특별시',
            state: '중구',
            street: '정동',
            hashtag: getRandomColorName()
        })
}

function insertDummyGoods(postId) {
    const id = randomString(20)
    return admin.firestore().collection("posts").doc(postId).collection("goods").add({
        authorId: id,
        setTime: admin.firestore.Timestamp.now()
    })
}

function createDummyPostAndGoodsLog(size) {
    return insertDummyPost()
    .then(result => Promise.all(new Array(size).fill(undefined).map(() => insertDummyGoods(result.id))))
}
const size = 10
Promise.all(new Array(size).fill(undefined).map(() => createDummyPostAndGoodsLog(size)))
.then(result => {
    console.log(result)
})

