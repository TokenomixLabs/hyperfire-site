
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Share2 } from "lucide-react";

interface ContentShare {
  id: string;
  title: string;
  date: string;
  clicks: number;
  signups: number;
}

interface SharesTabProps {
  shares: ContentShare[];
}

const SharesTab = ({ shares }: SharesTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Content Shares</CardTitle>
        <CardDescription>
          Track the performance of content you've shared
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Content Title</TableHead>
              <TableHead>Date Shared</TableHead>
              <TableHead>Total Clicks</TableHead>
              <TableHead>Signups</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shares.map(share => (
              <TableRow key={share.id}>
                <TableCell className="font-medium">{share.title}</TableCell>
                <TableCell>{share.date}</TableCell>
                <TableCell>{share.clicks}</TableCell>
                <TableCell>{share.signups}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="h-8">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Again
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SharesTab;
