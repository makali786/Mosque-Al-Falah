import React, { Fragment, JSX } from 'react';
import Image from 'next/image';
import { getMediaUrl, getMediaAlt } from '../../../../lib/helper';

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
  value?: any; // For uploads
  relationTo?: string; // For uploads
  url?: string; // For links
  newTab?: boolean; // For links
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

  if (genericNode.type === 'linebreak') {
    return <br key={index} />;
  }

  // Horizontal rules are handled at the parent level for two-column layout
  if (genericNode.type === 'horizontalrule' || genericNode.type === 'hr') {
    return null;
  }

  const children = genericNode.children?.map((child, i) => (
    <RenderNode key={i} node={child} index={i} />
  ));

  switch (genericNode.type) {
    // Payload CMS Lexical sends headings as type: 'heading' with tag: 'h1', 'h2', etc.
    case 'heading': {
      const HeadingTag = (genericNode.tag || 'h2') as keyof JSX.IntrinsicElements;
      const headingClasses: Record<string, string> = {
        h1: 'text-4xl font-bold mt-14 mb-8',
        h2: 'text-3xl font-bold mb-3',
        h3: 'text-2xl font-bold mb-2',
        h4: 'text-xl font-bold mb-2',
        h5: 'text-lg font-bold mb-2',
        h6: 'text-base font-bold mb-2',
      };
      return <HeadingTag key={index} className={headingClasses[genericNode.tag || 'h2'] || 'font-bold'}>{children}</HeadingTag>;
    }
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
    case 'list': {
      // Payload CMS can send 'list' with listType: 'bullet' or 'number'
      if (genericNode.listType === 'number') {
        return <ol key={index} className="list-decimal pl-5 mb-4 space-y-1">{children}</ol>;
      }
      return <ul key={index} className="list-disc pl-5 mb-4 space-y-1">{children}</ul>;
    }
    case 'ol':
      return <ol key={index} className="list-decimal pl-5 mb-4 space-y-1">{children}</ol>;
    case 'li':
    case 'listitem':
      return <li key={index}>{children}</li>;
    case 'blockquote':
    case 'quote': {
      // Process children to find linebreak and split content
      const childNodes = genericNode.children || [];

      // Find index of linebreak node
      const linebreakIndex = childNodes.findIndex((child: any) => child.type === 'linebreak');

      if (linebreakIndex > 0) {
        // Split children: before linebreak = quote, after linebreak = source
        const quoteNodes = childNodes.slice(0, linebreakIndex);
        const sourceNodes = childNodes.slice(linebreakIndex + 1);

        // Render quote nodes
        const quoteChildren = quoteNodes.map((child: any, i: number) => (
          <RenderNode key={i} node={child} index={i} />
        ));

        // Render source nodes
        const sourceChildren = sourceNodes.map((child: any, i: number) => (
          <RenderNode key={i} node={child} index={i} />
        ));

        return (
          <blockquote key={index}>
            <span className="quote-text">
              {quoteChildren}
            </span>
            {sourceChildren.length > 0 && (
              <span className="quote-source">
                {sourceChildren}
              </span>
            )}
          </blockquote>
        );
      }

      // Fallback: render children as-is
      return (
        <blockquote key={index}>
          {children}
        </blockquote>
      );
    }
    case 'upload': {
      const media = genericNode.value;
      const imageUrl = getMediaUrl(media);
      const altText = getMediaAlt(media);

      if (!imageUrl) return null;

      return (
        <div key={index} className="my-8 relative w-full aspect-video rounded-3xl overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={altText}
            fill
            className="object-cover"
          />
        </div>
      );
    }
    case 'link':
    case 'autolink':
       return (
        <a key={index} href={genericNode.url} target={genericNode.newTab ? "_blank" : "_self"} rel={genericNode.newTab ? "noopener noreferrer" : ""} className="text-blue-600 hover:underline">
          {children}
        </a>
      );
    case 'paragraph':
      return <p key={index} className="mb-4">{children}</p>;

    default:
      // Log unknown types for debugging
      console.log('Unknown node type:', genericNode.type, genericNode);
      return <div key={index}>{children}</div>;
  }
};

