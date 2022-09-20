class Stack {
    constructor(discs) {
        this.discs = discs;
        // bind the functions to this object
        this.push = this.push.bind(this);
        this.pop = this.pop.bind(this);
        this.peek = this.peek.bind(this);
        this.isEmpty = this.isEmpty.bind(this);
        this.getDiscs = this.getDiscs.bind(this);
        this.print = this.print.bind(this);
    }

    push(disc) {
        this.discs.push(disc);
    }

    pop() {
        return this.discs.pop();
    }

    peek() {
        return this.discs[this.discs.length - 1];
    }

    isEmpty() {
        return this.discs.length === 0;
    }

    getDiscs() {
        return this.discs;
    }

    print() {
        console.log(this.discs);
    }
};

class Disc {
    constructor(node, size) {
        this.node = node;
        this.size = size;
    }
};

class Rod {
    constructor(div, stack) {
        this.div = div;
        this.stack = stack;

        // bind the functions to this object
        this.getDiv = this.getDiv.bind(this);
        this.getStack = this.getStack.bind(this);
        this.print = this.print.bind(this);
    }
    getDiv() {
        return this.div;
    }
    getStack() {
        return this.stack;
    }
    print() {
        console.log(this.div);
        this.stack.print();
    }

};

class Popup {
    classforType(type) {
        switch (type) {
            case 'success':
                return 'popup-success';
            case 'error':
                return 'popup-error';
            case 'warning':
                return 'popup-warning';
            default:
                return 'popup-info';
        }
    }

    constructor(message, type) {
        // take the arguments
        this.message = message;
        this.type = type;

        // create the DOM element
        this.element = document.createElement('div');
        this.element.classList.add('popup');
        this.element.classList.add(this.classforType(type));
        this.element.innerHTML = message;

        // bind the functions to this object
        this.show = this.show.bind(this);
    }

    show() {
        document.body.appendChild(this.element);
        setTimeout(() => {
            this.element.remove();
        }, 2000);
    }
};

const input = document.getElementById("input-n");
const okBtn = document.getElementById("btn-input-n");
let N;

const rods = [
    new Rod(document.getElementById("rod1"), new Stack([])),
    new Rod(document.getElementById("rod2"), new Stack([])),
    new Rod(document.getElementById("rod3"), new Stack([]))
];

const discs = [];

// // make an element of the popup class to show the test error
// const error = document.createElement ("div");
// error.setAttribute ("class", "popup error-msg");
// error.innerHTML = "Error: Invalid move";

// // make an element to show success
// const success = document.createElement ("div");
// success.setAttribute ("class", "popup success-msg");
// success.innerHTML = "Success: Tower of Hanoi solved";


const invalidMovePopup = new Popup("Invalid move", "error");
const successPopup = new Popup("Tower of Hanoi solved", "success");
const inputErrorPopup = new Popup("N must be between 1 and 12", "error");

const popup = (message, type) => {
    const popup = new Popup(message, type);
    popup.show();
};

// display the popup
const displayPopup = (popup) => {
    document.body.appendChild(popup);
    setTimeout(() => {
        document.body.removeChild(popup);
    }, 2000);
}

const discTemplate = document.createElement("div");
discTemplate.setAttribute("class", "disc");

const createDisc = (level, size) => {
    const disc = discTemplate.cloneNode(true);
    disc.style.setProperty("--level", level);
    disc.style.setProperty("--size", 12 - size - 6);
    return disc;
};

const createDiscs = (N) => {
    // make discs
    --N;
    for (let i = N; i >= 0; i--) {
        discs.push(createDisc(N - i, 11 - i));
    }

    // display and add to the stack
    discs.forEach((disc, i) => {
        rods[0].getDiv().appendChild(disc);
        rods[0].getStack().push(new Disc(disc, N - i));
    });
};

const moveDisc = (from, to) => {

    // take from 'from'
    const disc = rods[from].getDiv().lastChild;
    
    // add to 'to'
    const newDisc = disc.cloneNode(true);
    rods[to].div.appendChild(newDisc);
    
    rods[to].getStack().push(rods[from].getStack().pop());
    {
        // debug
        console.log("from");
        rods[from].getStack().print();
        console.log("to");
        rods[to].getStack().print();

    }
    
    // remove from 'from'
    rods[from].div.removeChild(disc);
}

const startGame = () => {
    const N = Number(input.value);
    if (N > 0 && N < 13) {
        // reset the game
        rods.forEach(rod => rod.getDiv().innerHTML = "");
        discs.length = 0;
        createDiscs(N);
    } else {
        inputErrorPopup.show();
    }
};

const toggleSelect = (() => {

    let selectedRod = undefined;
    const select = (rod) => {
        // change disc and rod colors
        rod.style.setProperty("--color", "var(--color-selected)");
        rod.lastChild.style.setProperty("--color", "var(--color-selected)");

        selectedRod = rod;
    }
    const deselect = () => {
        if (selectedRod === undefined) {
            return;
        }
        // change the disc and rod colors
        selectedRod.style.setProperty("--color", "var(--color-rod)");
        selectedRod.lastChild.style.setProperty("--color", "var(--color-disc)");

        selectedRod = undefined;
    }
    const getSelectedRod = () => {
        return this.selectedRod;
    }
    this.getSelectedRod.bind (this);
    return (rod) => {
        if (selectedRod === undefined) {
            select(rod);
        } else {
            deselect();
        }
    }
});


// check the move is valid
const isValidMove = (from, to) => {
    const fromRod = rods[from];
    const toRod = rods[to];

    if (from === to) {
        return false;
    }
    if (fromRod.stack.isEmpty()) {
        return false;
    }
    if (toRod.stack.isEmpty()) {
        return true;
    }
    if (fromRod.stack.peek().size > toRod.stack.peek().size) {
        return false;
    }
    return true;
};

function main() {

    let from = 0;
    let to = 1;
    let isWaitingMove = false;

    input.addEventListener("keyup", (e) => {
        const N = input.value;
        if (e.key === "Enter") {
            startGame(N);
        }
    });

    okBtn.addEventListener("click", () => {
        const N = input.value;
        startGame(N);
    });

    // game logic
    rods.forEach((rod, i) => {
        rod.getDiv().addEventListener("click", () => {
            if (!isWaitingMove) {
                from = i;
                isWaitingMove = true;
            } else {
                if (i === from) {
                    isWaitingMove = false;
                    return;
                }

                if (!isValidMove(from, i)) {
                    invalidMovePopup.show();
                    isWaitingMove = false;
                    return;
                }

                to = i;
                moveDisc(from, to);
                isWaitingMove = false;
            }
        });
    });

    createDiscs(12);
}

main();