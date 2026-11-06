import { ArrowLeft, ArrowRight, CalendarDays, Clock3 } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Breadcrumbs } from '../../components/ui/Typography';
import { BLOG_POSTS, getBlogPost, getBlogPostImage } from '../../data/blogPosts';

export function BlogPage() {
  const { slug } = useParams();

  if (slug) {
    const post = getBlogPost(slug);
    if (!post) return <Navigate to="/blogs" replace />;

    return (
      <div className="blog-page">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Blog & Insights', href: '/blogs' },
            { label: post.title },
          ]}
        />
        <article className="blog-article">
          <header className="blog-article__header">
            <Link to="/blogs" className="blog-back-link">
              <ArrowLeft size={16} aria-hidden="true" />
              All articles
            </Link>
            <span className="blog-category">{post.category}</span>
            <h1>{post.title}</h1>
            <p className="blog-article__excerpt">{post.excerpt}</p>
            <div className="blog-meta">
              <span><CalendarDays size={15} aria-hidden="true" />{post.publishedAt}</span>
              <span><Clock3 size={15} aria-hidden="true" />{post.readTime}</span>
            </div>
          </header>

          <img
            className="blog-article__image"
            src={getBlogPostImage(post, 1800)}
            alt={post.imageAlt}
          />

          <div className="blog-article__body">
            {post.sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </section>
            ))}
            <aside className="blog-article__cta">
              <h2>Explore opportunities with R.L. Klein</h2>
              <p>Browse current healthcare roles or connect with our team to learn more.</p>
              <Link to="/hot-jobs" className="btn btn--accent btn--md">
                Find Your Next Role <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </aside>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="blog-page blog-index">
      <header
        className="blog-intro"
        style={{
          backgroundImage: `linear-gradient(rgba(248, 251, 252, 0.9), rgba(255, 255, 255, 0.86) 62%, rgba(248, 246, 245, 0.9)), url("${getBlogPostImage(BLOG_POSTS[0], 1800)}")`,
          backgroundPosition: 'center 42%',
          backgroundSize: 'cover',
        }}
      >
        <h1>
          Healthcare Staffing Insights and
          <br className="blog-intro__desktop-break" />
          {' '}Inspiration
        </h1>
        <p>
          Welcome to the R.L. Klein &amp; Associates blog! Our mission is to connect healthcare
          professionals with opportunities that align with their lifestyles and career aspirations.
          Through our blog, we share valuable information, resources, and support for career
          advancement. Our team brings experience in healthcare staffing and workforce solutions,
          with perspectives on staffing trends and professional development. Stay up to date with
          insights from across the healthcare industry and join us in supporting quality care.
        </p>
      </header>

      <main className="blog-listing" aria-label="Blog articles">
        <div className="blog-post-list">
          {BLOG_POSTS.map((post) => (
            <article className="blog-post-row" key={post.slug}>
              <Link
                to={`/blogs/${post.slug}`}
                className="blog-post-row__image"
                aria-label={`Read ${post.title}`}
              >
                <img src={getBlogPostImage(post, 500)} alt={post.imageAlt} loading="lazy" />
              </Link>
              <div className="blog-post-row__content">
                <time className="blog-post-row__date">{post.publishedAt}</time>
                <h2><Link to={`/blogs/${post.slug}`}>{post.title}</Link></h2>
                <p>{post.excerpt}</p>
                <Link to={`/blogs/${post.slug}`} className="blog-post-row__read-more">Read More</Link>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
