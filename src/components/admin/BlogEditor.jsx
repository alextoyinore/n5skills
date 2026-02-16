import React, { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Table from '@editorjs/table';
import Quote from '@editorjs/quote';
import Code from '@editorjs/code';
import LinkTool from '@editorjs/link';
import Marker from '@editorjs/marker';
import InlineCode from '@editorjs/inline-code';
import Underline from '@editorjs/underline';
import ImageTool from '@editorjs/image';
import Chart from 'editorjs-chart';
import { uploadImage } from '../../utils/cloudinary';

const BlogEditor = ({ data, onChange, holderId = 'editorjs' }) => {
    const ejInstance = useRef();
    const isInitialized = useRef(false);

    useEffect(() => {
        if (!isInitialized.current) {
            initEditor();
            isInitialized.current = true;
        }
        return () => {
            if (ejInstance.current && ejInstance.current.destroy) {
                ejInstance.current.destroy();
                ejInstance.current = null;
                isInitialized.current = false;
            }
        };
    }, []);

    const initEditor = () => {
        const editor = new EditorJS({
            holder: holderId,
            data: data && Object.keys(data).length > 0 ? data : { blocks: [] },
            onReady: () => {
                ejInstance.current = editor;
                console.log('Editor.js is ready!');
            },
            onChange: async () => {
                const content = await editor.save();
                onChange(content);
            },
            autofocus: true,
            tools: {
                header: {
                    class: Header,
                    inlineToolbar: ['link'],
                    config: {
                        placeholder: 'Enter a header',
                        levels: [2, 3, 4],
                        defaultLevel: 2
                    }
                },
                list: {
                    class: List,
                    inlineToolbar: true,
                },
                table: {
                    class: Table,
                    inlineToolbar: true,
                },
                quote: {
                    class: Quote,
                    inlineToolbar: true,
                    config: {
                        quotePlaceholder: 'Enter a quote',
                        captionPlaceholder: 'Quote\'s author',
                    },
                },
                chart: {
                    class: Chart,
                },
                image: {
                    class: ImageTool,
                    config: {
                        uploader: {
                            uploadByFile: async (file) => {
                                try {
                                    const result = await uploadImage(file);
                                    return {
                                        success: 1,
                                        file: {
                                            url: result.url,
                                        }
                                    };
                                } catch (error) {
                                    console.error('Image upload failed:', error);
                                    return {
                                        success: 0
                                    }
                                }
                            },
                        }
                    }
                },
                code: Code,
                linkTool: LinkTool,
                marker: Marker,
                inlineCode: InlineCode,
                underline: Underline,
            },
        });
    };

    return <div id={holderId} className="editorjs-container" />;
};

export default BlogEditor;
