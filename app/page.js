import MyButton from "@/components/Button";
import { getAllPosts } from "@/helpers/parseBlog";
import Link from "next/link";

export const metadata = {
  alternates: {
    canonical: "https://arabicroad.com/",
  },
};

export default async function Home() {
  const posts = await getAllPosts();

  const featuredPost = posts.slice(0, 1)[0];
  const spotlightPosts = posts.slice(1, 3);
  const remainderPosts = posts.slice(3, 8);

  const getFirstWords = (string) => {
    string.replace(/<[^>]*>/g, "");
    const n = 50;
    const output = string.split(" ").slice(0, n).join(" ");
    return output + "...";
  };

  return (
    <main className="  flex flex-col items-center  mt-2 ">
      <div
        role="alert"
        className="alert bg-secondary text-neutral  w-full md:w-2/3 flex flex-row"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="h-6 w-6 shrink-0 stroke-current"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <Link href="/dashboard/">
          <span>New modules added! Check dashboard.</span>
        </Link>
      </div>

      <div className="card lg:card-side p-2 bg-base-100 shadow-xl w-full md:w-2/3 ">
        <figure className="  md:h-fit max-[999px]:max-h-96">
          <img src="/featured.jpg" className=" rounded w-5/6 md:w-full  " />
        </figure>
        <div className="card-body">
          <h1 className=" text-3xl text-[rgb(105,184,141)] font-bold ">
            ArabicRoad: Learn Arabic Online Free
          </h1>

          <ul className="rounded   list-outside ">
            <li>
              <span className="text-xl">
                800+ Interactive Vocabulary Flashcards
              </span>
              <p>
                + Comprehensive lessons include a relevant photo, Arabic voice
                narration and English transliteration
              </p>
              <p>
                + Enhances your learning experience and improves memory
                retention
              </p>
            </li>
            <li>
              <span className="text-xl">25+ Individual Modules</span>
              <p>
                + Curriculum organized into logical segments based on topic &
                level
              </p>
              <p>
                + Explore the relevant vocabulary for a trip to the coffee shop,
                doctor, hotel, etc.
              </p>
            </li>

            <li>
              <span className="text-xl">Track Your Progress</span>{" "}
              <p>+ Access the full curriculum immediately without an account</p>
              <p>
                + With a free account, you can track your progress through the
                lessons & quizzes and review missed words
              </p>
            </li>
          </ul>

          <div className="card-actions justify-end">
            <Link href="/dashboard/" className="font-bold">
              <MyButton
                text="Start learning"
                classRest={"bg-secondary text-neutral mb-2"}
              />
            </Link>
          </div>
        </div>
      </div>

      <section className=" max-w-full flex flex-col items-left p-3 m-3 text-neutral  bg-[#ffffff60] rounded-md mt-4 drop-shadow-xl border gap-3 w-5/6 lg:w-2/3">
        <h3 className="font-bold text-xl  self-start text-neutral">
          Latest From the Blog
        </h3>
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
        <h3 className="font-bold text-xl  self-end text-neutral">
          <Link href="/blog/">
            More blog posts
            <kbd className="kbd bg-transparent">▶︎</kbd>
          </Link>
        </h3>
      </section>
      <section className=" max-w-full flex flex-col items-left p-3 m-3 text-neutral  bg-[#ffffff60] rounded-md mt-4 drop-shadow-xl border gap-0 w-5/6 lg:w-2/3 font-bold">
        <h3 className="font-bold text-xl  self-start text-neutral">
          Recent News
        </h3>
        <p>2024-10-25 | Added new module: Nature</p>
        <p>2024-10-20 | Added new module: Love</p>
      </section>
    </main>
  );
}
