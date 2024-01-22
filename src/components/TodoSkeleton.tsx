function TodoSkeleton() {
  return (
    <div role="status" className="p-3 space-y-2   animate-pulse ">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-[15px] bg-gray-300 rounded-full dark:bg-gray-700 w-[15px]"></div>
          <div className="w-40 h-3 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="h-9 bg-gray-300 rounded-md dark:bg-gray-700 w-[56.41px]"></div>
          <div className="h-9 bg-gray-300 rounded-md dark:bg-gray-700 w-[83px]"></div>
        </div>
      </div>
    </div>
  );
}

export default TodoSkeleton;
