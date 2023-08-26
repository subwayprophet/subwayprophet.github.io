function pickRandomColor() {
    let colors = ['red','orange','yellow','green','blue','indigo','violet'];
    return colors[Math.floor(Math.random() * colors.length)];
}