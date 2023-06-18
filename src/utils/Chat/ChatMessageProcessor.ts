import {ChatMessage} from '../../../types';
import * as R from 'ramda';
import {SensitiveWordsUtil} from '@/utils/Chat/sensitiveFilter';

type PaymentType = 'free' | 'paid';

export class ChatMessageProcessor {
    chatMessages: ChatMessage[];
    paymentType: PaymentType;
    maxLength: number;
    maxAssistantContentLength: number;

    constructor(chatMessages: ChatMessage[],
                paymentType: 'free' | 'paid',
                maxLength: number = 2000,
                maxAssistantContentLength: number = 200) {
        // if (!this.isValidChatMessages(chatMessages)) {
        //     throw new Error('Invalid ChatMessage input.');
        // }
        this.chatMessages = this.filterValidMessages(chatMessages);
        this.paymentType = paymentType;
        this.maxLength = maxLength;
        this.maxAssistantContentLength = maxAssistantContentLength;
    }

    get messages(): ChatMessage[] {
        return this.chatMessages;
    }

    get sortedMessages(): ChatMessage[] {
        return this.sortChatMessagesByTime(this.chatMessages);
    }

    private isValidChatMessages = R.allPass([
        R.is(Array),
        R.all(
            R.allPass([
                R.propSatisfies(
                    R.includes(R.__, ['system', 'user', 'assistant']),
                    'role',
                ),
                R.propSatisfies(R.allPass([R.is(String), R.complement(R.isEmpty)]), 'content'),
            ]),
        ),
    ]);

    private filterValidMessages(chatMessages: ChatMessage[]): ChatMessage[] {
        return R.filter(
            R.allPass([
                R.propSatisfies(R.is(Number), 'time'),
                R.propSatisfies(R.includes(R.__, ['system', 'user', 'assistant']), 'role'),
                R.propSatisfies(R.allPass([R.is(String), R.complement(R.isEmpty)]), 'content'),
            ]),
            chatMessages,
        );
    }

    private sortChatMessagesByTime(chatMessages: ChatMessage[]): ChatMessage[] {
        const sortByRoleAndTime = R.sortWith<ChatMessage>([
            R.descend(R.propEq('role', 'system')),
            R.ascend(R.prop<number>('time')),
        ]);
        return sortByRoleAndTime(chatMessages);
    }

    private getMaxLengthMessages(chatMessages: ChatMessage[], maxLength: number): ChatMessage[] {
        const messages = this.sortChatMessagesByTime(chatMessages);
        const totalLength = R.reduce(
            (acc, message) => acc + message.content.length,
            0,
            messages,
        );

        if (totalLength <= maxLength) {
            return messages;
        }

        let remainingLength = totalLength;
        let remainingMessages = messages;

        while (remainingLength > maxLength) {
            remainingMessages = R.tail(remainingMessages);
            remainingLength = R.reduce(
                (acc, message) => acc + message.content.length,
                0,
                remainingMessages,
            );
        }

        return remainingMessages;
    }

    get latestSystemMessage(): ChatMessage | undefined {
        const systemMsgs = this.chatMessages.filter((msg) => msg.role === 'system');
        return systemMsgs.slice(-1)[0];
    }

    get senderMessages() {

        return this.getSenderMessages(
            this.filterSensitiveWords(
            this.assistantShorten(
                this.prepareChatMessages(
                    this.chatMessages))));

    }

    public prepareChatMessages(chatMessages: ChatMessage[]): ChatMessage[] {
        if (this.paymentType === 'paid') {
            return this.sortChatMessagesByTime(chatMessages);
        }
        if (this.paymentType === 'free') {
            let messages = this.chatMessages.filter(
                (msg) => msg.role === 'system' || msg.role === 'user',
            );
            return this.sortChatMessagesByTime(messages);
        }
        return [];
    }

    public getSenderMessages(chatMessages: ChatMessage[]): ChatMessage[] {
        const systemMsgs = this.latestSystemMessage;
        const otherMsgs = chatMessages.filter(
            (msg) => msg.role === 'assistant' || msg.role === 'user',
        );
        const maxLengthMessages = this.getMaxLengthMessages(otherMsgs, this.maxLength);
        if (systemMsgs) {
            return [systemMsgs, ...maxLengthMessages];
        }
        return maxLengthMessages;
    }

    public assistantShorten(chatMessages: ChatMessage[]): ChatMessage[] {
        return chatMessages.map(msg => {
            if (msg.role === 'assistant' && msg.content.length > this.maxAssistantContentLength) {
                return {
                    ...msg,
                    content: msg.content.slice(0, this.maxAssistantContentLength) + '...',
                };
            }
            return msg;
        });
    }


public filterSensitiveWords(chatMessages: ChatMessage[]): ChatMessage[] {
    const filterUserMessage = (msg: ChatMessage) =>
        msg.role === 'user'
            ? {
                ...msg,
                content: SensitiveWordsUtil.getInstance().replace(msg.content),
            }
            : msg;
    return chatMessages.map(filterUserMessage);
}
}



