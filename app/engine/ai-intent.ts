//Classess that implement AIIntentProvider can define the intent behind AIEngine requests

export class AIIntent {
    system: string;
    promptTemplate?: PromptTemplate;

    constructor(system?: string, promptTemplate?: PromptTemplate) {
        this.system = system ?? "";
        this.promptTemplate = promptTemplate;
    }

    static createFlashcarDeckFromText(): AIIntent {
        const context = `
            You are a flashcard generator. 
            Read, analyze and understand the user submitted text below. 
            After that, create a title of what the text is about of maximum 5 words and create a series of flashcards that capture the key concepts from the text. 
            Make sure to format your response in the following format:
            \nTitle: /insert title here/
            \nQ: /insert question here/
            \nA: /insert answer here/
            \n Do not include any text other than a title and a sequence of Q and A strings on separated lines. 
            Do not describe what you are doing or understanding, just output the lines following the described formatting.`;

        return new AIIntent(context);
    }

    static createFlashcarDeckFromLiveAudioTranscription(): AIIntent {
        const context = `
            You are a flashcard generator.
            What you can see below is the transcription of a lecture segment.
            Read, analyze and understand it. 
            After that, create a title of what this lecture segment is about of maximum 5 words and create a series of flashcards that capture the key concepts from the segments.
            IMPORTANT: use only information from the transcription to create the flashcards, do not use any other information you might have about the topic.
            If the segment doesn't contain enough information to create flashcards, return just the title and no cards.
            Make sure to format your response in the following format:
            \nTitle: /insert title here/
            \nQ: /insert question here/
            \nA: /insert answer here/
            \n Do not include any text other than a title and a sequence of Q and A strings on separated lines. 
            Do not describe what you are doing or understanding, just output the lines following the described formatting.`;

        //Augment with template when using in longer threads

        return new AIIntent(context);
    }

    static generic(): AIIntent {
        const context = `You are a helpful assistant`;

        return new AIIntent(context);
    }

}

export class PromptTemplate {
    prepend: string = "";
    append: string = "";

    constructor(prepend?: string, append?: string) {
        this.prepend = prepend ?? "";
        this.append = append ?? "";
    }
}