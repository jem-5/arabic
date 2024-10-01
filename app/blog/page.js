import { getAllPosts } from "@/helpers/parseBlog";
import Link from "next/link";

export const metadata = {
  alternates: {
    canonical: "https://arabicroad.com/blog/",
  },
};

export default async function AllPosts() {
  const posts = await getAllPosts();

  return (
    <main className="flex-grow flex flex-col items-left p-3 text-neutral   bg-[white] rounded-md mt-2 drop-shadow-xl border gap-3  w-1/2 max-[999px]:w-4/5">
      <h3 className="font-bold text-xl  self-center ">All Posts</h3>
      <ul className="menu menu-lg  rounded-box w-full ">
        {posts.map((post) => {
          const { id, date, title } = post;
          return (
            <li key={id} className="mt-2">
              <Link
                href={`/blog/${id}`}
                className="flex flex-col items-start bg-base-100 text-[white] hover:bg-primary"
              >
                <p className="text-xl">{title}</p>

                <p className="text-sm">Published on {date}</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
