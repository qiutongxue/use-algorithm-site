import { visit } from "unist-util-visit";
import { h } from "hastscript";
import type { Root } from "remark-directive";
import { toHast } from 'mdast-util-to-hast'

// const containerTypes = ["info", "warning", "danger", "tip", "details"];

export default function remarkContainerPlugin() {
  return (tree: Root) => {
    visit(tree, "containerDirective", (node) => {
      if (node.type === "containerDirective") {
        if (node.name !== "note") return;

        const data = node.data || (node.data = {});
        node.attributes ??= {}
        const containerType = node.attributes.class
        const tagName = containerType === 'details' ? "details" : "div"
        node.attributes.class = containerType + " custom-block"

        data.hName = tagName;
        data.hProperties = h(tagName, node.attributes).properties

        data.hChildren = [
          h('p', {class: 'custom-block-title'}, [containerType.toUpperCase()]),
          ...node.children.map(n => toHast(n))
        ]
      }
    });
  };
}
