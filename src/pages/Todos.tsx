import { ChangeEvent, useState } from 'react';
import Paginator from '../components/Pagintaor';
import TodoSkeleton from '../components/TodoSkeleton';
import { ITodoPagintaion } from '../data';
import useAuthenticatedQuery from '../hooks/useAuthenticatedQuery';

const userKey = 'loggedInUserData';
const userDataString = localStorage.getItem(userKey);
const userData = userDataString ? JSON.parse(userDataString) : null;

const TodosPage = () => {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [sortByValue, setSortByValue] = useState<string>('asc');
  // Handlers
  const onClickPrev = () => {
    setPage((prev) => prev - 1);
  };
  const onClickNext = () => {
    setPage((prev) => prev + 1);
  };

  const onPageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setPageSize(+e.target.value);
  };

  const onSortByChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortByValue(e.target.value);
  };

  // Fetching Data By Using React Query [by Our Custom Hook]
  const { data, isLoading, isFetching } = useAuthenticatedQuery({
    queryKey: [`todos-pagintaion-${page}`, `${pageSize}`, `${sortByValue}`],
    url: `/todos?pagination[pageSize]=${pageSize}&pagination[page]=${page}&sort=createdAt:${sortByValue} `,
    config: {
      headers: {
        Authorization: `Bearer ${userData.jwt}`,
      },
    },
  });

  if (isLoading)
    return (
      <div>
        {Array.from({ length: 3 }, (_, idx) => (
          <TodoSkeleton key={idx} />
        ))}
      </div>
    );
  //Renders
  const renderTodosList = data.data.map(
    ({ id, attributes: { title } }: ITodoPagintaion, idx: number) => (
      <div
        key={id}
        className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100"
      >
        <h3 className="w-full font-semibold">
          {idx + 1} - {title}
        </h3>
      </div>
    )
  );

  return (
    <div>
      <div className="flex items-center justify-end space-x-2 text-base">
        <select
          className="border-2 border-indigo-600 rounded-md p-2 outline-none"
          value={sortByValue}
          onChange={onSortByChange}
        >
          <option disabled>Sort By</option>
          <option value="desc">Latest</option>
          <option value="asc">Oldest</option>
        </select>
        <select
          className="border-2 border-indigo-600 rounded-md p-2 outline-none"
          value={pageSize}
          onChange={onPageSizeChange}
        >
          <option disabled>Page Size</option>
          <option value={10}>10</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
      <div className="space-y-3">
        {data.data[0] ? renderTodosList : <h3>You Don't Have Todos Yet!</h3>}
      </div>
      <Paginator
        page={page}
        pageCount={data.meta.pagination.pageCount}
        total={data.meta.pagination.total}
        isLoading={isLoading || isFetching}
        onClickPrev={onClickPrev}
        onClickNext={onClickNext}
      />
    </div>
  );
};

export default TodosPage;
