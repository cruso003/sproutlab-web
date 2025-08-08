'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  MessageSquare, 
  Search, 
  Filter,
  Users,
  TrendingUp,
  Calendar,
  MapPin,
  Clock,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Plus,
  User,
  Star,
  Eye,
  Award,
  Crown,
  Zap,
  Flag
} from 'lucide-react';
import { useUIStore } from '@/lib/stores';
import Sidebar from '@/components/layout/sidebar';

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  
  const { addNotification, openModal } = useUIStore();

  const communityStats = [
    {
      title: 'Total Members',
      value: '2,847',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      trend: '+127 this month'
    },
    {
      title: 'Active Today',
      value: '324',
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      trend: '23% increase'
    },
    {
      title: 'Total Posts',
      value: '15,823',
      icon: MessageSquare,
      color: 'from-purple-500 to-purple-600',
      trend: '+89 today'
    },
    {
      title: 'Events This Month',
      value: '12',
      icon: Calendar,
      color: 'from-orange-500 to-orange-600',
      trend: '8 upcoming'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Posts' },
    { value: 'general', label: 'General Discussion' },
    { value: 'projects', label: 'Project Showcase' },
    { value: 'help', label: 'Help & Support' },
    { value: 'events', label: 'Events' },
    { value: 'announcements', label: 'Announcements' },
    { value: 'feedback', label: 'Feedback' }
  ];

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'trending', label: 'Trending' },
    { value: 'unanswered', label: 'Unanswered' }
  ];

  // Mock data for community posts
  const communityPosts = [
    {
      id: 1,
      title: 'Successfully completed my first 3D printing project!',
      content: 'Just finished printing a custom phone case using the Ultimaker S3. The print quality exceeded my expectations! Here are some tips I learned...',
      author: {
        name: 'Sarah Chen',
        username: 'sarahc_design',
        avatar: 'SC',
        role: 'student',
        level: 'Advanced'
      },
      category: 'projects',
      tags: ['3d-printing', 'design', 'beginner'],
      metrics: {
        likes: 42,
        comments: 8,
        views: 156,
        shares: 3
      },
      createdAt: '2024-01-15T10:30:00Z',
      isPinned: false,
      hasImages: true,
      isBookmarked: false
    },
    {
      id: 2,
      title: 'Arduino Workshop - February 20th',
      content: 'Join us for an hands-on Arduino workshop covering basics of microcontroller programming and sensor integration. We\'ll build a simple weather station!',
      author: {
        name: 'Prof. Michael Rodriguez',
        username: 'prof_mike',
        avatar: 'MR',
        role: 'staff',
        level: 'Expert'
      },
      category: 'events',
      tags: ['arduino', 'workshop', 'programming', 'sensors'],
      metrics: {
        likes: 67,
        comments: 15,
        views: 289,
        shares: 12
      },
      createdAt: '2024-01-14T14:20:00Z',
      isPinned: true,
      hasImages: false,
      isBookmarked: true,
      eventDate: '2024-02-20T15:00:00Z',
      location: 'Lab Room 205'
    },
    {
      id: 3,
      title: 'Need help with laser cutter settings for acrylic',
      content: 'I\'m having trouble getting clean cuts on 3mm acrylic with the Universal Laser. The edges are melting slightly. Any suggestions for power/speed settings?',
      author: {
        name: 'Alex Thompson',
        username: 'alex_maker',
        avatar: 'AT',
        role: 'student',
        level: 'Intermediate'
      },
      category: 'help',
      tags: ['laser-cutting', 'acrylic', 'troubleshooting'],
      metrics: {
        likes: 23,
        comments: 12,
        views: 98,
        shares: 2
      },
      createdAt: '2024-01-14T09:15:00Z',
      isPinned: false,
      hasImages: true,
      isBookmarked: false,
      isAnswered: true
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'projects': return '🚀';
      case 'events': return '📅';
      case 'help': return '❓';
      case 'announcements': return '📢';
      case 'feedback': return '💬';
      default: return '💭';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'projects': return 'bg-blue-100 text-blue-800';
      case 'events': return 'bg-green-100 text-green-800';
      case 'help': return 'bg-orange-100 text-orange-800';
      case 'announcements': return 'bg-purple-100 text-purple-800';
      case 'feedback': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'staff': return <Badge className="bg-purple-100 text-purple-800"><Crown className="w-3 h-3 mr-1" />Staff</Badge>;
      case 'admin': return <Badge className="bg-red-100 text-red-800"><Star className="w-3 h-3 mr-1" />Admin</Badge>;
      default: return null;
    }
  };

  const handleCreatePost = () => {
    addNotification({
      type: 'info',
      title: 'Create Post',
      message: 'Opening post creator...'
    });
  };

  const handleLikePost = (postId: number) => {
    addNotification({
      type: 'success',
      title: 'Post Liked',
      message: 'Thanks for your feedback!'
    });
  };

  const handleBookmarkPost = (postId: number) => {
    addNotification({
      type: 'info',
      title: 'Post Bookmarked',
      message: 'Added to your bookmarks'
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Sidebar>
      <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-indigo-50 min-h-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
              <MessageSquare className="w-8 h-8 mr-3 text-indigo-600" />
              Community Hub
            </h1>
            <p className="text-gray-600">
              Connect, share, and learn with the SproutLab community
            </p>
          </div>
          <div className="flex gap-3 mt-4 lg:mt-0">
            <Button variant="outline">
              <TrendingUp className="w-4 h-4 mr-2" />
              Trending
            </Button>
            <Button onClick={handleCreatePost}>
              <Plus className="w-4 h-4 mr-2" />
              Create Post
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
          {communityStats.map((stat, index) => (
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
              placeholder="Search community posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Filter by category"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Sort posts"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Community Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {communityPosts.map((post) => (
            <motion.div
              key={post.id}
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                        {post.author.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">
                            {post.author.name}
                          </h3>
                          <span className="text-gray-500 text-sm">
                            @{post.author.username}
                          </span>
                          {getRoleBadge(post.author.role)}
                          <Badge variant="outline" className="text-xs">
                            <Zap className="w-3 h-3 mr-1" />
                            {post.author.level}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatTimeAgo(post.createdAt)}
                          </span>
                          {post.eventDate && (
                            <span className="flex items-center text-green-600">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(post.eventDate).toLocaleDateString()}
                            </span>
                          )}
                          {post.location && (
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {post.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {post.isPinned && (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          📌 Pinned
                        </Badge>
                      )}
                      <Badge 
                        variant="secondary" 
                        className={getCategoryColor(post.category)}
                      >
                        <span className="mr-1">{getCategoryIcon(post.category)}</span>
                        {post.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        {post.title}
                      </h2>
                      <p className="text-gray-700 leading-relaxed">
                        {post.content}
                      </p>
                    </div>

                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-6">
                        <button 
                          onClick={() => handleLikePost(post.id)}
                          className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
                        >
                          <Heart className="w-5 h-5" />
                          <span className="text-sm font-medium">{post.metrics.likes}</span>
                        </button>
                        
                        <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                          <MessageCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">{post.metrics.comments}</span>
                        </button>
                        
                        <span className="flex items-center gap-2 text-gray-500">
                          <Eye className="w-5 h-5" />
                          <span className="text-sm">{post.metrics.views}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleBookmarkPost(post.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            post.isBookmarked 
                              ? 'text-yellow-600 bg-yellow-50' 
                              : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
                          }`}
                          aria-label={post.isBookmarked ? 'Remove bookmark' : 'Bookmark post'}
                          title={post.isBookmarked ? 'Remove bookmark' : 'Bookmark post'}
                        >
                          <Bookmark className="w-5 h-5" />
                        </button>
                        
                        <button 
                          className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          aria-label="Share post"
                          title="Share post"
                        >
                          <Share2 className="w-5 h-5" />
                        </button>

                        {post.isAnswered && (
                          <Badge className="bg-green-100 text-green-800">
                            ✓ Answered
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Load More */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center py-6"
        >
          <Button variant="outline" size="lg">
            Load More Posts
          </Button>
        </motion.div>
      </div>
    </Sidebar>
  );
}
