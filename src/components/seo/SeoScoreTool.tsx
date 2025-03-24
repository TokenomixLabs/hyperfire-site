
import { useState } from "react";
import { Gauge, Search, ArrowRight, CheckCircle2, AlertCircle, XCircle, Tag, FileText, List, Eye, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SeoCheckItem {
  id: string;
  title: string;
  description: string;
  status: "pass" | "warning" | "fail" | "pending";
  score: number;
  tip: string;
}

interface SeoAnalysisResult {
  score: number;
  checks: SeoCheckItem[];
  url?: string;
  title?: string;
  description?: string;
  content?: string;
  keywords?: string[];
}

const SeoScoreTool = () => {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [content, setContent] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<"input" | "results">("input");
  const [analysisResult, setAnalysisResult] = useState<SeoAnalysisResult | null>(null);
  const { toast } = useToast();

  const handleAnalyze = () => {
    if (!title) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }
    
    if (!description) {
      toast({
        title: "Error",
        description: "Meta description is required",
        variant: "destructive",
      });
      return;
    }
    
    if (!content) {
      toast({
        title: "Error",
        description: "Content is required",
        variant: "destructive",
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    // Simulate analysis delay
    setTimeout(() => {
      const result = analyzeSEO({
        url,
        title,
        description,
        content,
        keywords: keywords.split(",").map(k => k.trim()).filter(k => k),
      });
      
      setAnalysisResult(result);
      setActiveTab("results");
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis Complete",
        description: `Your content scored ${result.score}/100`,
      });
    }, 1500);
  };
  
  const analyzeSEO = (data: {
    url?: string;
    title: string;
    description: string;
    content: string;
    keywords: string[];
  }): SeoAnalysisResult => {
    const checks: SeoCheckItem[] = [];
    let totalScore = 0;
    
    // Title length check
    const titleLength = data.title.length;
    if (titleLength >= 40 && titleLength <= 60) {
      checks.push({
        id: "title-length",
        title: "Title Length",
        description: `Your title is ${titleLength} characters long`,
        status: "pass",
        score: 10,
        tip: "Excellent! Your title is the optimal length for search engines."
      });
      totalScore += 10;
    } else if ((titleLength >= 30 && titleLength < 40) || (titleLength > 60 && titleLength <= 70)) {
      checks.push({
        id: "title-length",
        title: "Title Length",
        description: `Your title is ${titleLength} characters long`,
        status: "warning",
        score: 5,
        tip: "Your title length is acceptable but not optimal. Aim for 40-60 characters."
      });
      totalScore += 5;
    } else {
      checks.push({
        id: "title-length",
        title: "Title Length",
        description: `Your title is ${titleLength} characters long`,
        status: "fail",
        score: 0,
        tip: titleLength < 30 ? "Your title is too short. Aim for 40-60 characters." : "Your title is too long. Keep it under 60 characters."
      });
    }
    
    // Description length check
    const descLength = data.description.length;
    if (descLength >= 120 && descLength <= 160) {
      checks.push({
        id: "desc-length",
        title: "Meta Description Length",
        description: `Your description is ${descLength} characters long`,
        status: "pass",
        score: 10,
        tip: "Excellent! Your meta description is the optimal length."
      });
      totalScore += 10;
    } else if ((descLength >= 80 && descLength < 120) || (descLength > 160 && descLength <= 200)) {
      checks.push({
        id: "desc-length",
        title: "Meta Description Length",
        description: `Your description is ${descLength} characters long`,
        status: "warning",
        score: 5,
        tip: "Your description length is acceptable but not optimal. Aim for 120-160 characters."
      });
      totalScore += 5;
    } else {
      checks.push({
        id: "desc-length",
        title: "Meta Description Length",
        description: `Your description is ${descLength} characters long`,
        status: "fail",
        score: 0,
        tip: descLength < 80 ? "Your description is too short. Aim for 120-160 characters." : "Your description is too long. Keep it under 160 characters."
      });
    }
    
    // Keyword presence in title
    const keywordsInTitle = data.keywords.filter(keyword => 
      data.title.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (keywordsInTitle.length > 0) {
      checks.push({
        id: "keywords-in-title",
        title: "Keywords in Title",
        description: `Found ${keywordsInTitle.length} keywords in your title`,
        status: "pass",
        score: 10,
        tip: "Great! Your title includes target keywords."
      });
      totalScore += 10;
    } else if (data.keywords.length === 0) {
      checks.push({
        id: "keywords-in-title",
        title: "Keywords in Title",
        description: "No keywords specified for analysis",
        status: "warning",
        score: 5,
        tip: "Add some target keywords to check if they appear in your title."
      });
      totalScore += 5;
    } else {
      checks.push({
        id: "keywords-in-title",
        title: "Keywords in Title",
        description: "No keywords found in your title",
        status: "fail",
        score: 0,
        tip: "Include at least one target keyword in your title for better SEO."
      });
    }
    
    // Keyword presence in description
    const keywordsInDesc = data.keywords.filter(keyword => 
      data.description.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (keywordsInDesc.length > 0) {
      checks.push({
        id: "keywords-in-desc",
        title: "Keywords in Description",
        description: `Found ${keywordsInDesc.length} keywords in your description`,
        status: "pass",
        score: 10,
        tip: "Great! Your description includes target keywords."
      });
      totalScore += 10;
    } else if (data.keywords.length === 0) {
      checks.push({
        id: "keywords-in-desc",
        title: "Keywords in Description",
        description: "No keywords specified for analysis",
        status: "warning",
        score: 5,
        tip: "Add some target keywords to check if they appear in your description."
      });
      totalScore += 5;
    } else {
      checks.push({
        id: "keywords-in-desc",
        title: "Keywords in Description",
        description: "No keywords found in your description",
        status: "fail",
        score: 0,
        tip: "Include at least one target keyword in your description for better SEO."
      });
    }
    
    // Content length check
    const wordCount = data.content.split(/\s+/).filter(word => word.length > 0).length;
    
    if (wordCount >= 600) {
      checks.push({
        id: "content-length",
        title: "Content Length",
        description: `Your content has ${wordCount} words`,
        status: "pass",
        score: 10,
        tip: "Excellent! Your content has sufficient length for in-depth coverage."
      });
      totalScore += 10;
    } else if (wordCount >= 300) {
      checks.push({
        id: "content-length",
        title: "Content Length",
        description: `Your content has ${wordCount} words`,
        status: "warning",
        score: 5,
        tip: "Your content length is acceptable but could be improved. Aim for 600+ words."
      });
      totalScore += 5;
    } else {
      checks.push({
        id: "content-length",
        title: "Content Length",
        description: `Your content has ${wordCount} words`,
        status: "fail",
        score: 0,
        tip: "Your content is too short. Search engines prefer longer, more comprehensive content (600+ words)."
      });
    }
    
    // Keyword density check
    const contentLower = data.content.toLowerCase();
    const keywordDensities = data.keywords.map(keyword => {
      const keywordLower = keyword.toLowerCase();
      const regex = new RegExp(`\\b${keywordLower}\\b`, 'g');
      const matches = contentLower.match(regex) || [];
      return {
        keyword,
        count: matches.length,
        density: matches.length / wordCount * 100
      };
    });
    
    const avgDensity = keywordDensities.reduce((sum, kw) => sum + kw.density, 0) / 
                        (keywordDensities.length || 1);
    
    if (avgDensity >= 0.5 && avgDensity <= 2.5) {
      checks.push({
        id: "keyword-density",
        title: "Keyword Density",
        description: `Average keyword density: ${avgDensity.toFixed(1)}%`,
        status: "pass",
        score: 10,
        tip: "Great! Your keyword density is in the optimal range."
      });
      totalScore += 10;
    } else if ((avgDensity > 0 && avgDensity < 0.5) || (avgDensity > 2.5 && avgDensity <= 4)) {
      checks.push({
        id: "keyword-density",
        title: "Keyword Density",
        description: `Average keyword density: ${avgDensity.toFixed(1)}%`,
        status: "warning",
        score: 5,
        tip: avgDensity < 0.5 ? "Your keyword density is a bit low. Aim for 0.5-2.5%." : "Your keyword density is slightly high. Keep it below 2.5%."
      });
      totalScore += 5;
    } else if (avgDensity > 4) {
      checks.push({
        id: "keyword-density",
        title: "Keyword Density",
        description: `Average keyword density: ${avgDensity.toFixed(1)}%`,
        status: "fail",
        score: 0,
        tip: "Your keyword density is too high, which might be seen as keyword stuffing. Keep it below 2.5%."
      });
    } else {
      checks.push({
        id: "keyword-density",
        title: "Keyword Density",
        description: data.keywords.length === 0 ? "No keywords specified" : "Keywords not found in content",
        status: "fail",
        score: 0,
        tip: data.keywords.length === 0 ? "Specify target keywords to check density." : "Include your target keywords in the content."
      });
    }
    
    // Headings check
    const headingsRegex = /<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi;
    const headingsMatches = data.content.match(headingsRegex) || [];
    const hasHeadings = headingsMatches.length > 0;
    
    if (hasHeadings) {
      checks.push({
        id: "headings",
        title: "Headings Structure",
        description: `Found ${headingsMatches.length} headings in your content`,
        status: "pass",
        score: 10,
        tip: "Great! Using headings helps structure your content for both users and search engines."
      });
      totalScore += 10;
    } else {
      checks.push({
        id: "headings",
        title: "Headings Structure",
        description: "No headings found in your content",
        status: "fail",
        score: 0,
        tip: "Add headings (H1, H2, H3) to structure your content better. This improves readability and SEO."
      });
    }
    
    // URL structure check
    if (data.url) {
      const isCleanUrl = /^[a-zA-Z0-9-/]+$/.test(data.url);
      const containsKeywords = data.keywords.some(keyword => 
        data.url!.toLowerCase().includes(keyword.toLowerCase().replace(/\s+/g, '-'))
      );
      
      if (isCleanUrl && containsKeywords) {
        checks.push({
          id: "url-structure",
          title: "URL Structure",
          description: "Your URL is clean and contains keywords",
          status: "pass",
          score: 10,
          tip: "Excellent! Your URL is well-structured for SEO."
        });
        totalScore += 10;
      } else if (isCleanUrl) {
        checks.push({
          id: "url-structure",
          title: "URL Structure",
          description: "Your URL is clean but missing keywords",
          status: "warning",
          score: 5,
          tip: "Try to include relevant keywords in your URL for better SEO."
        });
        totalScore += 5;
      } else {
        checks.push({
          id: "url-structure",
          title: "URL Structure",
          description: "Your URL contains special characters or spaces",
          status: "fail",
          score: 0,
          tip: "Use only lowercase letters, numbers, and hyphens in your URL. Avoid special characters."
        });
      }
    } else {
      checks.push({
        id: "url-structure",
        title: "URL Structure",
        description: "No URL provided",
        status: "warning",
        score: 0,
        tip: "Add a URL to analyze its structure for SEO optimization."
      });
    }
    
    // Readability check (simplified Flesch-Kincaid)
    const sentences = data.content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgWordsPerSentence = wordCount / (sentences.length || 1);
    
    if (avgWordsPerSentence >= 10 && avgWordsPerSentence <= 20) {
      checks.push({
        id: "readability",
        title: "Readability",
        description: `Average words per sentence: ${avgWordsPerSentence.toFixed(1)}`,
        status: "pass",
        score: 10,
        tip: "Great! Your content has good readability with optimal sentence length."
      });
      totalScore += 10;
    } else if (avgWordsPerSentence < 10) {
      checks.push({
        id: "readability",
        title: "Readability",
        description: `Average words per sentence: ${avgWordsPerSentence.toFixed(1)}`,
        status: "warning",
        score: 5,
        tip: "Your sentences are quite short. While easy to read, consider adding some variety."
      });
      totalScore += 5;
    } else if (avgWordsPerSentence > 20 && avgWordsPerSentence <= 25) {
      checks.push({
        id: "readability",
        title: "Readability",
        description: `Average words per sentence: ${avgWordsPerSentence.toFixed(1)}`,
        status: "warning",
        score: 5,
        tip: "Your sentences are a bit long. Try to keep them under 20 words on average."
      });
      totalScore += 5;
    } else {
      checks.push({
        id: "readability",
        title: "Readability",
        description: `Average words per sentence: ${avgWordsPerSentence.toFixed(1)}`,
        status: "fail",
        score: 0,
        tip: "Your sentences are too long. Break them down into shorter sentences for better readability."
      });
    }
    
    // Media elements check
    const imgRegex = /<img[^>]+>/gi;
    const hasImages = imgRegex.test(data.content);
    
    if (hasImages) {
      checks.push({
        id: "media",
        title: "Media Elements",
        description: "Your content includes images",
        status: "pass",
        score: 10,
        tip: "Great! Using images improves engagement and can help with SEO."
      });
      totalScore += 10;
    } else {
      checks.push({
        id: "media",
        title: "Media Elements",
        description: "No images detected in your content",
        status: "warning",
        score: 5,
        tip: "Consider adding relevant images to your content to improve engagement."
      });
      totalScore += 5;
    }
    
    // Calculate final score (out of 100)
    const finalScore = Math.min(Math.round(totalScore), 100);
    
    return {
      score: finalScore,
      checks,
      url: data.url,
      title: data.title,
      description: data.description,
      content: data.content,
      keywords: data.keywords
    };
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };
  
  const getStatusIcon = (status: SeoCheckItem['status']) => {
    switch (status) {
      case "pass":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case "fail":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "input" | "results")}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="input">
            Input Content
          </TabsTrigger>
          <TabsTrigger value="results" disabled={!analysisResult}>
            Analysis Results
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="input" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SEO Analysis Tool</CardTitle>
              <CardDescription>
                Enter your content details to analyze SEO quality and get improvement suggestions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="seo-url">URL Path (optional)</Label>
                  <Input 
                    id="seo-url"
                    placeholder="/content/example-path"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="seo-keywords">Target Keywords (comma-separated)</Label>
                  <Input 
                    id="seo-keywords"
                    placeholder="finance, crypto, investment"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="seo-title">Page Title</Label>
                <Input 
                  id="seo-title"
                  placeholder="Your page title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Recommended: 40-60 characters</span>
                  <span>{title.length} characters</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="seo-description">Meta Description</Label>
                <Textarea 
                  id="seo-description"
                  placeholder="A brief description of the page content..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Recommended: 120-160 characters</span>
                  <span>{description.length} characters</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="seo-content">Content</Label>
                <Textarea 
                  id="seo-content"
                  placeholder="Your full page content here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                />
                <p className="text-xs text-muted-foreground">
                  Include all your content with HTML tags (headings, paragraphs, images, etc.)
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Analyzing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Analyze SEO
                  </div>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="results" className="space-y-6">
          {analysisResult && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>SEO Score</CardTitle>
                  <CardDescription>
                    Overall score based on key SEO factors
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center">
                    <div className="relative h-36 w-36 flex items-center justify-center mb-4">
                      <Gauge className="h-36 w-36 text-muted-foreground/30 absolute" />
                      <span className={`text-5xl font-bold ${getScoreColor(analysisResult.score)}`}>
                        {analysisResult.score}
                      </span>
                    </div>
                    <div className="text-center mb-4">
                      <p className="text-lg font-medium">
                        {analysisResult.score >= 80 
                          ? "Excellent SEO" 
                          : analysisResult.score >= 60 
                            ? "Good SEO" 
                            : "Needs Improvement"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {analysisResult.score >= 80 
                          ? "Your content is well-optimized for search engines" 
                          : analysisResult.score >= 60 
                            ? "Your content has good SEO but could be improved" 
                            : "Your content needs significant SEO improvements"}
                      </p>
                    </div>
                    <div className="w-full">
                      <Progress value={analysisResult.score} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Detailed Analysis</h3>
                
                {analysisResult.checks.map((check) => (
                  <Card key={check.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {getStatusIcon(check.status)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{check.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {check.description}
                              </p>
                            </div>
                            <span className={`text-sm font-medium ${getScoreColor(check.score * 10)}`}>
                              {check.score}/10
                            </span>
                          </div>
                          <div className="mt-3 text-sm bg-muted p-3 rounded-md">
                            <p className="text-xs">{check.tip}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <Card>
                  <CardHeader>
                    <CardTitle>Next Steps</CardTitle>
                    <CardDescription>
                      Focus on these items to improve your SEO
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysisResult.checks
                        .filter(check => check.status !== "pass")
                        .map(check => (
                          <li key={`tip-${check.id}`} className="flex items-start gap-2">
                            <ArrowRight className="h-4 w-4 text-primary mt-0.5" />
                            <span className="text-sm">{check.tip}</span>
                          </li>
                        ))}
                      
                      {analysisResult.checks.every(check => check.status === "pass") && (
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                          <span className="text-sm">Your content is well optimized! Keep up the good work.</span>
                        </li>
                      )}
                    </ul>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setActiveTab("input")}
                    >
                      Edit Content
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SeoScoreTool;
