import { visit } from "unist-util-visit"
import slugify from '../scripts/slugify'
import {fromHtml} from 'hast-util-from-html'

const heads = ['h1', 'h2', 'h3', 'h4', 'h5']

interface TocNode {
    depth: number,
    children: TocNode[],
    id: string,
    title: string
}

export default function remarkTocPlugin() {
    return (root) => {
        const parentStk = [{depth: 0, children: [], id: '', title: ''}]  as TocNode[]
        const map = new Map<string, number>()
        visit(root, node => {
            if (node.type === 'element' && heads.includes(node.tagName)) {
                const depth = heads.indexOf(node.tagName) + 1
                while (parentStk[parentStk.length - 1].depth >= depth) {
                    parentStk.pop()
                }

                // 获取 h 标题
                const title = node.children.map(child => text(child)).join('')
                // id 去重
                let id = slugify(title)
                map.set(id, (map.get(id) || 0) + 1)
                if (map.get(id)! > 1) {
                    id += `-${map.get(id)! - 1}`
                }
                // 设置 tag 的 id
                node.properties["id"] = id

                const tocNode = {
                    depth: depth,
                    children: [],
                    id,
                    title
                }
                parentStk[parentStk.length - 1].children.push(tocNode)
                parentStk.push(tocNode)
            }
        })
        
        const tocRoot = parentStk[0]

        const tocHtml = dfs(tocRoot)

        const rt = fromHtml(tocHtml, { fragment: true })
        
        root.children.unshift(...rt.children)

    }
}

function dfs(node: TocNode) {
    const sub = node.children.length ? `<ol>${node.children.map(child => dfs(child)).join('')}</ol>` : ''
    return node.depth === 0 ? `<nav class="toc">${sub}</nav>` : `<li><a href="#${node.id}">${node.title}</a>${sub}</li>`
}

function text(node) {
    if (!node) return ''
    if (node.type === 'text') return node.value
    if (node.type === 'element') {
        return node.children.map(child => text(child)).join('')
    }
    return ''
}
