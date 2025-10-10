import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { NewStoriesGrid } from '@/components/stories/NewStoriesGrid';
import { Button } from '@/components/ui/button';
import { 
  BookOpen,
  PlusCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function NewStories() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Page animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5, 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-background"
    >
      {/* Header Section */}
      <motion.section 
        variants={itemVariants}
        className={cn(
          "bg-gradient-to-r from-primary-50 via-background to-primary-50 dark:from-primary-950/30 dark:via-background dark:to-primary-950/30",
          isMobile ? "py-8 px-4" : "py-16 px-4"
        )}
      >
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            variants={itemVariants} 
            className={cn(
              "text-center space-y-4",
              isMobile ? "max-w-sm mx-auto" : "max-w-4xl mx-auto"
            )}
          >
            {/* Icon */}
            <div className={cn(
              "inline-flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30 mb-4",
              isMobile ? "w-16 h-16" : "w-20 h-20"
            )}>
              <BookOpen className="text-primary-600" size={isMobile ? 24 : 32} />
            </div>
            
            {/* Title */}
            <h1 className={cn(
              "font-bold text-foreground leading-tight",
              isMobile ? "text-3xl" : "text-5xl md:text-6xl"
            )}>
              Community
              <span className="text-primary-600 ml-3">Stories</span>
            </h1>
            
            {/* Subtitle */}
            <p className={cn(
              "text-muted-foreground leading-relaxed",
              isMobile ? "text-base" : "text-xl max-w-3xl mx-auto"
            )}>
              {isMobile 
                ? "Discover real experiences, insights, and success stories from our community of innovators."
                : "Explore authentic experiences, valuable insights, and inspiring success stories shared by our vibrant community of entrepreneurs, investors, and innovators."
              }
            </p>
            
            {/* CTA Buttons */}
            <div className={cn(
              "flex gap-4 pt-4",
              isMobile ? "flex-col" : "flex-row justify-center"
            )}>
              <Button 
                onClick={() => navigate('/create-story')} 
                size={isMobile ? "default" : "lg"}
                className={cn(
                  "group",
                  isMobile && "w-full"
                )}
              >
                <PlusCircle size={18} className="mr-2" />
                Share Your Story
                <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              {!isMobile && (
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => {
                    const storiesSection = document.querySelector('[data-section="stories-grid"]');
                    if (storiesSection) {
                      storiesSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  <Sparkles size={16} className="mr-2" />
                  Browse Stories
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stories Grid Section */}
      <motion.section 
        variants={itemVariants}
        data-section="stories-grid"
        className={cn(
          "px-4",
          isMobile ? "py-8" : "py-16"
        )}
      >
        <div className="container mx-auto max-w-7xl">
          <motion.div variants={itemVariants}>
            {/* Section Header */}
            <div className={cn(
              "text-center mb-8",
              isMobile ? "space-y-2" : "space-y-4 mb-12"
            )}>
              <h2 className={cn(
                "font-bold text-foreground",
                isMobile ? "text-2xl" : "text-4xl"
              )}>
                Latest Stories
              </h2>
              <p className={cn(
                "text-muted-foreground",
                isMobile ? "text-sm" : "text-lg max-w-2xl mx-auto"
              )}>
                {isMobile 
                  ? "Real experiences from real people in AI, investment, and innovation."
                  : "Dive into authentic narratives from entrepreneurs, investors, and innovators shaping the future of technology and business."
                }
              </p>
            </div>
            
            {/* Stories Grid Component */}
            <NewStoriesGrid />
          </motion.div>
        </div>
      </motion.section>

      {/* Call to Action Section */}
      <motion.section 
        variants={itemVariants}
        className={cn(
          "bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4",
          isMobile ? "py-12" : "py-20"
        )}
      >
        <div className="container mx-auto max-w-4xl">
          <div className={cn(
            "text-center",
            isMobile ? "space-y-4" : "space-y-6"
          )}>
            <h2 className={cn(
              "font-bold",
              isMobile ? "text-2xl" : "text-4xl"
            )}>
              Share Your Story
            </h2>
            <p className={cn(
              "text-primary-100",
              isMobile ? "text-base max-w-sm mx-auto" : "text-xl max-w-3xl mx-auto"
            )}>
              {isMobile 
                ? "Your experience could inspire others. Join our community and share your journey."
                : "Your experiences and insights could inspire the next generation of innovators. Join our community of storytellers and make an impact."
              }
            </p>
            <div className={cn(
              "flex gap-4 pt-4",
              isMobile ? "flex-col" : "flex-row justify-center"
            )}>
              <Button 
                onClick={() => navigate('/create-story')} 
                variant="secondary"
                size={isMobile ? "default" : "lg"}
                className={cn(
                  "group bg-white text-primary-600 hover:bg-white/90",
                  isMobile && "w-full"
                )}
              >
                <PlusCircle size={18} className="mr-2" />
                Create Story
                <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                onClick={() => navigate('/ai-chat')} 
                variant="outline" 
                size={isMobile ? "default" : "lg"}
                className={cn(
                  "border-white text-white hover:bg-white hover:text-primary-600",
                  isMobile && "w-full"
                )}
              >
                Need Ideas? Chat with AI
                <Sparkles size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Mobile FAB */}
      {isMobile && (
        <motion.div 
          className="fixed bottom-6 right-6 z-50"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 200 }}
        >
          <Button
            onClick={() => navigate('/create-story')}
            size="default"
            className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300 w-14 h-14 p-0"
          >
            <PlusCircle size={24} />
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
