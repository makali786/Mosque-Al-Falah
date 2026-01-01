import React, { Fragment } from 'react';

type TextNode = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  format?: number; // Payload uses a bitmask for formatting (1=bold, 2=italic, etc.)
  type: 'text';
};

type GenericNode = {
  type: string;
  children?: Node[];
  tag?: string; // h1, h2, etc
  listType?: 'number' | 'bullet';
  [key: string]: any;
};

type Node = TextNode | GenericNode;

interface RichTextProps {
  content: {
    root?: {
      children: Node[];
    };
    [key: string]: any;
  } | null;
  className?: string;
}

const IS_BOLD = 1;
const IS_ITALIC = 1 << 1;
const IS_STRIKETHROUGH = 1 << 2;
const IS_UNDERLINE = 1 << 3;
const IS_CODE = 1 << 4;
const IS_SUBSCRIPT = 1 << 5;
const IS_SUPERSCRIPT = 1 << 6;

const RenderNode = ({ node, index }: { node: Node; index: number }) => {
  if (node.type === 'text') {
    const textNode = node as TextNode;
    let text: React.ReactNode = textNode.text;

    if (textNode.format) {
      if ((textNode.format & IS_BOLD)) {
        text = <strong key={index}>{text}</strong>;
      }
      if ((textNode.format & IS_ITALIC)) {
        text = <em key={index}>{text}</em>;
      }
      if ((textNode.format & IS_UNDERLINE)) {
        text = <u key={index}>{text}</u>;
      }
      if ((textNode.format & IS_STRIKETHROUGH)) {
        text = <s key={index}>{text}</s>;
      }
      if ((textNode.format & IS_CODE)) {
        text = <code key={index}>{text}</code>;
      }
    }
    
    return <Fragment key={index}>{text}</Fragment>;
  }

  const genericNode = node as GenericNode;

  if (!genericNode.children) {
    return null;
  }

  const children = genericNode.children.map((child, i) => (
    <RenderNode key={i} node={child} index={i} />
  ));

  switch (genericNode.type) {
    case 'h1':
      return <h1 key={index} className="text-4xl font-bold mb-4">{children}</h1>;
    case 'h2':
      return <h2 key={index} className="text-3xl font-bold mb-3">{children}</h2>;
    case 'h3':
      return <h3 key={index} className="text-2xl font-bold mb-2">{children}</h3>;
    case 'h4':
      return <h4 key={index} className="text-xl font-bold mb-2">{children}</h4>;
    case 'h5':
      return <h5 key={index} className="text-lg font-bold mb-2">{children}</h5>;
    case 'h6':
      return <h6 key={index} className="text-base font-bold mb-2">{children}</h6>;
    case 'ul':
      return <ul key={index} className="list-disc pl-5 mb-4 space-y-1">{children}</ul>;
    case 'ol':
      return <ol key={index} className="list-decimal pl-5 mb-4 space-y-1">{children}</ol>;
    case 'li':
      return <li key={index}>{children}</li>;
    case 'link':
       return (
        <a key={index} href={genericNode.url} target={genericNode.newTab ? "_blank" : "_self"} rel={genericNode.newTab ? "noopener noreferrer" : ""} className="text-blue-600 hover:underline">
          {children}
        </a>
      );
    case 'paragraph': 
      // Check if it's the last paragraph to avoid extra margin, or just use standard
      return <p key={index} className="mb-4">{children}</p>;
      
    default:
      return <div key={index}>{children}</div>;
  }
};

export const RichTextRenderer: React.FC<RichTextProps> = ({ content, className }) => {
  if (!content || !content.root || !content.root.children) {
    return null;
  }

  return (
    <div className={className}>
      {content.root.children.map((node, index) => (
        <RenderNode key={index} node={node} index={index} />
      ))}
    </div>
  );
};
