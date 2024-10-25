import { getAllPosts } from "@/helpers/parseBlog";
import Link from "next/link";

export const metadata = {
  alternates: {
    canonical: "https://arabicroad.com/blog/",
  },
};

export default async function AllPosts() {
  const posts = await getAllPosts();
  const featuredPost = posts.slice(0, 1)[0];
  const spotlightPosts = posts.slice(1, 3);
  const remainderPosts = posts.slice(3, -1);

  const getFirstWords = (string) => {
    string.replace(/<[^>]*>/g, "");
    const n = 50;
    const output = string.split(" ").slice(0, n).join(" ");
    return output + "...";
  };

  return (
    <main className="flex-grow flex flex-col items-left p-3 text-neutral   bg-[white] rounded-md mt-2 drop-shadow-xl border gap-3  w-1/2 max-[999px]:w-4/5">
      <h3 className="font-bold text-xl  self-center ">All Posts</h3>

      <ul className="menu menu-lg  rounded-box w-full ">
        <li className="mt-2 ">
          <Link
            href={`/blog/${featuredPost.id}/`}
            className=" bg-base-100 text-[white] hover:bg-primary flex flex-col"
          >
            <p className="text-2xl font-bold self-start">
              {featuredPost.title}
            </p>
            <p
              className="text-md "
              dangerouslySetInnerHTML={{
                __html: getFirstWords(featuredPost.html),
              }}
            ></p>

            <p className="text-sm  self-start">
              Published on {featuredPost.date}
            </p>
          </Link>
        </li>

        <li className="mt-2 ">
          <Link
            href={`/blog/${spotlightPosts[0].id}/`}
            className=" bg-base-100 text-[white] hover:bg-primary flex flex-col"
          >
            <p className="text-xl  self-start">{spotlightPosts[0].title}</p>
            <p
              className="text-md "
              dangerouslySetInnerHTML={{
                __html: getFirstWords(spotlightPosts[0].html),
              }}
            ></p>

            <p className="text-sm  self-start">
              Published on {spotlightPosts[0].date}
            </p>
          </Link>
        </li>

        <li className="mt-2 ">
          <Link
            href={`/blog/${spotlightPosts[1].id}/`}
            className=" bg-base-100 text-[white] hover:bg-primary flex flex-col"
          >
            <p className="text-xl   self-start">{spotlightPosts[1].title}</p>
            <p
              className="text-md "
              dangerouslySetInnerHTML={{
                __html: getFirstWords(spotlightPosts[1].html),
              }}
            ></p>

            <p className="text-sm  self-start">
              Published on {spotlightPosts[1].date}
            </p>
          </Link>
        </li>

        {remainderPosts.map((post) => {
          const { id, date, title } = post;
          return (
            <li key={id} className="mt-2">
              <Link
                href={`/blog/${id}/`}
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
