export function petDataGenerator(): string {
    const names = [
        'Luna', 'Max', 'Rocky', 'Bella', 'Thor', 'Coco', 'Milo', 'Toby',
        'Nala', 'Simba', 'Zeus', 'Lola', 'Bruno', 'Daisy', 'Buddy', 'Oso',
        'Rex', 'Sasha', 'Chloe', 'Kira', 'Bruce', , 'Jason', 'Easter'
    ];

    const adjectives = [
        'Feliz', 'Valiente', 'Travieso', 'Ágil', 'Fuerte', 'Tierno', 'Sabio',
        'Rápido', 'Pequeño', 'Dormilón', 'Batman', 'Robin', 'Egg'
    ];

    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];

    return `${randomName}-${randomAdjective}-${Math.floor(Math.random() * 1000)}`;
}