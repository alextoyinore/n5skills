import { useLocation } from 'react-router-dom';
import CourseCard from '../../components/course/CourseCard';
import { Sliders, X, Loader2 } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import './CourseList.css';

const CourseList = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialCategory = queryParams.get('category') || 'All';

    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState(["All"]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState(initialCategory);
    const [priceFilter, setPriceFilter] = useState('All');
    const [levelFilter, setLevelFilter] = useState('All');
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        const category = new URLSearchParams(location.search).get('category') || 'All';
        setActiveCategory(category);
    }, [location.search]);

    const fetchInitialData = async () => {
        try {
            setLoading(true);

            // 1. Fetch Categories
            const { data: catData, error: catError } = await supabase
                .from('categories')
                .select('name')
                .order('name');

            if (catError) throw catError;
            setCategories(["All", ...catData.map(c => c.name)]);

            // 2. Fetch All Published Courses
            console.log('Fetching all published courses...');
            const { data: courseData, error: courseError } = await supabase
                .from('courses')
                .select(`
                    *,
                    categories (name)
                `)
                .eq('status', 'published')
                .order('created_at', { ascending: false });

            if (courseError) {
                console.error('Course fetch error:', courseError);
                throw courseError;
            }

            console.log('Fetched courses for list:', courseData);
            setCourses(courseData || []);

        } catch (error) {
            console.error('Error fetching course list:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCourses = courses.filter(course => {
        const categoryMatch = activeCategory === 'All' || (course.categories?.name || course.category) === activeCategory;
        const levelMatch = levelFilter === 'All' || course.level === levelFilter;
        const priceMatch = priceFilter === 'All' || (priceFilter === 'Free' ? course.price === 0 : course.price > 0);
        return categoryMatch && levelMatch && priceMatch;
    });

    return (
        <div className="course-list-page">
            <header className="course-list-header container">
                <div className="header-top">
                    <h1>{activeCategory === 'All' ? 'All Courses' : activeCategory}</h1>
                    <button
                        className="filter-drawer-toggle"
                        onClick={() => setIsFilterDrawerOpen(true)}
                    >
                        <Sliders size={20} /> Filters
                    </button>
                </div>
                <p>Browse our catalog of world-class courses and start learning today.</p>
            </header>

            <div className={`filter-overlay ${isFilterDrawerOpen ? 'active' : ''}`} onClick={() => setIsFilterDrawerOpen(false)} />

            <aside className={`filter-drawer ${isFilterDrawerOpen ? 'open' : ''}`}>
                <div className="drawer-header">
                    <h3>Filters</h3>
                    <button className="close-drawer" onClick={() => setIsFilterDrawerOpen(false)}>
                        <X size={24} />
                    </button>
                </div>

                <div className="drawer-content">
                    <div className="filter-item">
                        <label>Category</label>
                        <select
                            value={activeCategory}
                            onChange={(e) => setActiveCategory(e.target.value)}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-item">
                        <label>Difficulty</label>
                        <select
                            value={levelFilter}
                            onChange={(e) => setLevelFilter(e.target.value)}
                        >
                            <option value="All">All Levels</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                    </div>

                    <div className="filter-item">
                        <label>Price</label>
                        <select
                            value={priceFilter}
                            onChange={(e) => setPriceFilter(e.target.value)}
                        >
                            <option value="All">All Prices</option>
                            <option value="Free">Free</option>
                            <option value="Paid">Paid</option>
                        </select>
                    </div>

                    <button
                        className="btn btn-primary apply-filters-btn"
                        onClick={() => setIsFilterDrawerOpen(false)}
                    >
                        Apply Filters
                    </button>
                </div>
            </aside>

            <div className="container course-list-content">
                {loading ? (
                    <div className="flex-center py-20">
                        <Loader2 className="spinner" size={40} color="var(--primary)" />
                    </div>
                ) : (
                    <>
                        <div className="results-info">
                            Showing {filteredCourses.length} courses
                        </div>

                        <main className="courses-main">
                            <div className="course-list-grid">
                                {filteredCourses.map(course => (
                                    <CourseCard key={course.id} course={course} />
                                ))}
                            </div>

                            {filteredCourses.length === 0 && (
                                <div className="no-results py-20 text-center glass-card w-full">
                                    <h2 className="text-xl font-bold mb-2">No courses found</h2>
                                    <p className="text-slate-500">Try adjusting your filters to find what you're looking for.</p>
                                </div>
                            )}
                        </main>
                    </>
                )}
            </div>
        </div>
    );
};

export default CourseList;
