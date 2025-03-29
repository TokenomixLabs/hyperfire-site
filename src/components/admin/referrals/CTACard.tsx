
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Edit2, Trash2 } from "lucide-react";
import { CampaignCTA } from "@/types/referral";

interface CTACardProps {
  cta: CampaignCTA;
  programName: string;
  onPreview: (cta: CampaignCTA) => void;
  onEdit: (cta: CampaignCTA) => void;
  onDelete: (id: string) => void;
}

const CTACard = ({ cta, programName, onPreview, onEdit, onDelete }: CTACardProps) => {
  return (
    <Card key={cta.id}>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{cta.buttonText}</CardTitle>
            <CardDescription className="line-clamp-1">
              {programName}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onPreview(cta)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onEdit(cta)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={() => onDelete(cta.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {cta.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded-full">
            {cta.placement}
          </span>
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded-full">
            {cta.theme}
          </span>
          {cta.position && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded-full">
              {cta.position}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CTACard;
