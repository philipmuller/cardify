import { v4 as uuidv4 } from 'uuid';

export class Card {
    id: string;
    front: string;
    back: string;

    constructor(front: string, back: string, id?: string) {
        this.front = front ?? 'Default Front';
        this.back = back ?? 'Default Back';
        this.id = id ?? uuidv4();
    }

    static empty(): Card {
        return new Card('', '');
    }

    static fromJSON(json: string): Card {
        const data = JSON.parse(json);
        const card = new Card(data.front, data.back, data.id);
        return card;
    }

    toJSON(): string {
        return JSON.stringify({
            id: this.id,
            front: this.front,
            back: this.back
        });
    }

    plainObject(): any {
        return {
            id: this.id,
            front: this.front,
            back: this.back
        };
    }
}
  
export class Deck {
    id: string;
    title: string;
    cards: Card[];

    constructor(cards: Card[], title?: string, id?: string) {
        this.title = title ?? 'Default Title';
        this.cards = cards;
        this.id = id ?? uuidv4();
    }

    static fromJSON(json: string): Deck {
        const data = JSON.parse(json);
        const cards = data.cards.map((cardData: any) => Card.fromJSON(JSON.stringify(cardData)));
        const deck = new Deck(cards, data.title, data.id);
        return deck;
    }

    toJSON(): string {
        return JSON.stringify({
            cards: this.cards,
            title: this.title,
            id: this.id,
        });
    }

    plainObject(): any {
        return {
            id: this.id,
            title: this.title,
            cards: this.cards.map((card: Card) => card.plainObject()),
        };
    }
}