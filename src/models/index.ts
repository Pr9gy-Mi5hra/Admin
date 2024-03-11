import { model, models } from "mongoose";

import { ServicesSchema } from "./Services";
import { CasesSchema } from "./Cases";
import { BlogSchema } from "./Blog";
import { CategorySchema } from "./Category";
import { UserSchema } from "./User";
import { CommentSchema } from "./Comments";

const Services = models.Services || model("Services", ServicesSchema);
const Cases = models.Cases || model("Cases", CasesSchema);
const Blog = models.Blog || model("Blog", BlogSchema);

const Category = models.Categories || model("Categories", CategorySchema);
const User = models.Users || model("Users", UserSchema);
const Comments = models.Comments || model("Comments", CommentSchema);
export { Services, Cases, Blog, Category, User, Comments };
