import { visit } from 'unist-util-visit'
import { h } from 'hastscript'
import type { Root } from 'remark-directive'
import { toHast } from 'mdast-util-to-hast'

// const containerTypes = ["info", "warning", "danger", "tip", "details"];

/**
 *  使用方式： https://github.com/syntax-tree/mdast-util-directive#syntax-tree
 *  1. type === 'textDirective':
 *      :name[text]{attributes}
 *  2. type === 'leafDirective':
 *      ::name[text](attributes)
 *  3. type === 'containerDirective':
 *      :::name[firstLine]{attributes}
 *        other content
 *      :::
 */
export default function remarkContainerPlugin() {
  return (tree: Root) => {
    visit(tree, 'containerDirective', (node) => {
      if (node.type === 'containerDirective') {
        if (node.name !== 'note')
          return

        const data = node.data ?? (node.data = {})
        const attributes = node.attributes ?? (node.attributes = {})

        const containerType = attributes.class
        const tagName = containerType === 'details' ? 'details' : 'div'
        attributes.class = `${containerType} custom-block`

        data.hName = tagName
        data.hProperties = h(tagName, attributes).properties

        data.hChildren = [
          // title
          h('p', { class: 'custom-block-title' }, [containerType.toUpperCase()]),
          // body
          ...node.children.map(n => toHast(n)),
        ]
      }
    })
  }
}
