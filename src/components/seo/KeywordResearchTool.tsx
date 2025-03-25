
import { useState } from "react";
import { Search, TrendingUp, ArrowRight, Tag, BarChart2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface KeywordSuggestion {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc: number;
  relevance: number;
}

const KeywordResearchTool = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<KeywordSuggestion[]>([]);
  const { toast } = useToast();

  // Mock data for keyword suggestions - in a real app this would come from an API
  const mockKeywordData: Record<string, KeywordSuggestion[]> = {
    "crypto": [
      { keyword: "cryptocurrency investment", volume: 12500, difficulty: 78, cpc: 4.50, relevance: 95 },
      { keyword: "crypto market analysis", volume: 8300, difficulty: 65, cpc: 3.75, relevance: 90 },
      { keyword: "bitcoin price prediction", volume: 22000, difficulty: 85, cpc: 5.20, relevance: 85 },
      { keyword: "crypto trading strategies", volume: 6700, difficulty: 60, cpc: 4.10, relevance: 88 },
      { keyword: "crypto for beginners", volume: 15000, difficulty: 52, cpc: 3.25, relevance: 75 }
    ],
    "nft": [
      { keyword: "nft marketplace", volume: 9800, difficulty: 75, cpc: 4.20, relevance: 92 },
      { keyword: "how to create nft", volume: 12300, difficulty: 58, cpc: 3.60, relevance: 85 },
      { keyword: "nft investment guide", volume: 5400, difficulty: 62, cpc: 3.90, relevance: 90 },
      { keyword: "best nft collections", volume: 7600, difficulty: 70, cpc: 4.30, relevance: 88 },
      { keyword: "nft pricing strategy", volume: 3200, difficulty: 45, cpc: 2.80, relevance: 82 }
    ],
    "defi": [
      { keyword: "defi staking guide", volume: 6800, difficulty: 68, cpc: 4.10, relevance: 94 },
      { keyword: "defi yield farming", volume: 9200, difficulty: 72, cpc: 4.40, relevance: 92 },
      { keyword: "best defi platforms", volume: 11000, difficulty: 76, cpc: 4.80, relevance: 88 },
      { keyword: "defi risks explained", volume: 5500, difficulty: 58, cpc: 3.70, relevance: 85 },
      { keyword: "defi vs traditional finance", volume: 7900, difficulty: 65, cpc: 4.20, relevance: 82 }
    ],
    "blockchain": [
      { keyword: "blockchain technology explained", volume: 10200, difficulty: 70, cpc: 4.30, relevance: 90 },
      { keyword: "blockchain use cases", volume: 8500, difficulty: 65, cpc: 4.00, relevance: 85 },
      { keyword: "blockchain development guide", volume: 6200, difficulty: 75, cpc: 4.50, relevance: 88 },
      { keyword: "blockchain security", volume: 7300, difficulty: 68, cpc: 4.20, relevance: 84 },
      { keyword: "blockchain for business", volume: 9500, difficulty: 72, cpc: 4.60, relevance: 86 }
    ],
    "trading": [
      { keyword: "crypto trading strategies", volume: 14500, difficulty: 80, cpc: 5.10, relevance: 95 },
      { keyword: "day trading cryptocurrency", volume: 12800, difficulty: 75, cpc: 4.80, relevance: 90 },
      { keyword: "technical analysis crypto", volume: 9600, difficulty: 70, cpc: 4.40, relevance: 88 },
      { keyword: "crypto trading bots", volume: 7200, difficulty: 65, cpc: 4.20, relevance: 85 },
      { keyword: "swing trading bitcoin", volume: 6500, difficulty: 60, cpc: 3.90, relevance: 82 }
    ],
    "dao": [
      { keyword: "decentralized autonomous organization", volume: 5200, difficulty: 62, cpc: 3.80, relevance: 94 },
      { keyword: "dao governance models", volume: 3800, difficulty: 58, cpc: 3.50, relevance: 90 },
      { keyword: "how to join a dao", volume: 7400, difficulty: 50, cpc: 3.20, relevance: 85 },
      { keyword: "dao investment opportunities", volume: 4600, difficulty: 64, cpc: 3.90, relevance: 88 },
      { keyword: "dao vs traditional company", volume: 3200, difficulty: 55, cpc: 3.40, relevance: 82 }
    ]
  };

  // Generic fallback for any search term
  const genericKeywords: KeywordSuggestion[] = [
    { keyword: "what is [term]", volume: 8500, difficulty: 55, cpc: 3.50, relevance: 88 },
    { keyword: "[term] guide", volume: 7200, difficulty: 60, cpc: 3.80, relevance: 85 },
    { keyword: "[term] for beginners", volume: 6800, difficulty: 50, cpc: 3.20, relevance: 82 },
    { keyword: "best [term] strategies", volume: 5500, difficulty: 65, cpc: 4.00, relevance: 80 },
    { keyword: "[term] explained", volume: 9200, difficulty: 58, cpc: 3.60, relevance: 86 }
  ];

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Error",
        description: "Please enter a keyword to search",
        variant: "destructive",
      });
      return;
    }
    
    setIsSearching(true);
    
    // Simulate API call delay
    setTimeout(() => {
      let matchedKeywords: KeywordSuggestion[] = [];
      
      // Find exact match in our mock data
      const searchTermLower = searchTerm.toLowerCase();
      const exactMatchData = mockKeywordData[searchTermLower];
      
      if (exactMatchData) {
        matchedKeywords = exactMatchData;
      } else {
        // Look for partial matches
        for (const [key, keywords] of Object.entries(mockKeywordData)) {
          if (key.includes(searchTermLower) || searchTermLower.includes(key)) {
            matchedKeywords = keywords;
            break;
          }
        }
        
        // If still no match, generate generic recommendations
        if (matchedKeywords.length === 0) {
          matchedKeywords = genericKeywords.map(item => ({
            ...item,
            keyword: item.keyword.replace('[term]', searchTerm)
          }));
        }
      }
      
      setResults(matchedKeywords);
      setIsSearching(false);
      
      toast({
        title: "Search Complete",
        description: `Found ${matchedKeywords.length} keyword suggestions for "${searchTerm}"`,
      });
    }, 1200);
  };
  
  const getDifficultyColor = (difficulty: number) => {
    if (difficulty < 30) return "text-green-500";
    if (difficulty < 60) return "text-amber-500";
    return "text-red-500";
  };
  
  const getVolumeDisplay = (volume: number) => {
    return volume.toLocaleString();
  };
  
  const getCpcDisplay = (cpc: number) => {
    return `$${cpc.toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Keyword Research Tool</CardTitle>
          <CardDescription>
            Find high-performing keywords for your content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1">
              <Input 
                placeholder="Enter a keyword or topic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button 
              onClick={handleSearch}
              disabled={isSearching}
            >
              {isSearching ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Searching...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Search
                </div>
              )}
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Example searches: crypto, nft, defi, blockchain, trading, dao
          </div>
        </CardContent>
      </Card>
      
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Keyword Suggestions</CardTitle>
            <CardDescription>
              Based on your search for "{searchTerm}"
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Keyword</TableHead>
                  <TableHead className="text-right">Monthly Volume</TableHead>
                  <TableHead className="text-right">Difficulty</TableHead>
                  <TableHead className="text-right">CPC</TableHead>
                  <TableHead className="text-right">Relevance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((keyword, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                        {keyword.keyword}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                        {getVolumeDisplay(keyword.volume)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        <span className={getDifficultyColor(keyword.difficulty)}>
                          {keyword.difficulty}/100
                        </span>
                        <div className="ml-2 w-16">
                          <Progress 
                            value={keyword.difficulty} 
                            className={`h-1.5 ${
                              keyword.difficulty < 30 
                                ? "bg-green-100" 
                                : keyword.difficulty < 60 
                                  ? "bg-amber-100" 
                                  : "bg-red-100"
                            }`} 
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{getCpcDisplay(keyword.cpc)}</TableCell>
                    <TableCell className="text-right">{keyword.relevance}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-between items-center pt-4">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Pro Tip:</span> Lower difficulty scores indicate easier ranking potential
            </div>
            <Button variant="outline" size="sm">
              <ExternalLink className="mr-2 h-3.5 w-3.5" />
              Export Results
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default KeywordResearchTool;
