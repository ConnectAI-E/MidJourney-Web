import * as R from 'ramda';
import sensitiveWords from './sensitive.txt?raw';
import SensitiveWordTool from 'sensitive-word-tool';
import {words} from 'lodash';

export class SensitiveWordsUtil {
    private static instance: SensitiveWordsUtil;

    sensitiveWordTool: SensitiveWordTool;
    private constructor() {
        if (SensitiveWordsUtil.instance) {
            return SensitiveWordsUtil.instance;
        }
        SensitiveWordsUtil.instance = this;
        const wordList = this.delDuplicateWords(R.split('\n', sensitiveWords))
        this.addWords( wordList);
    }

    public static getInstance() {
        return this.instance || new SensitiveWordsUtil();
    }

    public delDuplicateWords(words: string[]) {
        return words.filter((word, index) => words.indexOf(word) === index);
    }
    /**
     * 将指定的敏感词加入到工具类中
     * @param words 敏感词数组
     */
    public addWords(words: string[]) {
        this.sensitiveWordTool = new SensitiveWordTool();
        this.sensitiveWordTool.addWords(words);
    }

    /**
     * 替换文本中的敏感词
     * @param text 要处理的文本
     * @returns 处理后的文本
     */
    public replace(text: string): string {
        return this.sensitiveWordTool.filter(text);
    }

}



