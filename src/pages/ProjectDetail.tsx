import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  ExternalLink, 
  Building, 
  Star, 
  Heart, 
  MessageSquare,
  Share2,
  TrendingUp,
  Users,
  Target,
  Zap,
  Clock,
  Globe
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import LoadingSpinner from '@/components/LoadingSpinner';
import { motion } from 'framer-motion';

type Project = {
  id: string;
  name: string;
  description?: string;
  detailed_description?: string;
  website?: string;
  category?: string;
  industry_tags?: string[];
  target_users?: string;
  pricing_model?: string;
  key_features?: string[];
  use_cases?: string;
  user_stories?: string;
  latest_features?: string;
  user_rating?: number;
  review_count?: number;
  created_at: string;
  updated_at: string;
  company?: {
    id: string;
    name: string;
    logo_url?: string;
    logo_storage_url?: string;
    website?: string;
  };
};

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    loadProjectDetails();
  }, [id]);

  const loadProjectDetails = async () => {
    if (!id) {
      setError('Project ID is missing');
      setLoading(false);
      return;
    }

    try {
      const { data, error: fetchError } = await supabase
        .from('projects')
        .select(`
          *,
          company:companies(
            id,
            name,
            logo_url,
            logo_storage_url,
            website
          )
        `)
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;
      
      setProject(data);
      
      // 计算平均评分
      if (data.user_rating && data.review_count > 0) {
        setAvgRating(data.user_rating / data.review_count);
      }
    } catch (err: any) {
      console.error('Error loading project:', err);
      setError(err.message || 'Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-4">Project Not Found</h2>
              <p className="text-muted-foreground mb-4">{error || 'Project not found'}</p>
              <Button onClick={() => navigate('/ai-companies')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Companies
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-foreground">{project.name}</h1>
                  {project.company && (
                    <Link to={`/company-detail/${project.company.id}`}>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Building className="w-3 h-3" />
                        {project.company.name}
                      </Badge>
                    </Link>
                  )}
                </div>
                
                {project.description && (
                  <p className="text-muted-foreground text-lg mb-4">{project.description}</p>
                )}

                {project.website && (
                  <Button variant="outline" asChild>
                    <a href={project.website} target="_blank" rel="noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Website
                    </a>
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {project.user_rating && project.review_count > 0 && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    {avgRating.toFixed(1)}
                    <span className="text-muted-foreground">({project.review_count})</span>
                  </Badge>
                )}
              </div>
            </div>

            {/* Tags */}
            {project.industry_tags && project.industry_tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {project.industry_tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Detailed Description */}
          {project.detailed_description && (
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground whitespace-pre-wrap">
                  {project.detailed_description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Key Features */}
          {project.key_features && project.key_features.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Key Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {project.key_features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Use Cases */}
          {project.use_cases && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Use Cases
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground whitespace-pre-wrap">
                  {project.use_cases}
                </p>
              </CardContent>
            </Card>
          )}

          {/* User Stories */}
          {project.user_stories && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  User Stories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground whitespace-pre-wrap">
                  {project.user_stories}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Latest Features */}
          {project.latest_features && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Latest Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground whitespace-pre-wrap">
                  {project.latest_features}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Info */}
          <Card>
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {project.category && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Category</p>
                  <p className="font-medium text-foreground">{project.category}</p>
                </div>
              )}

              {project.pricing_model && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Pricing Model</p>
                  <p className="font-medium text-foreground">{project.pricing_model}</p>
                </div>
              )}

              {project.target_users && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Target Users</p>
                  <p className="font-medium text-foreground">{project.target_users}</p>
                </div>
              )}

              {project.updated_at && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Last Updated</p>
                  <div className="flex items-center gap-1 text-sm text-foreground">
                    <Clock className="w-4 h-4" />
                    {new Date(project.updated_at).toLocaleDateString()}
                  </div>
                </div>
              )}

              {project.company && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Company</p>
                  <Link to={`/company-detail/${project.company.id}`}>
                    <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors">
                      {project.company.logo_storage_url || project.company.logo_url ? (
                        <img 
                          src={project.company.logo_storage_url || project.company.logo_url}
                          alt={project.company.name}
                          className="w-8 h-8 rounded"
                        />
                      ) : (
                        <Building className="w-8 h-8 text-muted-foreground" />
                      )}
                      <span className="font-medium text-foreground">{project.company.name}</span>
                    </div>
                  </Link>
                  {project.company.website && (
                    <a 
                      href={project.company.website} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-sm text-primary hover:underline mt-2 inline-flex items-center gap-1"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Company Website
                    </a>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Button className="w-full" variant="outline">
                  <Heart className="w-4 h-4 mr-2" />
                  Add to Favorites
                </Button>
                <Button className="w-full" variant="outline">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button className="w-full" variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

