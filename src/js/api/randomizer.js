export default function randomizer() {
    const num = 5;

    const result = Math.floor(Math.random() * num) + 1;

    if (result === 1) {
        return 'За окном жара, надевайте шорты и майки!'
    }

    if (result === 2) {
        return 'На улице холодно, не забудьте подштанники!'
    }

    if (result === 3) {
        return 'Идет дождь, расчехляйте зонт!'
    }

    if (result === 4) {
        return 'Выпал снег, пора брать варежки и играть в снежки!'
    }

    if (result === 5) {
        return 'Кто-то идет в куртке, а кто-то в футболке. Погода аномальная!'
    }
}