
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FormLabel } from "@/components/ui/form";
import { ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Tag {
  label: string;
  value: string;
}

interface TagSelectorProps {
  tags: Tag[];
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
}

const TagSelector = ({ tags, selectedTags, setSelectedTags }: TagSelectorProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <FormLabel className="block mb-2">Tags</FormLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedTags.length > 0
              ? `${selectedTags.length} tag${
                  selectedTags.length > 1 ? "s" : ""
                } selected`
              : "Select tags..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search tags..." />
            <CommandEmpty>No tags found.</CommandEmpty>
            <CommandGroup>
              {tags.map((tag) => (
                <CommandItem
                  key={tag.value}
                  value={tag.value}
                  onSelect={() => {
                    setSelectedTags((prev) =>
                      prev.includes(tag.value)
                        ? prev.filter((value) => value !== tag.value)
                        : [...prev, tag.value]
                    );
                  }}
                >
                  <div className="flex items-center">
                    <Checkbox
                      checked={selectedTags.includes(tag.value)}
                      className="mr-2 h-4 w-4"
                    />
                    {tag.label}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedTags.map((tagValue) => {
            const tag = tags.find((t) => t.value === tagValue);
            return (
              <div
                key={tagValue}
                className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs flex items-center"
              >
                {tag?.label}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1 hover:bg-transparent"
                  onClick={() =>
                    setSelectedTags((prev) =>
                      prev.filter((t) => t !== tagValue)
                    )
                  }
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TagSelector;
