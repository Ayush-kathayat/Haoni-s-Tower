const input = document.getElementById ("input-n");
const okBtn = document.getElementById ("btn-input-n");

const rods = [
    document.getElementById ("rod1"),
    document.getElementById ("rod2"),
    document.getElementById ("rod3")
];

const discs = [];

const disc1 = document.createElement ("div");
disc1.class ("disc");

rods[0].appendChild (disc1);

const createDisc = ( n ) => {
    const disc = disc.cloneNode (deep);
    const width = getComputedStyle (disc).width;
    disc.style.width = width * n;
    return disc;
}

