import React, { useState, useEffect } from 'react';
import { Image, Save, Loader2, Link as LinkIcon, ChevronLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../../utils/supabaseClient';
import { uploadImage } from '../../../utils/cloudinary';
import BlogEditor from '../../../components/admin/BlogEditor';
import '../../../components/admin/BlogEditor.css';

const BlogPostCreateView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(!!id);
    const [fetchingCategories, setFetchingCategories] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [title, setTitle] = useState('');
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState('');
    const [tags, setTags] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState({});
    const [featuredImage, setFeaturedImage] = useState('');

    useEffect(() => {
        fetchCategories();
        if (id) {
            fetchPost();
        }
    }, [id]);

    const fetchCategories = async () => {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .order('name');

            if (error) throw error;
            setCategories(data || []);
            if (data && data.length > 0 && !category) {
                setCategory(data[0].name);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setFetchingCategories(false);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const result = await uploadImage(file);
            setFeaturedImage(result.url);
        } catch (error) {
            console.error('Featured image upload failed:', error);
            alert('Failed to upload image');
        } finally {
            setIsUploading(false);
        }
    };

    const fetchPost = async () => {
        try {
            const { data, error } = await supabase
                .from('blog_posts')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            if (data) {
                setTitle(data.title);
                setCategory(data.category);
                setTags(Array.isArray(data.tags) ? data.tags.join(', ') : '');
                setExcerpt(data.excerpt || '');
                setContent(data.content);
                setFeaturedImage(data.featured_image || '');
            }
        } catch (error) {
            console.error('Error fetching post:', error);
        } finally {
            setFetching(false);
        }
    };

    const generateSlug = (text) => {
        return text
            .toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');
    };

    const handleSave = async (status = 'draft') => {
        if (!title) {
            alert('Please enter a title');
            return;
        }

        setLoading(true);
        const postData = {
            title,
            slug: generateSlug(title),
            category,
            tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
            excerpt,
            content,
            featured_image: featuredImage,
            status,
        };

        try {
            let error;
            if (id) {
                const { error: updateError } = await supabase
                    .from('blog_posts')
                    .update(postData)
                    .eq('id', id);
                error = updateError;
            } else {
                const { error: insertError } = await supabase
                    .from('blog_posts')
                    .insert([postData]);
                error = insertError;
            }

            if (error) throw error;
            navigate('/admin/blog');
        } catch (error) {
            console.error('Error saving blog post:', error);
            alert('Error saving post: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return <div className="loading-state">Loading post details...</div>;
    }

    return (
        <div className="admin-view">
            <header className="admin-header">
                <div className="header-title">
                    <button className="back-btn" onClick={() => navigate('/admin/blog')}>
                        <ChevronLeft size={20} />
                    </button>
                    <h2>{id ? 'Edit Blog Post' : 'Create Blog Post'}</h2>
                </div>
                <div className="header-actions">
                    <button className="btn-filter" onClick={() => navigate('/admin/blog')}>Cancel</button>
                    <button
                        className="btn btn-primary"
                        onClick={() => handleSave('published')}
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="spinner" size={18} /> : <Save size={18} />}
                        Save & Publish
                    </button>
                </div>
            </header>

            <div className="create-form-container glass-card">
                <div className="form-step">
                    <div className="form-group title-group">
                        <label>Post Title</label>
                        <input
                            type="text"
                            placeholder="Enter a compelling title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="title-input"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group category-group">
                            <label>Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                disabled={fetchingCategories}
                            >
                                {fetchingCategories ? (
                                    <option>Loading categories...</option>
                                ) : (
                                    categories.map(cat => (
                                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                                    ))
                                )}
                            </select>
                        </div>
                        <div className="form-group tags-group">
                            <label>Tags (Comma separated)</label>
                            <div className="tags-input-wrapper">
                                <input
                                    type="text"
                                    placeholder="e.g. Tutorial, React, Guide"
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-group image-group-full">
                        <label>Featured Image</label>
                        <div className="upload-area-sm">
                            <div
                                className={`upload-box-sm ${featuredImage ? 'has-image' : ''}`}
                                onClick={() => document.getElementById('featured-image-upload').click()}
                            >
                                <input
                                    type="file"
                                    id="featured-image-upload"
                                    hidden
                                    onChange={handleFileChange}
                                    accept="image/*"
                                />
                                {isUploading ? (
                                    <div className="upload-placeholder">
                                        <Loader2 className="spinner" size={24} />
                                        <span>Uploading...</span>
                                    </div>
                                ) : featuredImage ? (
                                    <div className="image-preview-container">
                                        <img src={featuredImage} alt="Featured" />
                                        <div className="image-overlay">
                                            <span>Change Image</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="upload-placeholder">
                                        <Image size={24} />
                                        <span>Click to Upload</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="form-group excerpt-group">
                    <label>Excerpt (Short Summary)</label>
                    <textarea
                        placeholder="A brief summary for card previews..."
                        rows="2"
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                    ></textarea>
                </div>

                <div className="form-group editor-group">
                    <label>Post Content</label>
                    <BlogEditor
                        data={content}
                        onChange={setContent}
                    />
                </div>
            </div>
        </div>
    );
};

export default BlogPostCreateView;
