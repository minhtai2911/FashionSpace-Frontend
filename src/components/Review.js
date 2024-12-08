import { Badge } from "flowbite-react";

import { CalendarDays } from "lucide-react";

import Rating from "./Rating";
import { formatDate, formatURL } from "../utils/format";

function Review({
  user = null,
  rating = null,
  content = "",
  createdDate = "",
}) {
  return (
    <div className="flex flex-col gap-y-1">
      <div className="flex flex-row gap-x-2 items-center">
        <img
          className="w-12 h-12 rounded-full"
          src={formatURL(user?.avatarPath)}
          alt={user?.name}
        />
        <div className="flex flex-col gap-y-1">
          <div className="flex flex-row gap-x-3 items-center">
            <p className="text-sm font-medium">{user?.fullName}</p>
            <Badge color="gray" icon={CalendarDays}>
              {formatDate(createdDate)}
            </Badge>
          </div>
          <div className="flex items-center space-x-1 gap-x-2 text-gray-500">
            {rating && (
              <div className="flex flex-row items-center">
                <Rating percentage={Math.round((rating / 5) * 100)} />
                <p className="ml-2 text-base">{rating}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="ml-14 text-sm mt-1">{content}</div>
    </div>
  );
}

export default Review;
