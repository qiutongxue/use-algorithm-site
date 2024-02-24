// Register directive nodes in mdast:
/// <reference types="mdast-util-directive" />

import { visit } from 'unist-util-visit'
import { h } from 'hastscript'
import type { Root } from 'mdast'
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
      if (node.name === 'note')
        return handleNoteContainer(node)
      if (node.name === 'leetcode')
        return handleLeetcodeContainer(node)
    })
  }
}

function handleLeetcodeContainer(node: any) {
  const data = node.data ?? (node.data = {})
  const attributes = node.attributes ?? (node.attributes = {})
  attributes.class = 'leetcode-block'

  const links = []
  ;(function getLinks(node) {
    if (node.type && node.type === 'link' && node.url.includes('leetcode')) {
      links.push({
        text: node.children[0].value,
        src: node.url,
      })
      return
    }
    if (node.children)
      node.children.forEach(child => getLinks(child))
  })(node)

  data.hName = 'div'
  data.hProperties = h('div', attributes).properties
  data.hChildren = links.map(link => h('a', { href: link.src, class: 'leetcode-item', target: '_blank' }, link.text))
}

function handleNoteContainer(node: any) {
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