export const RichTextRenderer: React.FC<RichTextProps> = ({ content, className }) => {
  if (!content || !content.root || !content.root.children) {
    return null;
  }

  const nodes = content.root.children;

  // Find all horizontal rules
  const hrIndices: number[] = [];
  nodes.forEach((node: any, index: number) => {
    if (node.type === 'horizontalrule' || node.type === 'hr') {
      hrIndices.push(index);
    }
  });

  // If there are horizontal rules, create special layout
  if (hrIndices.length > 0) {
    const renderedIndices = new Set<number>();
    const elements: JSX.Element[] = [];

    hrIndices.forEach((hrIndex, hrNum) => {
      const afterIndex = hrIndex + 1;

      // Find the start of content before this HR block
      const previousContentEnd = hrNum === 0 ? 0 : hrIndices[hrNum - 1] + 4; // Skip previous HR's right content (3 items)

      // Render content between previous HR block and current HR block (but not the last 3)
      const contentBeforeHRBlock = nodes.slice(previousContentEnd, Math.max(previousContentEnd, hrIndex - 3));
      contentBeforeHRBlock.forEach((node: any, idx: number) => {
        const actualIndex = previousContentEnd + idx;
        if (!renderedIndices.has(actualIndex)) {
          elements.push(
            <RenderNode key={actualIndex} node={node} index={actualIndex} />
          );
          renderedIndices.add(actualIndex);
        }
      });

      // Collect the last 3 nodes before HR for left side
      const leftStartIndex = Math.max(previousContentEnd, hrIndex - 3);
      const leftNodes = nodes.slice(leftStartIndex, hrIndex);

      // Collect the next 3 nodes after HR for the right side
      const rightNodes = nodes.slice(afterIndex, afterIndex + 3);

      if (leftNodes.length > 0 && rightNodes.length > 0) {
        elements.push(
          <div key={`hr-layout-${hrIndex}`} className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-12 items-start my-6 md:my-8">
            {/* Left side - 3 elements before HR (65% width) */}
            <div className="w-full lg:w-[65%]">
              {leftNodes.map((node, idx) => {
                const actualIdx = leftStartIndex + idx;
                renderedIndices.add(actualIdx);
                return <RenderNode key={actualIdx} node={node} index={actualIdx} />;
              })}
            </div>

            {/* Vertical divider line (only on desktop) */}
            <div className="hidden lg:block w-px bg-gray-300 self-stretch min-h-50" />

            {/* Right side - next 3 elements after HR (35% width) */}
            <div className="w-full lg:w-[35%]">
              {rightNodes.map((node, idx) => {
                const actualIdx = afterIndex + idx;
                renderedIndices.add(actualIdx);
                return <RenderNode key={actualIdx} node={node} index={actualIdx} />;
              })}
            </div>
          </div>
        );

        renderedIndices.add(hrIndex);
      }
    });

    // Render any remaining content after the last HR (skip the 3 right-side items)
    const lastHrIndex = hrIndices[hrIndices.length - 1];
    const remainingNodes = nodes.slice(lastHrIndex + 4); // +1 for HR, +3 for right side items
    remainingNodes.forEach((node: any, idx: number) => {
      const actualIndex = lastHrIndex + 4 + idx;
      if (!renderedIndices.has(actualIndex)) {
        elements.push(
          <RenderNode key={actualIndex} node={node} index={actualIndex} />
        );
      }
    });

    return <div className={className}>{elements}</div>;
  }

  // No horizontal rule - render normally
  return (
    <div className={className}>
      {nodes.map((node, index) => (
        <RenderNode key={index} node={node} index={index} />
      ))}
    </div>
  );
};
