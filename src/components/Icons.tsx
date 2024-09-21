import {
  ArrowRight,
  ArrowUpDown,
  Check,
  CircleDotDashedIcon,
  HeartCrack,
  ImagePlus,
  Link,
  Loader2,
  LogOut,
  Mail,
  Pencil,
  User,
  X,
  Zap,
} from "lucide-react";

export const Icons = {
  check: Check,
  loading: Loader2,
  error: X,
  zap: Zap,
  arrowRight: ArrowRight,
  logout: LogOut,
  heartBreak: HeartCrack,
  arrowUpDown: ArrowUpDown,
  options: CircleDotDashedIcon,
  imagePlus: ImagePlus,
  edit: Pencil,
  user: User,
  email: Mail,
  link: Link
};

export type Icon = typeof Icons;
