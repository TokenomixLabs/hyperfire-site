
import { useState } from "react";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ContentSchedulerProps {
  onScheduleChange: (scheduleData: {
    isScheduled: boolean;
    publishDate: Date | undefined;
    requiresApproval: boolean;
  }) => void;
  initialValues?: {
    isScheduled: boolean;
    publishDate?: Date;
    requiresApproval: boolean;
  };
}

const ContentScheduler = ({ 
  onScheduleChange,
  initialValues = {
    isScheduled: false,
    publishDate: undefined,
    requiresApproval: true
  }
}: ContentSchedulerProps) => {
  const [isScheduled, setIsScheduled] = useState(initialValues.isScheduled);
  const [date, setDate] = useState<Date | undefined>(initialValues.publishDate);
  const [requiresApproval, setRequiresApproval] = useState(initialValues.requiresApproval);
  
  const handleIsScheduledChange = (checked: boolean) => {
    setIsScheduled(checked);
    onScheduleChange({
      isScheduled: checked,
      publishDate: date,
      requiresApproval
    });
  };
  
  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    onScheduleChange({
      isScheduled,
      publishDate: newDate,
      requiresApproval
    });
  };
  
  const handleRequiresApprovalChange = (checked: boolean) => {
    setRequiresApproval(checked);
    onScheduleChange({
      isScheduled,
      publishDate: date,
      requiresApproval: checked
    });
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      <h3 className="font-medium">Publishing Options</h3>
      
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="scheduled-publishing">Schedule for later</Label>
          <p className="text-sm text-muted-foreground">
            Choose a future date and time to publish
          </p>
        </div>
        <Switch
          id="scheduled-publishing"
          checked={isScheduled}
          onCheckedChange={handleIsScheduledChange}
        />
      </div>
      
      {isScheduled && (
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <div className="space-y-2 flex-1">
            <Label>Publish Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={handleDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2 flex-1">
            <Label>Publish Time</Label>
            <Select defaultValue="09:00">
              <SelectTrigger>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="00:00">12:00 AM</SelectItem>
                <SelectItem value="03:00">3:00 AM</SelectItem>
                <SelectItem value="06:00">6:00 AM</SelectItem>
                <SelectItem value="09:00">9:00 AM</SelectItem>
                <SelectItem value="12:00">12:00 PM</SelectItem>
                <SelectItem value="15:00">3:00 PM</SelectItem>
                <SelectItem value="18:00">6:00 PM</SelectItem>
                <SelectItem value="21:00">9:00 PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between pt-2">
        <div className="space-y-0.5">
          <Label htmlFor="requires-approval">Requires Approval</Label>
          <p className="text-sm text-muted-foreground">
            Content will be reviewed before publishing
          </p>
        </div>
        <Switch
          id="requires-approval"
          checked={requiresApproval}
          onCheckedChange={handleRequiresApprovalChange}
        />
      </div>
    </div>
  );
};

export default ContentScheduler;
