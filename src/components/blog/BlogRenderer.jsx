import React from 'react';

const BlogRenderer = ({ data }) => {
    if (!data || !data.blocks) return null;

    return (
        <div className="blog-renderer">
            {data.blocks.map((block, index) => {
                switch (block.type) {
                    case 'header':
                        const HeaderTag = `h${block.data.level}`;
                        return <HeaderTag key={index} dangerouslySetInnerHTML={{ __html: block.data.text }} />;

                    case 'paragraph':
                        return <p key={index} dangerouslySetInnerHTML={{ __html: block.data.text }} />;

                    case 'list':
                        const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';

                        const renderListItems = (items) => {
                            return items.map((item, i) => {
                                const content = typeof item === 'string' ? item : (item.content || '');
                                const subItems = item.items || [];

                                return (
                                    <li key={i}>
                                        <span dangerouslySetInnerHTML={{ __html: content }} />
                                        {subItems.length > 0 && (
                                            <ListTag className="blog-list-nested">
                                                {renderListItems(subItems)}
                                            </ListTag>
                                        )}
                                    </li>
                                );
                            });
                        };

                        return (
                            <ListTag key={index} className={`blog-list-${block.data.style}`}>
                                {renderListItems(block.data.items)}
                            </ListTag>
                        );

                    case 'image':
                        return (
                            <figure key={index} className="blog-renderer-image">
                                <img src={block.data.file.url} alt={block.data.caption || ''} />
                                {block.data.caption && <figcaption>{block.data.caption}</figcaption>}
                            </figure>
                        );

                    case 'quote':
                        return (
                            <blockquote key={index}>
                                <p dangerouslySetInnerHTML={{ __html: block.data.text }} />
                                {block.data.caption && <cite>{block.data.caption}</cite>}
                            </blockquote>
                        );

                    case 'code':
                        return (
                            <pre key={index}>
                                <code>{block.data.code}</code>
                            </pre>
                        );

                    case 'delimiter':
                        return <hr key={index} />;

                    case 'table':
                        return (
                            <div key={index} className="blog-renderer-table">
                                <table>
                                    <tbody>
                                        {block.data.content.map((row, i) => (
                                            <tr key={i}>
                                                {row.map((cell, j) => (
                                                    <td key={j} dangerouslySetInnerHTML={{ __html: cell }} />
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        );

                    default:
                        console.warn(`Unknown block type: ${block.type}`, block);
                        return null;
                }
            })}
        </div>
    );
};

export default BlogRenderer;
