import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import {
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  Target,
  AlertCircle,
  CheckCircle,
  Clock,
  BookOpen,
  Heart,
  Brain
} from 'lucide-react';

interface StoryMetrics {
  wordCount: number;
  readingTime: number;
  complexity: number;
  engagement: number;
  plotDevelopment: number;
  characterDevelopment: number;
  pacing: number;
  dialogue: number;
}

interface StoryAnalysis {
  metrics: StoryMetrics;
  strengths: string[];
  improvements: string[];
  genreAlignment: {
    genre: string;
    confidence: number;
  }[];
  emotionalArc: {
    chapter: string;
    emotion: string;
    intensity: number;
  }[];
  characterAnalysis: {
    name: string;
    presence: number;
    development: number;
    arcCompleteness: number;
  }[];
}

interface StoryAnalyzerProps {
  storyContent: string;
  onAnalysisComplete?: (analysis: StoryAnalysis) => void;
}

export function StoryAnalyzer({ storyContent, onAnalysisComplete }: StoryAnalyzerProps) {
  const [analysis, setAnalysis] = useState<StoryAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);

  const analyzeStory = async () => {
    setIsAnalyzing(true);
    setProgress(0);

    // Simulate analysis progress
    const steps = [
      { label: 'Parsing text structure...', duration: 500 },
      { label: 'Analyzing plot development...', duration: 800 },
      { label: 'Evaluating character arcs...', duration: 600 },
      { label: 'Measuring pacing and flow...', duration: 700 },
      { label: 'Assessing emotional impact...', duration: 400 },
      { label: 'Generating insights...', duration: 500 }
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, steps[i].duration));
      setProgress(((i + 1) / steps.length) * 100);
    }

    // Generate mock analysis (replace with actual AI analysis)
    const mockAnalysis: StoryAnalysis = {
      metrics: {
        wordCount: Math.floor(Math.random() * 5000) + 1000,
        readingTime: Math.floor(Math.random() * 20) + 5,
        complexity: Math.floor(Math.random() * 40) + 60,
        engagement: Math.floor(Math.random() * 30) + 70,
        plotDevelopment: Math.floor(Math.random() * 25) + 75,
        characterDevelopment: Math.floor(Math.random() * 20) + 80,
        pacing: Math.floor(Math.random() * 35) + 65,
        dialogue: Math.floor(Math.random() * 30) + 70
      },
      strengths: [
        'Strong character development and emotional depth',
        'Well-paced narrative with good tension building',
        'Effective use of dialogue to advance plot',
        'Rich descriptive language and world-building'
      ],
      improvements: [
        'Consider varying sentence structure for better flow',
        'Some plot points could use more development',
        'Character motivations could be clearer in certain scenes'
      ],
      genreAlignment: [
        { genre: 'Fantasy', confidence: 85 },
        { genre: 'Adventure', confidence: 72 },
        { genre: 'Romance', confidence: 45 },
        { genre: 'Mystery', confidence: 30 }
      ],
      emotionalArc: [
        { chapter: 'Chapter 1', emotion: 'Wonder', intensity: 75 },
        { chapter: 'Chapter 2', emotion: 'Tension', intensity: 60 },
        { chapter: 'Chapter 3', emotion: 'Conflict', intensity: 85 },
        { chapter: 'Chapter 4', emotion: 'Resolution', intensity: 70 }
      ],
      characterAnalysis: [
        { name: 'Protagonist', presence: 95, development: 88, arcCompleteness: 82 },
        { name: 'Antagonist', presence: 65, development: 75, arcCompleteness: 70 },
        { name: 'Supporting Cast', presence: 45, development: 60, arcCompleteness: 55 }
      ]
    };

    setAnalysis(mockAnalysis);
    setIsAnalyzing(false);
    onAnalysisComplete?.(mockAnalysis);
  };

  useEffect(() => {
    if (storyContent && storyContent.length > 100) {
      analyzeStory();
    }
  }, [storyContent]);

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number): 'default' | 'secondary' | 'destructive' => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  if (isAnalyzing) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>Analyzing Your Story</span>
          </CardTitle>
          <CardDescription>
            Our AI is examining your story across multiple dimensions...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground text-center">
              {Math.round(progress)}% Complete
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Story Analyzer</span>
          </CardTitle>
          <CardDescription>
            Upload or paste your story content to get detailed insights and analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={analyzeStory} disabled={!storyContent || storyContent.length < 100}>
            <Brain className="h-4 w-4 mr-2" />
            Analyze Story
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Story Analysis Results</span>
          </CardTitle>
          <CardDescription>
            Comprehensive analysis of your story's structure, pacing, and impact.
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="characters">Characters</TabsTrigger>
          <TabsTrigger value="emotional">Emotional Arc</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Word Count</span>
                </div>
                <p className="text-2xl font-bold">{analysis.metrics.wordCount.toLocaleString()}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Reading Time</span>
                </div>
                <p className="text-2xl font-bold">{analysis.metrics.readingTime} min</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Engagement</span>
                </div>
                <p className={`text-2xl font-bold ${getScoreColor(analysis.metrics.engagement)}`}>
                  {analysis.metrics.engagement}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium">Complexity</span>
                </div>
                <p className={`text-2xl font-bold ${getScoreColor(analysis.metrics.complexity)}`}>
                  {analysis.metrics.complexity}%
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Genre Alignment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysis.genreAlignment.map((genre, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="font-medium">{genre.genre}</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={genre.confidence} className="w-24" />
                      <span className="text-sm text-muted-foreground">{genre.confidence}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(analysis.metrics).filter(([key]) => !['wordCount', 'readingTime'].includes(key)).map(([key, value]) => (
              <Card key={key}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <Badge variant={getScoreBadgeVariant(value as number)}>
                      {value}%
                    </Badge>
                  </div>
                  <Progress value={value as number} className="w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="characters" className="space-y-4">
          {analysis.characterAnalysis.map((character, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>{character.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Presence</span>
                      <span className="text-sm">{character.presence}%</span>
                    </div>
                    <Progress value={character.presence} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Development</span>
                      <span className="text-sm">{character.development}%</span>
                    </div>
                    <Progress value={character.development} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Arc Completeness</span>
                      <span className="text-sm">{character.arcCompleteness}%</span>
                    </div>
                    <Progress value={character.arcCompleteness} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="emotional" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-4 w-4" />
                <span>Emotional Journey</span>
              </CardTitle>
              <CardDescription>
                Track how emotions flow throughout your story
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.emotionalArc.map((point, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-20">
                      <Badge variant="outline">{point.chapter}</Badge>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{point.emotion}</span>
                        <span className="text-sm text-muted-foreground">{point.intensity}%</span>
                      </div>
                      <Progress value={point.intensity} className="w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Strengths</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-40">
                  <ul className="space-y-2">
                    {analysis.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-orange-600">
                  <AlertCircle className="h-4 w-4" />
                  <span>Areas for Improvement</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-40">
                  <ul className="space-y-2">
                    {analysis.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center">
        <Button onClick={analyzeStory} variant="outline">
          <Brain className="h-4 w-4 mr-2" />
          Re-analyze Story
        </Button>
      </div>
    </div>
  );
}