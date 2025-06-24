import React from 'react';
import { useGetUsersQuery } from '../services/api';

const UsersList: React.FC = () => {
  const { data, error, isLoading } = useGetUsersQuery();

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка загрузки</div>;

  return (
    <div>
      <h2>Пользователи (RTK Query demo)</h2>
      <ul>
        {data?.map((user: any) => (
          <li key={user.id}>
            {user.name} ({user.email})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersList;
