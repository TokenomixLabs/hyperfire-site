
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Referral {
  id: string;
  name: string;
  signupDate: string;
  source: string;
}

interface ReferralsTabProps {
  referrals: Referral[];
}

const ReferralsTab = ({ referrals }: ReferralsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Referrals</CardTitle>
        <CardDescription>
          People who signed up through your referral links
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Signup Date</TableHead>
              <TableHead>Source</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {referrals.map(referral => (
              <TableRow key={referral.id}>
                <TableCell className="font-medium">{referral.name}</TableCell>
                <TableCell>{referral.signupDate}</TableCell>
                <TableCell className="capitalize">{referral.source}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ReferralsTab;
