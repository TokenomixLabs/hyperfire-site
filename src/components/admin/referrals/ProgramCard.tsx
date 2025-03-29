
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ReferralProgram } from "@/types/referral";

interface ProgramCardProps {
  program: ReferralProgram;
  onEdit: (program: ReferralProgram) => void;
  onDelete: (id: string) => void;
}

const ProgramCard = ({ program, onEdit, onDelete }: ProgramCardProps) => {
  return (
    <Card key={program.id} className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            {program.logoUrl && (
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                <img src={program.logoUrl} alt={program.name} className="w-full h-full object-contain" />
              </div>
            )}
            <div>
              <CardTitle className="text-lg">{program.name}</CardTitle>
              <CardDescription className="line-clamp-1">{program.description}</CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onEdit(program)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">Edit program</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={() => onDelete(program.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">Delete program</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-muted-foreground truncate flex-grow">
            {program.linkFormat}
          </span>
          <span className={`ml-2 px-2 py-1 text-xs rounded-full ${program.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'}`}>
            {program.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgramCard;
