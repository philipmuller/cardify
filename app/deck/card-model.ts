//import { v4 as uuidv4 } from 'uuid';

export interface Card {
    //id = uuidv4();
    front: string;
    back: string;
}
  
export interface Deck {
    title: string;
    cards: Card[];
}