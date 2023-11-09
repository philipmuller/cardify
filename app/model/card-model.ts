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

    static empty(): Deck {
        return new Deck([], '');
    }
    
}