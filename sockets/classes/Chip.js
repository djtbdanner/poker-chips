class Chip {
    // Create new instances of the same class as static attributes
    static Gray = new Chip("gray", 1);
    static Red = new Chip("red", 5);
    static Green = new Chip("green", 25);
    static Black = new Chip("black", 100);
    constructor(color, value) {
        this.color = color;
        this.value = value;
    }
}
module.exports = Chip