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
        <div className="flex flex-row">
          {[...Array(rating)].map((_, index) => (
            <span key={index}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20.0001 28.7833L26.9168 32.9667C28.1835 33.7333 29.7335 32.6 29.4001 31.1666L27.5668 23.3L33.6835 18C34.8001 17.0333 34.2001 15.2 32.7335 15.0833L24.6835 14.4L21.5335 6.96665C20.9668 5.61665 19.0335 5.61665 18.4668 6.96665L15.3168 14.3833L7.26679 15.0666C5.80012 15.1833 5.20012 17.0166 6.31679 17.9833L12.4335 23.2833L10.6001 31.15C10.2668 32.5833 11.8168 33.7167 13.0835 32.95L20.0001 28.7833Z"
                  fill="#FFE066"
                />
              </svg>
            </span>
          ))}
        </div>
        <p>{parseFloat(rating).toFixed(1)}</p>
      </div>
      <div className="mt-1 text-sm">{content}</div>
    </div>
  );
}

export default Review;
