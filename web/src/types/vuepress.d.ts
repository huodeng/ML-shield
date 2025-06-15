declare module 'vuepress'{
    import { DefineComponent } from 'vue'
    interface MarkdownItOptions {
        html?: boolean
        xhtmlOut?: boolean
        breaks?: boolean
        langPrefix?: string
        linkify?: boolean
        typographer?: boolean
        quotes?: string
        highlight?: (str: string, lang: string) => string
    }
    interface Props {
        source?: string
        options?: MarkdownItOptions
    }
    const VueMarkdownIt: DefineComponent<Props>

    export {VueMarkdownIt}

    
}