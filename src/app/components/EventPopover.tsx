import { Popover, PopoverTrigger, PopoverContent } from "../components/ui/popover";
import { Card, CardHeader, CardContent, CardTitle } from "../components/ui/card";
 type Event = {
  id: string;
  title: string;
  description: string;
  location?: string;
  start: string;  // allow ISO string or Date
  end: string;
  allDay?: boolean;
  color?: string;        // for event category colors
}
interface EventPopoverProps {
  event: Event;
}
export default function EventPopover({ event }: EventPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger className="w-full text-left">
        <div className="p-2 rounded-md hover:bg-gray-100 cursor-pointer">
          {event.title}
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0 shadow-xl rounded-xl">
        <Card className="border-none shadow-none">
          <CardHeader>
            <CardTitle className="text-lg">{event.title}</CardTitle>
            <p className="text-sm text-gray-500">
              {event.start} – {event.end}
            </p>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>{event.description}</p>
            <p className="text-sm text-gray-600">{event.location}</p>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}