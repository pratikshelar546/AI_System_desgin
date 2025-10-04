import { useState } from 'react';
import { Bot, Loader2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DiagramData, AIReview } from '@/types/diagram';

interface AIReviewPanelProps {
  diagramData: DiagramData;
  onGetReview: (data: DiagramData) => Promise<AIReview>;
}

export default function AIReviewPanel({ diagramData, onGetReview }: AIReviewPanelProps) {
  const [review, setReview] = useState<AIReview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetReview = async () => {
    if (diagramData.nodes.length === 0) {
      setError('Add some components to your diagram first');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await onGetReview(diagramData);
      setReview(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border-l border-border w-full lg:w-96 p-3 sm:p-6 shadow-panel">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
        <h3 className="text-base sm:text-lg font-semibold text-foreground">AI Review</h3>
      </div>

      <Button 
        onClick={handleGetReview}
        disabled={loading || diagramData.nodes.length === 0}
        className="w-full mb-6"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Analyzing...
          </>
        ) : (
          'Get Review'
        )}
      </Button>

      {error && (
        <Card className="mb-6 border-destructive/50">
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {review && (
        <Tabs defaultValue="critique" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="critique" className="text-xs font-medium">Critique</TabsTrigger>
            <TabsTrigger value="suggestions" className="text-xs font-medium">Suggestions</TabsTrigger>
            <TabsTrigger value="references" className="text-xs font-medium">References</TabsTrigger>
          </TabsList>
          
          <TabsContent value="critique" className="mt-0">
            <Card className="border-primary/20 shadow-glow/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  Architecture Critique
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="max-h-64 overflow-y-auto scrollbar-glow">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {review.critique}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="suggestions" className="mt-0">
            <Card className="border-warning/20 shadow-glow/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
                  Improvement Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="max-h-64 overflow-y-auto scrollbar-glow">
                  <ul className="space-y-3">
                    {review.suggestions.map((suggestion, index) => (
                      <li key={index} className="text-sm text-muted-foreground group">
                        <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                          <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 group-hover:scale-125 transition-transform"></span>
                          <span>{suggestion}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="references" className="mt-0">
            <Card className="border-success/20 shadow-glow/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  Further Reading
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="max-h-64 overflow-y-auto scrollbar-glow">
                  <ul className="space-y-3">
                    {review.references.map((reference, index) => (
                      <li key={index}>
                        <a 
                          href="#" 
                          className="text-sm text-primary hover:text-primary-glow flex items-center gap-3 group p-2 rounded-lg hover:bg-muted/30 transition-all duration-200"
                        >
                          <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                          <span className="truncate">{reference}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
      
      {!review && !loading && (
        <Card className="border-dashed">
          <CardContent className="pt-6 text-center">
            <Bot className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              Click "Get Review" to analyze your architecture and get AI-powered insights
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}