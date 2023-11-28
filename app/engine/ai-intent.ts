//Classess that implement AIIntentProvider can define the intent behind AIEngine requests

export class AIIntent {
    system: string;
    prependMessage?: string;
    appendMessage?: string;

    constructor(params: {system: string, prependMessage?: string, appendMessage?: string}) {
        this.system = params.system;
        this.prependMessage = params.prependMessage;
        this.appendMessage = params.appendMessage;
    }

    static createFlashcardDeckFromText(): AIIntent {
        const context = flashcardContext;
        const appendMessage = generateFromTextAboveMessage;

        return new AIIntent({system: context, appendMessage: appendMessage});
    }

    static startFlashcardDeckFromLiveAudioTranscription(): AIIntent {
        const context = flashcardContext;
        const prependMessage = initialGenerateFromLiveAudioMessage;
        const appendMessage = generateFromLiveAudioSnippetAboveMessage;

        return new AIIntent({system: context, prependMessage: prependMessage, appendMessage: appendMessage});
    }

    static continueFlashcardDeckFromLiveAudioTranscription(): AIIntent {
        const context = flashcardContext;
        const prependMessage = generateFromLiveAudioHereIsTheNextSnippetMessage;
        const appendMessage = generateFromLiveAudioSnippetAboveMessage;

        return new AIIntent({system: context, prependMessage: prependMessage, appendMessage: appendMessage});
    }

    static createFlashcardDeckFromFile(): AIIntent {
        const context = flashcardContext;
        const prependMessage = generateFromAttachedFileMessage;

        return new AIIntent({system: context, prependMessage: prependMessage});
    }

    static generic(): AIIntent {
        const context = `You are a helpful assistant`;

        return new AIIntent({system: context});
    }

}

//Strings library. This is here to prevent indentation issues with multiline strings

const flashcardContext = `\
You are a flashcard assistant and generator.\
You help students and teachers to create flashcards and help users study with flashcards.\
`;

const generateFromTextAboveMessage = `\
------------------
Read, analyze and understand the user submitted text above.\
Then, create a title of what the text is about of maximum 5 words and create a series of flashcards that capture the key concepts from the text.\
IMPORTANT: use only information from the text to create flashcards, do not use any other information you might have about the topic.\
If the text doesn't contain enough information to create flashcards, return just the title and no cards.\
Make sure to format your response in the following format:

Title: insert title here

Q: insert first question here
A: insert first answer here

Q: insert second question here
A: insert second answer here

(and so on)

Do not include any text other than a title and a sequence of Q and A strings on separated lines.\
Make sure each new line starts with either Title:, Q: or A:.\
Do not describe what you are doing or understanding, just output the lines following the described formatting.\
`;

const initialGenerateFromLiveAudioMessage = `\
You are currently listening to a live audio stream.\
Below, you will find a series of transcription snippets from the audio stream.\
These will keep coming added over time as the audio stream continues.\
The snippets are continuous, so putting them all together forms a full transcription.\
To understand what one snippet is about, it may sometimes be necessary to refer to previous snippets or the transcript as a whole.\
With every snippet, you will generate flashcards that capture the key concepts from the snippet.\
Read, analyze and understand the snippet.\
IMPORTANT: use only information from the text to create flashcards, do not use any other information you might have about the topic.\
If the snippet doesn't contain enough information to create flashcards, return an empty string.\
Make sure to format your response in the following format:

Title: insert title here

Q: insert first question here
A: insert first answer here

Q: insert second question here
A: insert second answer here

(and so on)

Do not include any text other than a title and a sequence of Q and A strings on separated lines.\
Make sure each new line starts with either Title:, Q: or A:.\
Title is an optional field. Include a title only if you think you understand what the whole transcript is about.\
The title is global for all snippets, so if you include a title, it will be the same for all snippets.\
If you include a title but a title was already provided, the new title will replace the old one.\
Do not describe what you are doing or understanding, just output the lines following the described formatting.\

Here is the first snippet transcription:
`;

const generateFromLiveAudioSnippetAboveMessage = `
------------------
Above, you can read the snippet. As a reminder, create the flashcards using the following format:

Q: insert first question here
A: insert first answer here

(and so on)

Optionally, you can include a title with the following format:

Title: insert title here

Do not include any text other than a title and a sequence of Q and A strings on separated lines.\
`;

const generateFromLiveAudioHereIsTheNextSnippetMessage = `\
Here is the next snippet transcription:

`;

const generateFromAttachedFileMessage = `\
Read, analyze and understand the attached file.\
Then, create a title of what the file is about of maximum 5 words and create a series of flashcards that capture the key concepts from the file.\
IMPORTANT: use only information from the file to create flashcards, do not use any other information you might have about the topic.\
Make sure to format your response in the following format:

Title: insert title here

Q: insert first question here
A: insert first answer here

Q: insert second question here
A: insert second answer here

(and so on)

Do not include any text other than a title and a sequence of Q and A strings on separated lines.\
Make sure each new line starts with either Title:, Q: or A:.\
Do not describe what you are doing or understanding, just output the lines following the described formatting.\
`;
