import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Progress } from '../ui/progress';
import { useToast } from '../ui/use-toast';
import {
  Wand2,
  RefreshCw,
  Copy,
  Download,
  Save,
  Lightbulb,
  Users,
  MapPin,
  Zap,
  BookOpen,
  MessageSquare,
  Palette,
  Target,
  Clock
} from 'lucide-react';

interface WritingSuggestion {
  type: 'grammar' | 'style' | 'plot' | 'character' | 'dialogue' | 'description';
  text: string;
  suggestion: string;
  confidence: number;
  position: number;
}

interface WritingPrompt {
  id: string;
  category: string;
  title: string;
  description: string;
  prompt: string;
}

interface WritingAssistantProps {
  initialText?: string;
  onTextChange?: (text: string) => void;
  isEmbedded?: boolean;
}

export function WritingAssistant({ initialText = '', onTextChange, isEmbedded = false }: WritingAssistantProps) {
  const [text, setText] = useState(initialText);
  const [suggestions, setSuggestions] = useState<WritingSuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [selectedSuggestion, setSelectedSuggestion] = useState<WritingSuggestion | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [activePrompts, setActivePrompts] = useState<WritingPrompt[]>([]);
  const [customPrompt, setCustomPrompt] = useState('');
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const writingPrompts: WritingPrompt[] = [
    {
      id: '1',
      category: 'Character Development',
      title: 'Character Backstory',
      description: 'Develop a rich backstory for your character',
      prompt: 'What defining moment in your character\'s past shaped who they are today? Describe the event and its lasting impact.'
    },
    {
      id: '2',
      category: 'Plot Development',
      title: 'Conflict Introduction',
      description: 'Create compelling conflict in your story',
      prompt: 'What obstacle or challenge could completely derail your protagonist\'s current plan? How would they react?'
    },
    {
      id: '3',
      category: 'World Building',
      title: 'Setting Details',
      description: 'Enhance your story world with vivid details',
      prompt: 'Describe the most important location in your story through the senses - what does it look, sound, smell, and feel like?'
    },
    {
      id: '4',
      category: 'Dialogue',
      title: 'Character Voice',
      description: 'Develop unique character voices',
      prompt: 'Write a conversation where two characters discuss the same topic but reveal their different personalities through their speaking styles.'
    },
    {
      id: '5',
      category: 'Theme',
      title: 'Central Message',
      description: 'Explore your story\'s deeper meaning',
      prompt: 'What truth about life does your story reveal? How do your characters embody or challenge this truth?'
    }
  ];

  useEffect(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setWordCount(words);
    setCharacterCount(text.length);
    onTextChange?.(text);
  }, [text, onTextChange]);

  useEffect(() => {
    if (text.length > 100) {
      analyzeText();
    }
  }, [text]);

  const analyzeText = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    // Simulate analysis progress
    const progressSteps = [20, 40, 60, 80, 100];
    for (const step of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setAnalysisProgress(step);
    }

    // Generate mock suggestions (replace with actual AI analysis)
    const mockSuggestions: WritingSuggestion[] = [
      {
        type: 'style',
        text: 'The character walked slowly',
        suggestion: 'Consider a more vivid verb: "The character shuffled" or "crept" to add more personality',
        confidence: 85,
        position: 50
      },
      {
        type: 'dialogue',
        text: '"Hello," she said.',
        suggestion: 'Add action or emotion: "Hello," she whispered, glancing nervously around the room.',
        confidence: 78,
        position: 120
      },
      {
        type: 'description',
        text: 'It was a nice day',
        suggestion: 'Be more specific and sensory: "Golden sunlight filtered through wispy clouds, warming the gentle breeze"',
        confidence: 92,
        position: 200
      }
    ];

    setSuggestions(mockSuggestions);
    setIsAnalyzing(false);
  };

  const applySuggestion = (suggestion: WritingSuggestion) => {
    const beforeText = text.substring(0, suggestion.position);
    const afterText = text.substring(suggestion.position + suggestion.text.length);
    const newText = beforeText + suggestion.suggestion.split(': ")[1] || suggestion.suggestion + afterText;
    setText(newText);
    setSuggestions(prev => prev.filter(s => s !== suggestion));
    toast({
      title: "Suggestion Applied",
      description: "Your text has been updated with the suggestion."
    });
  };

  const generateContent = async (prompt: string) => {
    setIsAnalyzing(true);
    
    // Simulate content generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const generatedContent = `\n\n[Generated based on: "${prompt}"]\n\nGenerated content would appear here based on the prompt. This is where AI would create relevant text that fits your story context and style.\n\n`;
    
    setText(prev => prev + generatedContent);
    setIsAnalyzing(false);
    
    toast({
      title: "Content Generated",
      description: "New content has been added to your text."
    });
  };

  const handleCustomPrompt = () => {
    if (customPrompt.trim()) {
      generateContent(customPrompt);
      setCustomPrompt('');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "Your text has been copied to the clipboard."
    });
  };

  const downloadText = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'story.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download Started",
      description: "Your story has been downloaded as a text file."
    });
  };

  const getSuggestionIcon = (type: WritingSuggestion['type']) => {
    switch (type) {
      case 'grammar': return <BookOpen className="h-4 w-4" />;
      case 'style': return <Palette className="h-4 w-4" />;
      case 'plot': return <Target className="h-4 w-4" />;
      case 'character': return <Users className="h-4 w-4" />;
      case 'dialogue': return <MessageSquare className="h-4 w-4" />;
      case 'description': return <MapPin className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getSuggestionColor = (type: WritingSuggestion['type']) => {
    switch (type) {
      case 'grammar': return 'bg-red-100 text-red-800';
      case 'style': return 'bg-blue-100 text-blue-800';
      case 'plot': return 'bg-purple-100 text-purple-800';
      case 'character': return 'bg-green-100 text-green-800';
      case 'dialogue': return 'bg-yellow-100 text-yellow-800';
      case 'description': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`w-full ${isEmbedded ? '' : 'max-w-6xl mx-auto'} space-y-6`}>
      {!isEmbedded && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wand2 className="h-5 w-5" />
              <span>Writing Assistant</span>
            </CardTitle>
            <CardDescription>
              Get AI-powered suggestions to improve your writing and overcome writer's block.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <div className={`grid ${isEmbedded ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'} gap-6`}>
        <div className={isEmbedded ? 'col-span-1' : 'col-span-2'}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Your Story</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={downloadText}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>{wordCount} words</span>
                <span>{characterCount} characters</span>
                <span>{Math.ceil(wordCount / 200)} min read</span>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Start writing your story here... The AI will analyze your text and provide suggestions as you write."
                className="min-h-[400px] resize-none"
              />
              
              {isAnalyzing && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Analyzing your text...</span>
                  </div>
                  <Progress value={analysisProgress} className="w-full" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {!isEmbedded && (
          <div className="space-y-6">
            <Tabs defaultValue="suggestions" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                <TabsTrigger value="prompts">Prompts</TabsTrigger>
              </TabsList>

              <TabsContent value="suggestions" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Lightbulb className="h-4 w-4" />
                      <span>Writing Suggestions</span>
                      {suggestions.length > 0 && (
                        <Badge variant="secondary">{suggestions.length}</Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      {suggestions.length === 0 ? (
                        <div className="text-center text-muted-foreground py-8">
                          <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>Write some text to get AI suggestions</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {suggestions.map((suggestion, index) => (
                            <Card key={index} className="p-3">
                              <div className="flex items-start space-x-3">
                                <div className={`p-1 rounded ${getSuggestionColor(suggestion.type)}`}>
                                  {getSuggestionIcon(suggestion.type)}
                                </div>
                                <div className="flex-1 space-y-2">
                                  <div className="flex items-center justify-between">
                                    <Badge variant="outline" className="text-xs capitalize">
                                      {suggestion.type}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {suggestion.confidence}% confidence
                                    </span>
                                  </div>
                                  <div className="text-sm">
                                    <p className="font-medium mb-1">Original:</p>
                                    <p className="text-muted-foreground italic mb-2">"{suggestion.text}"</p>
                                    <p className="font-medium mb-1">Suggestion:</p>
                                    <p>{suggestion.suggestion}</p>
                                  </div>
                                  <Button
                                    size="sm"
                                    onClick={() => applySuggestion(suggestion)}
                                    className="w-full"
                                  >
                                    Apply Suggestion
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="prompts" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Zap className="h-4 w-4" />
                      <span>Writing Prompts</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Input
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        placeholder="Enter a custom writing prompt..."
                        onKeyPress={(e) => e.key === 'Enter' && handleCustomPrompt()}
                      />
                      <Button 
                        onClick={handleCustomPrompt} 
                        disabled={!customPrompt.trim() || isAnalyzing}
                        className="w-full"
                      >
                        <Wand2 className="h-4 w-4 mr-2" />
                        Generate Content
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-3">
                        {writingPrompts.map((prompt) => (
                          <Card key={prompt.id} className="p-3">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-sm">{prompt.title}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {prompt.category}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {prompt.description}
                              </p>
                              <p className="text-sm italic">"{prompt.prompt}"</p>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => generateContent(prompt.prompt)}
                                disabled={isAnalyzing}
                                className="w-full"
                              >
                                <Wand2 className="h-3 w-3 mr-1" />
                                Use Prompt
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}