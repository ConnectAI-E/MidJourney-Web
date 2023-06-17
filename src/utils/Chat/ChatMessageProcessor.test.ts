import {test, it,expect, describe} from 'vitest';
import {ChatMessage} from '../../../types';
import {ChatMessageProcessor} from '@/utils/Chat/ChatMessageProcessor';
import {dec} from 'ramda';

describe('ChatMessageProcessor init', () => {
    test('ChatMessageProcessor.constructor should validate and set input data correctly', (t) => {
        // Arrange
        const inputData: ChatMessage[] = [
            { role: 'assistant', content: '2', time: 1234567890 },
        ]
        const payType = 'free'
        // Act
        const instance = new ChatMessageProcessor(inputData, payType)
        // Assert
        expect(instance instanceof ChatMessageProcessor)
        expect(instance.messages).toEqual([
                { role: 'assistant', content: '2', time: 1234567890 }
            ]
        )
    })

    test('empty msg', () => {
        // Arrange
        const inputData: any = [
            { role: 'unknown', content: 'Unknown message' }, // Invalid role
            { role: 'system', content: [] }, // Invalid content
            { content: 'Missing role field' } // Missing role field
        ];
        const payType = 'free';
        const instance = new ChatMessageProcessor(inputData, payType)
        // Assert
        expect(instance instanceof ChatMessageProcessor)
        expect(instance.messages).toEqual([])

    });
})

describe('chat messages', () => {

    test('1. sort msg by time', function () {
        const inputData: ChatMessage[] = [
            { role: 'user', content: '2', time: 1234567891 },
            { role: 'system', content: '1', time: 1234567810 },
            { role: 'assistant', content: '2', time: 1234567894 },
            { role: 'assistant', content: '3', time: 1234567892 },
            { role: 'assistant', content: '2', time: 1234567893 },
        ]
        const payType = 'free';
        const instance = new ChatMessageProcessor(inputData, payType)
        // Assert
        expect(instance instanceof ChatMessageProcessor)
        expect(instance.sortedMessages).toEqual([
            { role: 'system', content: '1', time: 1234567810 },
            { role: 'user', content: '2', time: 1234567891 },
            { role: 'assistant', content: '3', time: 1234567892 },
            { role: 'assistant', content: '2', time: 1234567893 },
            { role: 'assistant', content: '2', time: 1234567894 },
        ])
    });

})

describe('get latestSystemMessage', () => {
    test ('1. normal  ', function () {
        const inputData: ChatMessage[] = [
            { role: 'user', content: '2', time: 1234567891 },
            { role: 'system', content: '1', time: 1234567810 },
            { role: 'assistant', content: '2', time: 1234567893 },
            { role: 'assistant', content: '2', time: 1234567893 },
        ]
        const payType = 'free';
        const instance = new ChatMessageProcessor(inputData, payType)
        // Assert
        expect(instance.latestSystemMessage).toEqual({ role: 'system', content: '1', time: 1234567810 })
    })

    test ('2. empty ', function () {
        const inputData: ChatMessage[] = [
            { role: 'user', content: '2', time: 1234567891 },
            { role: 'assistant', content: '2', time: 1234567893 },
            { role: 'assistant', content: '2', time: 1234567893 },
        ]
        const payType = 'free';
        const instance = new ChatMessageProcessor(inputData, payType)
        // Assert
        expect(instance.latestSystemMessage).toEqual(undefined)
    })

    test ('3. multi ', function () {
        const inputData: ChatMessage[] = [
            { role: 'user', content: '2', time: 1234567891 },
            { role: 'system', content: '1', time: 1234567810 },
            { role: 'system', content: '1', time: 1234567812 },
            { role: 'assistant', content: '2', time: 1234567893 },
        ]
        const payType = 'free';
        const instance = new ChatMessageProcessor(inputData, payType)
        // Assert
        expect(instance.latestSystemMessage).toEqual({ role: 'system', content: '1', time: 1234567812 })
    })
})


describe('get chat msg', () => {
    test ('1.  free    ', function () {
        const inputData: ChatMessage[] = [
            { role: 'user', content: 'a', time: 1234567891 },
            { role: 'system', content: 'a', time: 1234567810 },
            { role: 'assistant', content: 'a', time: 1234567893 },
            { role: 'assistant', content: 'aa', time: 1234567893 },
        ]
        const payType = 'free';
        const instance = new ChatMessageProcessor(inputData, payType,3)
        // Assert
        expect(instance.senderMessages).toEqual([
            { role: 'system', content: 'a', time: 1234567810 },
            { role: 'user', content: 'a', time: 1234567891 },
        ])
    })

    test ('2.  free    ', function () {
        const inputData: ChatMessage[] = [
            { role: 'user', content: 'a', time: 1234567891 },
            { role: 'system', content: 'a', time: 1234567810 },
            { role: 'assistant', content: 'a', time: 1234567893 },
            { role: 'user', content: 'a', time: 1234567893 },
            { role: 'assistant', content: 'aa', time: 1234567893 },
        ]
        const payType = 'free';
        const instance = new ChatMessageProcessor(inputData, payType,2)
        // Assert
        expect(instance.senderMessages).toEqual([
            { role: 'system', content: 'a', time: 1234567810 },
            { role: 'user', content: 'a', time: 1234567891 },
            { role: 'user', content: 'a', time: 1234567893 },
        ])
    })

    test ('3.  paid    ', function () {
        const inputData: ChatMessage[] = [
            { role: 'user', content: 'a', time: 1234567891 },
            { role: 'system', content: 'a', time: 1234567810 },
            { role: 'assistant', content: 'a', time: 1234567893 },
            { role: 'user', content: 'a', time: 1234567893 },
            { role: 'assistant', content: 'aa', time: 1234567893 },
        ]
        const payType = 'paid';
        const instance = new ChatMessageProcessor(inputData, payType,3)
        // Assert
        expect(instance.senderMessages).toEqual([
            { role: 'system', content: 'a', time: 1234567810 },
            { role: 'user', content: 'a', time: 1234567893 },
            { role: 'assistant', content: 'aa', time: 1234567893 },
        ])
    })

    test ('4.  shorten assistant    ', function () {
        const inputData: ChatMessage[] = [
            { role: 'system', content: 'a', time: 1234567810 },
            { role: 'user', content: 'a', time: 1234567893 },
            { role: 'assistant', content: 'hello22', time: 1234567894 },
        ]
        const payType = 'paid';
        const instance = new ChatMessageProcessor(
            inputData, payType,6,2)
        // Assert
        expect(instance.senderMessages).toEqual([
            { role: 'system', content: 'a', time: 1234567810 },
            { role: 'user', content: 'a', time: 1234567893 },
            { role: 'assistant', content: 'he...', time: 1234567894 },
        ])
    })


    test ('4.  filter sensitive    ', function () {
        const inputData: ChatMessage[] = [
            { role: 'system', content: 'a', time: 1234567810 },
            { role: 'user', content: '习近平', time: 1234567893 },
        ]
        const payType = 'paid';
        const instance = new ChatMessageProcessor(
            inputData, payType,6,2)
        // Assert
        expect(instance.senderMessages).toEqual([
            { role: 'system', content: 'a', time: 1234567810 },
            { role: 'user', content: '***', time: 1234567893 },
        ])
    })
})
