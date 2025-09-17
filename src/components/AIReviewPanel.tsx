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
    <div className="bg-card border-l border-border w-96 p-6 shadow-panel">
      <div className="flex items-center gap-3 mb-6">
        <Bot className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">AI Review</h3>
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="critique" className="text-xs">Critique</TabsTrigger>
            <TabsTrigger value="suggestions" className="text-xs">Suggestions</TabsTrigger>
            <TabsTrigger value="references" className="text-xs">References</TabsTrigger>
          </TabsList>
          
          <TabsContent value="critique" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Architecture Critique</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {review.critique}
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="suggestions" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Improvement Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {review.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      <span className="inline-block w-2 h-2 bg-primary rounded-full mr-3"></span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="references" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Further Reading</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {review.references.map((reference, index) => (
                    <li key={index}>
                      <a 
                        href="#" 
                        className="text-sm text-primary hover:text-primary-glow flex items-center gap-2 group"
                      >
                        <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        {reference}
                      </a>
                    </li>
                  ))}
                </ul>
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