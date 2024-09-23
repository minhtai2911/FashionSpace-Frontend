import Rating from "./Rating";

function Review({ user, rating, content }) {
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex flex-row items-center gap-x-2">
        <img
          className="w-10 h-10 rounded-full"
          src={user.avatar}
          alt={user.name}
        />
        <p className="text-sm font-medium">{user.name}</p>
      </div>
      <div className="flex items-center space-x-1 gap-x-2 text-gray-500">
      <div className="flex flex-row items-center">
          <Rating percentage={Math.round((rating / 5) * 100)} />
          <p className="ml-2 text-lg">{rating}</p>
        </div>
      </div>
      <div className="mt-1 text-sm">{content}</div>
    </div>
  );
}

export default Review;
