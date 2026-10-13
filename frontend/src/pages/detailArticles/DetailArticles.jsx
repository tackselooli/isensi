import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaShare, FaEye, FaBookmark, FaComment, FaArrowUp } from 'react-icons/fa';

const DetailArticles = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeTab, setActiveTab] = useState('article');

  useEffect(() => {
    axios.get(`http://localhost:3000/articles/${id}`)
      .then((response) => {
        setArticle(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setReadingProgress(progress);
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="bg-red-900 border-l-4 border-red-500 text-red-100 p-4" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="bg-yellow-900 border-l-4 border-yellow-500 text-yellow-100 p-4" role="alert">
          <p className="font-bold">Article not found</p>
          <p>The requested article could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-indigo-500 z-50" style={{ width: `${readingProgress}%` }}></div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-[80vh] overflow-hidden"
      >
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover filter blur-sm"
        />
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="text-center px-4 max-w-4xl">
            <motion.h1
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-5xl md:text-6xl font-bold mb-4 text-indigo-300"
            >
              {article.title}
            </motion.h1>
            <motion.p
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-xl mb-8 text-gray-300"
            >
              By <span className="font-semibold text-indigo-300">{article.authorName}</span> • {new Date(article.publicationDate).toLocaleDateString()}
            </motion.p>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="flex flex-wrap justify-center gap-4"
            >
              {article.tags && article.tags.length > 0 && article.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-semibold hover:bg-indigo-700 transition-colors duration-300"
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Article Stats */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex justify-between mb-8 bg-gray-800 p-4 rounded-lg shadow-lg"
          >
            <div className="flex items-center space-x-8">
              <button className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors">
                <FaHeart className="text-2xl" />
                <span className="text-xl font-semibold">{article.likes}</span>
              </button>
              <button className="flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors">
                <FaShare className="text-2xl" />
                <span className="text-xl font-semibold">{article.shares}</span>
              </button>
              <div className="flex items-center space-x-2 text-blue-400">
                <FaEye className="text-2xl" />
                <span className="text-xl font-semibold">{article.views}</span>
              </div>
            </div>
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`flex items-center space-x-2 ${isBookmarked ? 'text-yellow-400' : 'text-gray-400'} hover:text-yellow-300 transition-colors`}
            >
              <FaBookmark className="text-2xl" />
              <span className="text-xl font-semibold">{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </button>
          </motion.div>

          {/* Content Tabs */}
          <div className="mb-8">
            <div className="flex border-b border-gray-700">
              <button
                className={`py-2 px-4 font-semibold ${activeTab === 'article' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-gray-200'}`}
                onClick={() => setActiveTab('article')}
              >
                Article
              </button>
              <button
                className={`py-2 px-4 font-semibold ${activeTab === 'comments' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-gray-200'}`}
                onClick={() => setActiveTab('comments')}
              >
                Comments
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'article' && (
              <motion.div
                key="article"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {/* Article Content */}
                <div className="bg-gray-800 rounded-lg shadow-lg p-8 mb-16">
                  <div dangerouslySetInnerHTML={{ __html: article.htmlContent || article.content || '' }} className="prose prose-invert max-w-none"></div>
                </div>

                {/* Author Info */}
                <div className="bg-gray-800 rounded-lg shadow-lg p-8 mb-16">
                  <div className="flex items-center">
                    <img
                      src={`https://api.dicebear.com/6.x/initials/svg?seed=${article.authorName}&backgroundColor=indigo`}
                      alt={article.authorName}
                      className="w-20 h-20 rounded-full mr-6"
                    />
                    <div>
                      <h3 className="text-2xl font-semibold text-indigo-300 mb-2">{article.authorName}</h3>
                      <p className="text-gray-400 mb-4">{article.authorEmail}</p>
                      <button className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors">
                        Follow Author
                      </button>
                    </div>
                  </div>
                </div>

                {/* Related Articles */}
                {article.relatedArticles && article.relatedArticles.length > 0 && (
                <div className="mb-16">
                  <h2 className="text-3xl font-bold text-indigo-300 mb-8">Related Articles</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {article.relatedArticles.map((relatedArticle, index) => (
                      <a
                        key={index}
                        href={relatedArticle}
                        className="block group"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="relative h-64 mb-4 overflow-hidden rounded-lg">
                          <img
                            src={`https://source.unsplash.com/featured/?fitness,${index}`}
                            alt={`Related Article ${index + 1}`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="text-white text-lg font-semibold">Read More</span>
                          </div>
                        </div>
                        <h3 className="text-xl font-semibold text-indigo-300 mb-2 group-hover:text-indigo-400 transition-colors duration-300">Related Article {index + 1}</h3>
                        <p className="text-gray-400 truncate">{relatedArticle}</p>
                      </a>
                    ))}
                  </div>
                </div>
                )}
              </motion.div>
            )}

            {activeTab === 'comments' && (
              <motion.div
                key="comments"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-800 rounded-lg shadow-lg p-8"
              >
                <h2 className="text-3xl font-bold text-indigo-300 mb-8">Comments</h2>
                {article.comments && article.comments.length > 0 ? (
                  <div className="space-y-8">
                    {article.comments.map((comment, index) => (
                      <div key={index} className="flex items-start">
                        <img
                          src={`https://api.dicebear.com/6.x/avataaars/svg?seed=${index}&backgroundColor=indigo`}
                          alt={`Commenter ${index + 1}`}
                          className="w-12 h-12 rounded-full mr-4"
                        />
                        <div>
                          <p className="text-gray-300 mb-2">{comment.comment}</p>
                          <p className="text-sm text-gray-500">Posted on {new Date(comment.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">No comments yet. Be the first to comment!</p>
                )}
                {/* Add comment form here */}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors duration-300"
          >
            <FaArrowUp />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DetailArticles;