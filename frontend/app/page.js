'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, TrendingUp, Target, Heart, ChevronDown, ChevronUp } from 'lucide-react';
import { goalAPI } from '@/lib/api';

export default function SmartGoalBreaker() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [goalText, setGoalText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentGoal, setCurrentGoal] = useState(null);
  const [error, setError] = useState(null);
  const [expandedTask, setExpandedTask] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!goalText.trim()) return;

    setIsLoading(true);
    setError(null);
    
    try {
      // Use REAL AI backend
      const goal = await goalAPI.createGoal(goalText);
      
      // Transform backend data to match frontend structure
      const transformedGoal = {
        goal_text: goal.goal_text,
        sub_tasks: goal.tasks.map(task => ({
          title: task.task_title,
          description: task.task_description,
          complexity: task.complexity_score,
          task_order: task.step_number
        }))
      };
      
      setCurrentGoal(transformedGoal);
      setGoalText('');
      setExpandedTask(null);
    } catch (err) {
 setError('Failed to process goal. Please try again.');
      console.error('API Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getComplexityColor = (complexity) => {
    if (complexity <= 4) return 'bg-emerald-500 text-emerald-950';
    if (complexity <= 7) return 'bg-yellow-500 text-yellow-950';
    return 'bg-red-500 text-red-950';
  };

  const toggleTaskExpansion = (taskIndex) => {
    setExpandedTask(expandedTask === taskIndex ? null : taskIndex);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-green-950 to-emerald-900 overflow-hidden">
      {/* Header/Navbar */}
       <header className="border-b border-green-800/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center font-bold text-green-950 text-lg">
              SGB
            </div>
            <div>
              <h1 className="text-xl font-bold text-yellow-200">Smart Goal Breaker</h1>
              <p className="text-yellow-200/60 text-xs">AI-Powered Goal Decomposition</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button className="text-yellow-200/80 hover:text-yellow-300 text-sm font-medium transition-colors">
              Features
            </button>
            <button className="text-yellow-200/80 hover:text-yellow-300 text-sm font-medium transition-colors">
              How It Works
            </button>
            <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
              Beta
            </Badge>
          </nav>

          {/* Mobile Hamburger Menu */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-yellow-200 hover:text-yellow-300 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-green-800/30 pt-4">
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-yellow-200/80 hover:text-yellow-300 text-sm font-medium transition-colors text-left py-2"
              >
                Features
              </button>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-yellow-200/80 hover:text-yellow-300 text-sm font-medium transition-colors text-left py-2"
              >
                How It Works
              </button>
              <div className="pt-2">
                <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                  Beta
                </Badge>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>


      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-12 mt-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full"
          >
            <Target className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-300 text-sm font-medium">AI-POWERED GOAL DECOMPOSITION</span>
          </motion.div>

          <h1 className="text-5xl md:text-5xl font-bold text-yellow-200 mb-6">
            Dream Big. Plan Smart. Achieve More.
          </h1>
          
          <p className="text-yellow-100 text-xl max-w-2xl mx-auto leading-relaxed">
            Transform ambitious visions into <span className="text-yellow-300 font-semibold">executable action plans</span> with our intelligent AI decomposition engine
          </p>
        </motion.div>

        {/* Input Section */}
        <motion.div 
          className="max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-green-900/20 border-green-700/30 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-yellow-200">What's Your Mission?</CardTitle>
              <CardDescription className="text-yellow-100">
                Enter any goal - our AI will architect your success path
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-4">
                  <Input
                    type="text"
                    placeholder="Launch a startup, learn a language, write a book..."
                    value={goalText}
                    onChange={(e) => setGoalText(e.target.value)}
                    disabled={isLoading}
                    className="flex-1 bg-green-950/50 border-green-600 text-yellow-100 placeholder-yellow-200/40 focus:border-yellow-400"
                  />
                  <Button 
                    type="submit" 
                    disabled={isLoading || !goalText.trim()}
                    className="bg-yellow-500 text-green-950 hover:bg-yellow-400 font-bold min-w-[140px]"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-green-950 border-t-transparent rounded-full animate-spin" />
                        <span>AI Processing</span>
                      </div>
                    ) : (
                      'Break It Down'
                    )}
                  </Button>
                </div>
                
                {error && (
                  <div className="text-red-300 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                    {error}
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence>
          {currentGoal && (
            <motion.div 
              className="max-w-6xl mx-auto mb-12"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Card className="bg-green-900/20 border-green-700/30 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl text-yellow-200">Your Strategic Action Plan</CardTitle>
                      <CardDescription className="text-yellow-100 text-lg italic">
                        "{currentGoal.goal_text}"
                      </CardDescription>
                    </div>
                    <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                      AI Generated
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {currentGoal.sub_tasks.map((task, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-green-950/30 rounded-xl border border-green-700/20 hover:border-green-600/40 transition-all duration-300 overflow-hidden"
                    >
                      {/* Task Header - Always Visible */}
                      <div 
                        className="flex items-center justify-between p-6 cursor-pointer"
                        onClick={() => toggleTaskExpansion(index)}
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 text-green-950 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg">
                            {task.task_order}
                          </div>
                          <div className="flex-1">
                            {/* TASK TITLE - Big and Bold */}
                            <h3 className="text-yellow-200 text-xl font-bold mb-3">
                              {task.title}
                            </h3>
                            {/* Complexity and Expand Text */}
                            <div className="flex items-center gap-4">
                              <Badge className={`${getComplexityColor(task.complexity)} border-0 font-bold px-3 py-1`}>
                                Level {task.complexity}
                              </Badge>
                              <span className="text-yellow-200/60 text-sm">
                                {expandedTask === index ? 'Click to collapse details' : 'Click to expand details'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-yellow-400">
                          {expandedTask === index ? (
                            <ChevronUp className="w-6 h-6" />
                          ) : (
                            <ChevronDown className="w-6 h-6" />
                          )}
                        </div>
                      </div>

                      {/* Detailed Description - Expandable */}
                      <AnimatePresence>
                        {expandedTask === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-t border-green-700/30"
                          >
                            <div className="p-6 bg-green-900/20">
                              <div className="prose prose-invert max-w-none">
                                <p className="text-yellow-100 text-lg leading-relaxed whitespace-pre-line">
                                  {task.description}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features */}
        {!currentGoal && !isLoading && (
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Brain, title: "AI Powered", desc: "Advanced goal analysis algorithms" },
                { icon: Zap, title: "Lightning Fast", desc: "Instant actionable breakdowns" },
                { icon: TrendingUp, title: "Complexity Awareness", desc: "Each step comes with challenge level and priority" }
              ].map((feature, index) => (
                <Card key={index} className="bg-green-900/20 border-green-700/30 backdrop-blur-sm text-center hover:border-yellow-500/30 transition-colors">
                  <CardContent className="pt-6">
                    <feature.icon className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                    <h3 className="text-yellow-200 font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-yellow-100 text-sm">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-green-800/30 mt-12">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-yellow-200/80 mb-2 italic text-lg">
            "The way to get started is to quit talking and begin doing." - Walt Disney
          </p>
          <div className="flex items-center justify-center gap-2 text-yellow-200/60 text-sm">
            <span>Built with passion by Meryem E.</span>
            <Heart className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-yellow-200/40 text-xs mt-2">
            © 2025 Smart Goal Breaker. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}