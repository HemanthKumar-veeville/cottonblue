import { UserListSection } from "./UserListSection";

export const UserList = (): JSX.Element => {
  return (
    <main className="flex flex-col w-full gap-8 p-6 bg-white rounded-lg">
      <UserListSection />
    </main>
  );
};
