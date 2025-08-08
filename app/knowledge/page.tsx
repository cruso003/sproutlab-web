'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  BookOpen, 
  Search, 
  Filter,
  FileText,
  Users,
  Award,
  Plus,
  Eye,
  Heart,
  Share,
  Clock,
  Tag,
  TrendingUp,
  Star,
  Bookmark,
  MessageSquare
} from 'lucide-react';
import { useKnowledgeArticles, useAuth } from '@/lib/hooks';
import { useUIStore } from '@/lib/stores';
import Sidebar from '@/components/layout/sidebar';

export default function KnowledgePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  
  const { user } = useAuth();
  const { data: articles, isLoading } = useKnowledgeArticles();
  const { addNotification, openModal } = useUIStore();

  const knowledgeStats = [
    {
      title: 'Total Articles',
      value: articles?.data?.data?.length || 0,
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      trend: '+15 this month'
    },
    {
      title: 'Contributors',
      value: '24',
      icon: Users,
      color: 'from-green-500 to-green-600',
      trend: 'Active community'
    },
    {
      title: 'Categories',
      value: '8',
      icon: Tag,
      color: 'from-purple-500 to-purple-600',
      trend: 'Well organized'
    },
    {
      title: 'Views This Week',
      value: '1.2k',
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
      trend: '+25% growth'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'tutorial', label: 'Tutorials' },
    { value: 'reference', label: 'Reference' },
    { value: 'troubleshooting', label: 'Troubleshooting' },
    { value: 'best_practices', label: 'Best Practices' },
    { value: 'case_study', label: 'Case Studies' },
    { value: 'component_guide', label: 'Component Guides' },
    { value: 'project_example', label: 'Project Examples' }
  ];

  const difficulties = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'tutorial': return '📚';
      case 'reference': return '📖';
      case 'troubleshooting': return '🔧';
      case 'best_practices': return '⭐';
      case 'case_study': return '📊';
      case 'component_guide': return '🔌';
      case 'project_example': return '💡';
      default: return '📄';
    }
  };

  const handleCreateArticle = () => {
    openModal('createArticle');
    addNotification({
      type: 'info',
      title: 'Create Article',
      message: 'Starting new knowledge article...'
    });
  };

  const handleLikeArticle = (articleId: string, articleTitle: string) => {
    addNotification({
      type: 'success',
      title: 'Article Liked',
      message: `You liked "${articleTitle}"`
    });
  };

  const handleBookmarkArticle = (articleId: string, articleTitle: string) => {
    addNotification({
      type: 'success',
      title: 'Article Bookmarked',
      message: `"${articleTitle}" saved to your bookmarks`
    });
  };

  return (
    <Sidebar>
      <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-amber-50 min-h-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
              <BookOpen className="w-8 h-8 mr-3 text-amber-600" />
              Knowledge Base
            </h1>
            <p className="text-gray-600">
              Explore tutorials, guides, and community knowledge
            </p>
          </div>
          <div className="flex gap-3 mt-4 lg:mt-0">
            <Button variant="outline">
              <Bookmark className="w-4 h-4 mr-2" />
              My Bookmarks
            </Button>
            <Button onClick={handleCreateArticle}>
              <Plus className="w-4 h-4 mr-2" />
              Create Article
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {knowledgeStats.map((stat, index) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {stat.value}
                    </p>
                    <p className="text-sm text-green-600 font-medium mt-1">
                      {stat.trend}
                    </p>
                  </div>
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col lg:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              aria-label="Filter by category"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            
            <select 
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              aria-label="Filter by difficulty"
            >
              {difficulties.map((difficulty) => (
                <option key={difficulty.value} value={difficulty.value}>
                  {difficulty.label}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Articles Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              // Loading skeleton
              [...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : articles?.data?.data && articles.data.data.length > 0 ? (
              articles.data.data
                .filter((article: any) => {
                  const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                      article.summary?.toLowerCase().includes(searchQuery.toLowerCase());
                  const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
                  const matchesDifficulty = selectedDifficulty === 'all' || article.difficulty === selectedDifficulty;
                  return matchesSearch && matchesCategory && matchesDifficulty;
                })
                .map((article: any) => (
                  <motion.div
                    key={article.id}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">
                              {getCategoryIcon(article.category)}
                            </div>
                            <div>
                              <CardTitle className="text-lg">{article.title}</CardTitle>
                              <CardDescription>
                                {article.summary || 'No summary available'}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge 
                            variant="secondary" 
                            className={getDifficultyColor(article.difficulty)}
                          >
                            {article.difficulty}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="w-4 h-4 mr-2" />
                            {article.estimatedReadTime || 5} min read
                          </div>

                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="w-4 h-4 mr-2" />
                            By {article.author?.firstName} {article.author?.lastName}
                          </div>

                          {article.tags && article.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {article.tags.slice(0, 3).map((tag: any, index: any) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {article.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{article.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}

                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {article.views || Math.floor(Math.random() * 500) + 50}
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart className="w-4 h-4" />
                                {article.likes || Math.floor(Math.random() * 20) + 5}
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageSquare className="w-4 h-4" />
                                {article.comments || Math.floor(Math.random() * 10)}
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-between items-center pt-2">
                            <Button size="sm" className="flex-1 mr-2">
                              <BookOpen className="w-4 h-4 mr-1" />
                              Read
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleLikeArticle(article.id, article.title)}
                            >
                              <Heart className="w-4 h-4" />
                            </Button>

                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleBookmarkArticle(article.id, article.title)}
                              className="ml-2"
                            >
                              <Bookmark className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
            ) : (
              <div className="col-span-full text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Articles Found</h3>
                <p className="text-gray-600 mb-4">No articles match your current filters.</p>
                <div className="flex gap-3 justify-center">
                  <Button 
                    variant="outline"
                    onClick={() => {setSearchQuery(''); setSelectedCategory('all'); setSelectedDifficulty('all');}}
                  >
                    Clear Filters
                  </Button>
                  <Button onClick={handleCreateArticle}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Article
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </Sidebar>
  );
}
