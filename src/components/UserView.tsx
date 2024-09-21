import { type User } from "lucia";
import type { FC } from "react";
import UserHeaderImage from "./UserHeaderImage";
import UserInfo from "./UserInfo";

interface IUserView {
  user: User;
}

const UserView: FC<IUserView> = ({ user }) => {
  return (
    <div className="flex h-full w-full flex-col">
      <UserHeaderImage userId={user.id} />
      <UserInfo user={user} />
    </div>
  );
};

export default UserView;
